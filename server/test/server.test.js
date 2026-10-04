import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { createApp } from "../src/server.js";
import { Store } from "../src/store.js";

const ORIGIN = "https://example.github.io";
let dir, server, base;

before(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "waitlist-"));
  const config = { allowedOrigins: [ORIGIN], trustProxy: 0, rateLimit: { max: 1000, windowMs: 60_000 } };
  server = createApp(config, await new Store({ dataDir: dir, maxRecords: 100 }).init());
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  server.close();
  await rm(dir, { recursive: true, force: true });
});

const post = (body, { origin = ORIGIN, type = "text/plain;charset=utf-8" } = {}) =>
  fetch(`${base}/api/waitlist`, {
    method: "POST",
    headers: { "Content-Type": type, ...(origin ? { Origin: origin } : {}) },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
const readRecord = async (email) => JSON.parse(await readFile(path.join(dir, `${email}.json`), "utf8"));

test("signup writes <email>.json and returns a token", async () => {
  const res = await post({ stage: "signup", email: "New.User@Example.com", loc: "hero", variant: "privacy", lang: "en", votes: [], utm: {}, referrer: null });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("access-control-allow-origin"), ORIGIN);
  assert.equal(res.headers.get("x-content-type-options"), "nosniff");
  const { ok, token } = await res.json();
  assert.equal(ok, true);
  assert.match(token, /^[A-Za-z0-9_-]{43}$/);

  const rec = await readRecord("new.user@example.com");
  assert.equal(rec.email, "new.user@example.com");
  assert.equal(rec.signup.loc, "hero");
  assert.equal(rec.details, null);
  assert.equal("token" in rec, false); // only the hash is stored
  assert.equal((await stat(path.join(dir, "new.user@example.com.json"))).mode & 0o777, 0o600);
});

test("details are saved once, only with the signup token", async () => {
  const email = "details@example.com";
  const { token } = await (await post({ stage: "signup", email })).json();

  const wrong = await post({ stage: "details", email, token: "B".repeat(43), persona: "everyday" });
  assert.equal(wrong.status, 200); // same answer either way
  assert.equal((await readRecord(email)).details, null);

  await post({ stage: "details", email, token, persona: "tech_maker", features: ["totp"], price: "30_50", worry: "price" });
  const rec = await readRecord(email);
  assert.equal(rec.details.persona, "tech_maker");
  assert.equal(rec.details.worry, "price");

  await post({ stage: "details", email, token, persona: "everyday" }); // second write ignored
  assert.equal((await readRecord(email)).details.persona, "tech_maker");
});

test("repeat signup does not touch the record or reveal that it exists", async () => {
  const email = "repeat@example.com";
  const first = await (await post({ stage: "signup", email, loc: "hero" })).json();
  const before = await readRecord(email);
  const second = await post({ stage: "signup", email, loc: "final" });
  assert.equal(second.status, 200);
  const body = await second.json();
  assert.equal(body.ok, true);
  assert.notEqual(body.token, first.token);
  assert.deepEqual(await readRecord(email), before);

  // the throwaway token cannot be used to write answers
  await post({ stage: "details", email, token: body.token, persona: "everyday" });
  assert.equal((await readRecord(email)).details, null);
});

test("honeypot submissions are accepted but not stored", async () => {
  const res = await post({ stage: "signup", email: "bot@example.com", website: "http://spam.example" });
  assert.equal(res.status, 200);
  await assert.rejects(readFile(path.join(dir, "bot@example.com.json")));
});

test("rejects bad input without writing anything", async () => {
  const filesBefore = (await readdir(dir)).length;
  const cases = [
    [{ stage: "signup", email: "../../evil@example.com" }, 400],
    [{ stage: "signup", email: "a@example.com", extra: 1 }, 400],
    [{ stage: "details", email: "a@example.com", token: "A".repeat(43), worry: "x".repeat(601) }, 400],
    ["{not json", 400],
  ];
  for (const [body, status] of cases) {
    const res = await post(body);
    assert.equal(res.status, status);
    assert.equal((await res.json()).ok, false);
  }
  const fields = (await (await post({ stage: "signup", email: "a@example.com", extra: 1 })).json()).fields;
  assert.deepEqual(fields, ["extra"]);
  assert.equal((await readdir(dir)).length, filesBefore);
});

test("enforces origin, content type, method and body size", async () => {
  assert.equal((await post({ stage: "signup", email: "o@example.com" }, { origin: "https://evil.example" })).status, 403);
  assert.equal((await post({ stage: "signup", email: "o@example.com" }, { origin: null })).status, 403);
  assert.equal((await post({ stage: "signup", email: "o@example.com" }, { type: "application/x-www-form-urlencoded" })).status, 415);
  assert.equal((await post("x".repeat(9000))).status, 413);
  assert.equal((await fetch(`${base}/api/waitlist`, { headers: { Origin: ORIGIN } })).status, 405);
  assert.equal((await fetch(`${base}/nope`)).status, 404);

  const pre = await fetch(`${base}/api/waitlist`, { method: "OPTIONS", headers: { Origin: ORIGIN } });
  assert.equal(pre.status, 204);
  assert.equal(pre.headers.get("access-control-allow-methods"), "POST");
});

test("rate limits per client", async () => {
  const d = await mkdtemp(path.join(tmpdir(), "waitlist-rl-"));
  const s = createApp({ allowedOrigins: [ORIGIN], trustProxy: 0, rateLimit: { max: 2, windowMs: 60_000 } },
    await new Store({ dataDir: d, maxRecords: 100 }).init());
  await new Promise((r) => s.listen(0, "127.0.0.1", r));
  const url = `http://127.0.0.1:${s.address().port}/api/waitlist`;
  const hit = () => fetch(url, { method: "POST", headers: { Origin: ORIGIN, "Content-Type": "text/plain" }, body: '{"stage":"signup","email":"r@example.com"}' });
  assert.equal((await hit()).status, 200);
  assert.equal((await hit()).status, 200);
  const third = await hit();
  assert.equal(third.status, 429);
  assert.ok(Number(third.headers.get("retry-after")) > 0);
  s.close();
  await rm(d, { recursive: true, force: true });
});

test("parallel signups for one email create a single record", async () => {
  const email = "race@example.com";
  const results = await Promise.all(Array.from({ length: 10 }, () => post({ stage: "signup", email })));
  assert.ok(results.every((r) => r.status === 200));
  const files = (await readdir(dir)).filter((f) => f.startsWith("race@"));
  assert.deepEqual(files, ["race@example.com.json"]);
});
