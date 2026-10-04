// File-per-email storage: <dataDir>/<email>.json
//
// - The email has already passed validate.normalizeEmail(); the resolved path is still checked to
//   sit directly inside dataDir before anything touches the disk.
// - Writes go to a temp file that is renamed over the target, so a crash never leaves half a file.
// - Files are 0600 and the directory 0700: only the server's user can read signups.
// - Per-email operations are serialized in-process. Run a single instance per data directory.

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir, open, readFile, readdir, rename, rm } from "node:fs/promises";
import path from "node:path";

const sha256 = (s) => createHash("sha256").update(s).digest("hex");

export class Store {
  constructor({ dataDir, maxRecords }) {
    this.dataDir = path.resolve(dataDir);
    this.maxRecords = maxRecords;
    this.count = 0;
    this.locks = new Map();
  }

  async init() {
    await mkdir(this.dataDir, { recursive: true, mode: 0o700 });
    this.count = (await readdir(this.dataDir)).filter((f) => f.endsWith(".json")).length;
    return this;
  }

  fileFor(email) {
    const file = path.resolve(this.dataDir, `${email}.json`);
    if (path.dirname(file) !== this.dataDir || path.basename(file) !== `${email}.json`) {
      throw new Error("unsafe path");
    }
    return file;
  }

  // Run fn while holding the lock for this email; calls for other emails proceed in parallel.
  async withLock(email, fn) {
    const prev = this.locks.get(email) ?? Promise.resolve();
    let release;
    const mine = new Promise((r) => (release = r));
    const chain = prev.then(() => mine);
    this.locks.set(email, chain);
    await prev;
    try {
      return await fn();
    } finally {
      release();
      if (this.locks.get(email) === chain) this.locks.delete(email);
    }
  }

  async read(file) {
    try {
      return JSON.parse(await readFile(file, "utf8"));
    } catch (err) {
      if (err.code === "ENOENT") return null;
      throw err;
    }
  }

  async write(file, record) {
    const tmp = `${file}.${randomBytes(6).toString("hex")}.tmp`;
    const fh = await open(tmp, "wx", 0o600);
    try {
      await fh.writeFile(JSON.stringify(record, null, 2) + "\n", "utf8");
      await fh.sync();
    } finally {
      await fh.close();
    }
    try {
      await rename(tmp, file);
    } catch (err) {
      await rm(tmp, { force: true });
      throw err;
    }
  }

  /**
   * Create the record for a new email and return a fresh step-2 token.
   * Returns { created: false } if the email is already stored (the record is left untouched) or
   * the store is full.
   */
  async signup(sub, now = new Date()) {
    return this.withLock(sub.email, async () => {
      const file = this.fileFor(sub.email);
      if (await this.read(file)) return { created: false };
      if (this.count >= this.maxRecords) return { created: false, full: true };
      const token = randomBytes(32).toString("base64url");
      await this.write(file, {
        email: sub.email,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        signup: {
          loc: sub.loc,
          variant: sub.variant,
          lang: sub.lang,
          votes: sub.votes,
          utm: sub.utm,
          referrer: sub.referrer,
        },
        details: null,
        tokenHash: sha256(token),
      });
      this.count++;
      return { created: true, token };
    });
  }

  /**
   * Attach the optional step-2 answers. Only written when the token matches the one issued at
   * signup and no answers were stored yet, so nobody can overwrite another person's answers.
   */
  async details(sub, now = new Date()) {
    return this.withLock(sub.email, async () => {
      const file = this.fileFor(sub.email);
      const record = await this.read(file);
      if (!record || record.details || typeof record.tokenHash !== "string") return { saved: false };
      const given = Buffer.from(sha256(sub.token), "hex");
      const stored = Buffer.from(record.tokenHash, "hex");
      if (given.length !== stored.length || !timingSafeEqual(given, stored)) return { saved: false };
      record.details = {
        persona: sub.persona,
        features: sub.features,
        price: sub.price,
        worry: sub.worry,
        variant: sub.variant,
        lang: sub.lang,
        votes: sub.votes,
        submittedAt: now.toISOString(),
      };
      record.updatedAt = now.toISOString();
      await this.write(file, record);
      return { saved: true };
    });
  }
  /**
   * Read a record and return it without the internal tokenHash field.
   * Safe to send to the user who owns that email.
   */
  async readPublic(email) {
    const file = this.fileFor(email);
    const record = await this.read(file);
    if (!record) return null;
    const { tokenHash: _omit, ...pub } = record;
    return pub;
  }
}
