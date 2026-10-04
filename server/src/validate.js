// Input validation for waitlist submissions. Pure functions, no I/O.
//
// Everything the page can send is allowlisted here: unknown fields, wrong types, values outside
// the form's options, and over-long strings are rejected rather than cleaned up and stored.

export const LIMITS = {
  bodyBytes: 8 * 1024,
  email: 254, // RFC 5321 path limit
  emailLocal: 64,
  worry: 600, // matches the textarea's maxlength
  utmValue: 100,
  referrer: 500,
  token: 43, // 32 random bytes, base64url
};

const ENUMS = {
  stage: ["signup", "details"],
  loc: ["hero", "final"],
  variant: ["privacy", "security", "ease"],
  lang: ["en", "ar"],
  vote: ["privacy", "security", "ease"],
  persona: ["privacy_advocate", "professional", "tech_maker", "everyday", "gift_family"],
  feature: ["offline_vault", "autotype", "totp", "import", "extension", "backup", "bluetooth"],
  price: ["lt50", "50_80", "80_120", "gt120", "lt30", "30_50"], // lt30/30_50: old options, still sent by cached pages
};
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

const COMMON = ["stage", "email", "variant", "lang", "votes", "utm", "referrer", "ts", "website"];
const ALLOWED = {
  signup: new Set([...COMMON, "loc"]),
  details: new Set([...COMMON, "token", "persona", "features", "price", "worry"]),
};

// The email doubles as the file name, so the accepted alphabet is deliberately narrower than RFC 5322:
// lowercase letters, digits and . _ % + - in the local part (no leading, trailing or doubled dots),
// and LDH domain labels with an alphabetic or punycode TLD. No "/", "\", NUL or ".." can get through.
const LOCAL_RE = /^[a-z0-9_%+-]+(?:\.[a-z0-9_%+-]+)*$/;
const LABEL_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const TLD_RE = /^(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/;
const TOKEN_RE = /^[A-Za-z0-9_-]{43}$/;

// C0/C1 controls (except tab and newline), zero-width and bidi override characters.
const UNSAFE_CHARS = /[\u0000-\u0008\u000B-\u001F\u007F-\u009F​-‏‪-‮⁠-⁤⁦-⁩﻿]/g;

export class ValidationError extends Error {
  constructor(fields) {
    super("invalid input");
    this.fields = fields;
  }
}

export function normalizeEmail(value) {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (email.length < 6 || email.length > LIMITS.email) return null;
  const at = email.indexOf("@");
  if (at < 1 || at !== email.lastIndexOf("@")) return null;
  const local = email.slice(0, at);
  const labels = email.slice(at + 1).split(".");
  if (local.length > LIMITS.emailLocal || !LOCAL_RE.test(local)) return null;
  if (labels.length < 2 || !labels.every((l) => LABEL_RE.test(l)) || !TLD_RE.test(labels.at(-1))) return null;
  return email;
}

function cleanText(value, max, { multiline = false } = {}) {
  if (typeof value !== "string") return undefined;
  let s = value.normalize("NFC").replace(UNSAFE_CHARS, "");
  s = multiline ? s.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n") : s.replace(/[\t\n]/g, " ");
  s = s.trim();
  return s.length <= max ? s : undefined;
}

function oneOf(value, list) {
  return value === null || value === undefined ? null : list.includes(value) ? value : undefined;
}

function subsetOf(value, list) {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > list.length) return undefined;
  const out = [...new Set(value)];
  return out.length === value.length && out.every((v) => list.includes(v)) ? out : undefined;
}

function utmOf(value) {
  if (value === undefined || value === null) return {};
  if (typeof value !== "object" || Array.isArray(value)) return undefined;
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    if (!UTM_KEYS.includes(k)) return undefined;
    const s = cleanText(v, LIMITS.utmValue);
    if (s === undefined) return undefined;
    if (s) out[k] = s;
  }
  return out;
}

function referrerOf(value) {
  if (value === undefined || value === null || value === "") return null;
  const s = cleanText(value, LIMITS.referrer);
  if (!s) return undefined;
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:" ? u.href.slice(0, LIMITS.referrer) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Validate a parsed request body. Returns a normalized submission, or throws ValidationError
 * listing the offending field names (never their values).
 */
export function validateSubmission(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new ValidationError(["body"]);

  const stage = oneOf(body.stage, ENUMS.stage);
  if (!stage) throw new ValidationError(["stage"]);

  const bad = Object.keys(body).filter((k) => !ALLOWED[stage].has(k));
  const check = (name, value) => {
    if (value === undefined) bad.push(name);
    return value;
  };

  const out = {
    stage,
    email: check("email", normalizeEmail(body.email) ?? undefined),
    variant: check("variant", oneOf(body.variant, ENUMS.variant)),
    lang: check("lang", oneOf(body.lang, ENUMS.lang)),
    votes: check("votes", subsetOf(body.votes, ENUMS.vote)),
    utm: check("utm", utmOf(body.utm)),
    referrer: check("referrer", referrerOf(body.referrer)),
    // Honeypot: a hidden field people never see. Any value marks the request as automated.
    bot: typeof body.website === "string" ? body.website.length > 0 : body.website !== undefined,
  };

  if (stage === "signup") {
    out.loc = check("loc", oneOf(body.loc, ENUMS.loc));
  } else {
    out.token = check("token", typeof body.token === "string" && TOKEN_RE.test(body.token) ? body.token : undefined);
    out.persona = check("persona", oneOf(body.persona, ENUMS.persona));
    out.features = check("features", subsetOf(body.features, ENUMS.feature));
    out.price = check("price", oneOf(body.price, ENUMS.price));
    out.worry = check("worry", body.worry === undefined || body.worry === null ? "" : cleanText(body.worry, LIMITS.worry, { multiline: true }));
  }

  if (bad.length) throw new ValidationError([...new Set(bad)]);
  return out;
}
