import assert from "node:assert/strict";
import { test } from "node:test";
import { LIMITS, ValidationError, normalizeEmail, validateSubmission } from "../src/validate.js";

const fields = (fn) => {
  try {
    fn();
  } catch (err) {
    assert.ok(err instanceof ValidationError);
    return err.fields;
  }
  assert.fail("expected ValidationError");
};

test("normalizeEmail accepts ordinary addresses and lowercases them", () => {
  assert.equal(normalizeEmail("  Ali.Hrhera+news@Example.co.uk "), "ali.hrhera+news@example.co.uk");
  assert.equal(normalizeEmail("a_b-c%d@sub-domain.example.com"), "a_b-c%d@sub-domain.example.com");
  assert.equal(normalizeEmail("me@xn--mgbh0fb.xn--mgbaam7a8h"), "me@xn--mgbh0fb.xn--mgbaam7a8h");
});

test("normalizeEmail rejects anything unsafe as a file name", () => {
  for (const bad of [
    "../../etc/passwd@x.com", "a/b@example.com", "a\\b@example.com", "a\u0000b@example.com",
    ".a@example.com", "a.@example.com", "a..b@example.com", "a@b@example.com", "a@example",
    "a@-example.com", "a@example.c", "a@exa_mple.com", "a b@example.com", "ä@example.com",
    "a@example..com", "", null, 42, { email: "a@example.com" },
  ]) {
    assert.equal(normalizeEmail(bad), null, `should reject ${JSON.stringify(bad)}`);
  }
});

test("normalizeEmail enforces length limits", () => {
  assert.equal(normalizeEmail(`${"a".repeat(64)}@example.com`), `${"a".repeat(64)}@example.com`);
  assert.equal(normalizeEmail(`${"a".repeat(65)}@example.com`), null);
  const label = "b".repeat(63);
  const long = `a@${label}.${label}.${label}.${"c".repeat(57)}.com`; // 255 chars
  assert.equal(long.length, 255);
  assert.equal(normalizeEmail(long), null);
  const max = `a@${label}.${label}.${label}.${"c".repeat(56)}.com`; // exactly 254 chars
  assert.equal(max.length, LIMITS.email);
  assert.equal(normalizeEmail(max), max);
});

test("signup: valid body is normalized", () => {
  const out = validateSubmission({
    stage: "signup", email: "Me@Example.com", loc: "hero", variant: "ease", lang: "ar",
    votes: ["privacy"], utm: { utm_source: "  x‮y " }, referrer: "https://t.co/abc", ts: "ignored",
  });
  assert.equal(out.email, "me@example.com");
  assert.equal(out.utm.utm_source, "xy");
  assert.equal(out.referrer, "https://t.co/abc");
  assert.equal(out.bot, false);
  assert.equal("ts" in out, false);
});

test("rejects unknown fields, wrong enums and wrong types", () => {
  assert.deepEqual(fields(() => validateSubmission({ stage: "signup", email: "a@b.co", admin: true })), ["admin"]);
  assert.deepEqual(fields(() => validateSubmission({ stage: "nope" })), ["stage"]);
  assert.deepEqual(fields(() => validateSubmission({ stage: "signup", email: "a@b.co", loc: "footer" })), ["loc"]);
  assert.deepEqual(fields(() => validateSubmission({ stage: "signup", email: "a@b.co", votes: ["privacy", "privacy"] })), ["votes"]);
  assert.deepEqual(fields(() => validateSubmission({ stage: "signup", email: "a@b.co", votes: "privacy" })), ["votes"]);
  assert.deepEqual(fields(() => validateSubmission({ stage: "signup", email: "a@b.co", utm: { evil: "1" } })), ["utm"]);
  assert.deepEqual(fields(() => validateSubmission({ stage: "signup", email: "a@b.co", referrer: "javascript:alert(1)" })), ["referrer"]);
  assert.deepEqual(fields(() => validateSubmission({ stage: "signup", email: "nope" })), ["email"]);
  assert.deepEqual(fields(() => validateSubmission({ stage: "signup", email: "a@b.co", token: "x" })), ["token"]);
  assert.deepEqual(fields(() => validateSubmission(["stage"])), ["body"]);
});

test("details: enforces token format, enums and worry length", () => {
  const token = "A".repeat(43);
  const ok = validateSubmission({
    stage: "details", email: "a@b.co", token, persona: "tech_maker", features: ["totp", "import"],
    price: "50_80", worry: " losing it\r\n\r\n\r\n\r\nprice\u0007 ",
  });
  assert.deepEqual(ok.features, ["totp", "import"]);
  assert.equal(ok.worry, "losing it\n\nprice");

  assert.deepEqual(fields(() => validateSubmission({ stage: "details", email: "a@b.co" })), ["token"]);
  assert.deepEqual(fields(() => validateSubmission({ stage: "details", email: "a@b.co", token: "short" })), ["token"]);
  assert.deepEqual(fields(() => validateSubmission({ stage: "details", email: "a@b.co", token, price: "free" })), ["price"]);
  assert.deepEqual(fields(() => validateSubmission({ stage: "details", email: "a@b.co", token, features: ["x"] })), ["features"]);
  assert.deepEqual(fields(() => validateSubmission({ stage: "details", email: "a@b.co", token, worry: "x".repeat(LIMITS.worry + 1) })), ["worry"]);
  assert.deepEqual(fields(() => validateSubmission({ stage: "details", email: "a@b.co", token, worry: 5 })), ["worry"]);
  assert.equal(validateSubmission({ stage: "details", email: "a@b.co", token, worry: "x".repeat(LIMITS.worry) }).worry.length, LIMITS.worry);
});

test("honeypot marks bots", () => {
  assert.equal(validateSubmission({ stage: "signup", email: "a@b.co", website: "" }).bot, false);
  assert.equal(validateSubmission({ stage: "signup", email: "a@b.co", website: "http://spam" }).bot, true);
});
