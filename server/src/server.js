// SecureSafeX waitlist API. Zero dependencies (Node >= 20).
//
//   POST /api/waitlist   { stage: "signup" | "details", email, ... }   -> 200 { ok: true, token? }
//   GET  /healthz                                                      -> 200 { ok: true }
//
// Responses never reveal whether an email is already on the list: a repeat signup gets the same
// shape of answer as a new one, and step-2 answers are accepted silently even when not stored.

import { createHash, randomBytes } from "node:crypto";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { Store } from "./store.js";
import { LIMITS, ValidationError, validateSubmission } from "./validate.js";

export function loadConfig(env = process.env) {
  return {
    port: Number(env.PORT ?? 8787),
    host: env.HOST ?? "127.0.0.1",
    dataDir: env.DATA_DIR ?? fileURLToPath(new URL("../data", import.meta.url)),
    allowedOrigins: (env.ALLOWED_ORIGINS ?? "http://localhost:8000,http://127.0.0.1:8000")
      .split(",").map((s) => s.trim().replace(/\/$/, "")).filter(Boolean),
    // Number of reverse proxies in front of the server whose X-Forwarded-For can be trusted (0 = none).
    trustProxy: Number(env.TRUST_PROXY ?? 0),
    rateLimit: { max: Number(env.RATE_LIMIT_MAX ?? 10), windowMs: Number(env.RATE_LIMIT_WINDOW_MS ?? 10 * 60_000) },
    maxRecords: Number(env.MAX_RECORDS ?? 50_000),
  };
}

const SECURITY_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
  "Cross-Origin-Resource-Policy": "same-site",
};

class HttpError extends Error {
  constructor(status, code, extra = {}) {
    super(code);
    this.status = status;
    this.body = { ok: false, error: code, ...extra };
  }
}

// Fixed-window counter per client IP, kept in memory.
class RateLimiter {
  constructor({ max, windowMs }) {
    this.max = max;
    this.windowMs = windowMs;
    this.hits = new Map();
    this.timer = setInterval(() => this.sweep(), windowMs).unref();
  }
  take(key, now = Date.now()) {
    const e = this.hits.get(key);
    if (!e || now >= e.reset) {
      this.hits.set(key, { n: 1, reset: now + this.windowMs });
      return { ok: true };
    }
    e.n++;
    return e.n <= this.max ? { ok: true } : { ok: false, retryAfter: Math.ceil((e.reset - now) / 1000) };
  }
  sweep(now = Date.now()) {
    for (const [k, e] of this.hits) if (now >= e.reset) this.hits.delete(k);
  }
}

function clientIp(req, trustProxy) {
  const xff = req.headers["x-forwarded-for"];
  if (trustProxy > 0 && typeof xff === "string") {
    const hops = xff.split(",").map((s) => s.trim()).filter(Boolean);
    // The right-most entries were added by our own proxies; the one before them is the client.
    const ip = hops[hops.length - trustProxy];
    if (ip) return ip;
  }
  return req.socket.remoteAddress ?? "unknown";
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const declared = Number(req.headers["content-length"]);
    if (declared > limit) return reject(new HttpError(413, "too_large"));
    const chunks = [];
    let size = 0;
    let over = false;
    req.on("data", (c) => {
      if (over) return; // discard the rest; the 413 closes the connection (requestTimeout bounds it)
      size += c.length;
      if (size > limit) {
        over = true;
        chunks.length = 0;
        reject(new HttpError(413, "too_large"));
      } else chunks.push(c);
    });
    req.on("end", () => over || resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

export function createApp(config, store) {
  const limiter = new RateLimiter(config.rateLimit);
  const logSalt = randomBytes(16);
  const logId = (email) => createHash("sha256").update(logSalt).update(email).digest("hex").slice(0, 10);
  const allowed = new Set(config.allowedOrigins);

  async function handle(req, res) {
    const url = new URL(req.url, "http://x");
    const origin = req.headers.origin;

    if (url.pathname === "/healthz" && req.method === "GET") return [200, { ok: true }];
    if (url.pathname !== "/api/waitlist") throw new HttpError(404, "not_found");

    // CORS: only the landing page's own origin(s) may call the API from a browser.
    if (!origin || !allowed.has(origin)) throw new HttpError(403, "origin_not_allowed");
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");

    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Methods", "POST");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Access-Control-Max-Age", "600");
      return [204, null];
    }
    if (req.method !== "POST") throw new HttpError(405, "method_not_allowed");

    const rl = limiter.take(clientIp(req, config.trustProxy));
    if (!rl.ok) {
      res.setHeader("Retry-After", String(rl.retryAfter));
      throw new HttpError(429, "rate_limited");
    }

    const type = String(req.headers["content-type"] ?? "").split(";")[0].trim().toLowerCase();
    if (type !== "application/json" && type !== "text/plain") throw new HttpError(415, "unsupported_type");

    let body;
    try {
      body = JSON.parse(await readBody(req, LIMITS.bodyBytes));
    } catch (err) {
      if (err instanceof HttpError) throw err;
      throw new HttpError(400, "invalid_json");
    }

    let sub;
    try {
      sub = validateSubmission(body);
    } catch (err) {
      if (err instanceof ValidationError) throw new HttpError(400, "invalid_input", { fields: err.fields });
      throw err;
    }

    // Bots that fill the hidden field get a normal-looking answer and nothing is stored.
    if (sub.bot) return [200, sub.stage === "signup" ? { ok: true, token: randomBytes(32).toString("base64url") } : { ok: true }];

    if (sub.stage === "signup") {
      const r = await store.signup(sub);
      if (r.full) console.warn("[waitlist] store full: MAX_RECORDS reached");
      if (r.created) console.log(`[waitlist] signup ${logId(sub.email)}`);
      // Existing emails get a throwaway token that matches nothing, so the answer looks the same.
      const token = r.token ?? randomBytes(32).toString("base64url");
      const record = r.created ? await store.readPublic(sub.email) : null;
      return [200, { ok: true, token, record }];
    }

    const r = await store.details(sub);
    if (r.saved) console.log(`[waitlist] details ${logId(sub.email)}`);
    const record = r.saved ? await store.readPublic(sub.email) : null;
    return [200, { ok: true, record }];
  }

  return http.createServer(async (req, res) => {
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.setHeader(k, v);
    let status, payload;
    try {
      [status, payload] = await handle(req, res);
    } catch (err) {
      if (err instanceof HttpError) {
        [status, payload] = [err.status, err.body];
        if (status === 413) res.setHeader("Connection", "close");
        if (status === 405) res.setHeader("Allow", "POST, OPTIONS");
      } else {
        console.error("[waitlist] error:", err.code ?? err.message);
        [status, payload] = [500, { ok: false, error: "server_error" }];
      }
    }
    if (res.headersSent || res.destroyed) return;
    res.statusCode = status;
    res.end(payload === null ? undefined : JSON.stringify(payload));
  });
}

export async function start(config = loadConfig()) {
  const store = await new Store({ dataDir: config.dataDir, maxRecords: config.maxRecords }).init();
  const server = createApp(config, store);
  server.requestTimeout = 10_000;
  server.headersTimeout = 5_000;
  server.keepAliveTimeout = 5_000;
  server.maxRequestsPerSocket = 100;
  await new Promise((r) => server.listen(config.port, config.host, r));
  console.log(`[waitlist] listening on http://${config.host}:${config.port} (origins: ${config.allowedOrigins.join(", ")})`);
  const stop = () => server.close(() => process.exit(0));
  process.once("SIGTERM", stop);
  process.once("SIGINT", stop);
  return server;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) start();
