# SecureSafeX waitlist API

A small Node.js server that receives the landing page's waitlist form and saves each signup as
`data/<email>.json`. It has no dependencies; Node 20 or newer is enough.

GitHub Pages only hosts static files, so this server has to run somewhere else, such as a small VPS,
Fly.io, Render, or Railway. It needs a **persistent disk** for the JSON files.

## Run locally

```bash
cd server
npm start                                       # API on http://127.0.0.1:8787
python3 -m http.server 8000 --directory ..      # the page, in a second terminal
```

Open <http://localhost:8000>. When the page is opened from `localhost`, it posts to
`http://localhost:8787/api/waitlist` automatically. Run the tests with `npm test`.

## Configuration (environment variables)

| Variable | Default | Purpose |
|---|---|---|
| `PORT` / `HOST` | `8787` / `127.0.0.1` | Where to listen. Keep `127.0.0.1` behind a reverse proxy. |
| `DATA_DIR` | `server/data` | Where the JSON files go. Use a path outside the web root in production. |
| `ALLOWED_ORIGINS` | `http://localhost:8000,http://127.0.0.1:8000` | Comma-separated origins allowed to post, e.g. `https://<user>.github.io`. |
| `TRUST_PROXY` | `0` | Number of reverse proxies in front of the server (used to read the client IP for rate limiting). |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MS` | `10` / `600000` | Requests allowed per IP per window. |
| `MAX_RECORDS` | `50000` | Stops creating files past this count, to protect the disk. |

## Going live

1. Deploy `server/` behind HTTPS (for example Caddy or nginx), with
   `ALLOWED_ORIGINS=https://<user>.github.io` and `TRUST_PROXY=1`.
2. In `index.html` (and `assets/js/home-v2.js`), set `CONFIG.endpoint` to
   `https://<your-api-host>/api/waitlist`.

## API

`POST /api/waitlist`, with body `text/plain` or `application/json`, at most 8 KB.

- **Signup** `{ stage: "signup", email, loc, variant, lang, votes, utm, referrer }`
  returns `{ ok: true, token }`.
- **Answers** `{ stage: "details", email, token, persona, features, price, worry, variant, lang, votes }`
  returns `{ ok: true }`.

Errors look like `{ ok: false, error, fields? }`, with status 400 (invalid input), 403 (origin not
allowed), 413 (body too large), 415 (wrong content type) or 429 (rate limited, with a `Retry-After`
header).

`GET /healthz` returns `{ ok: true }`.

## Stored file

`data/new.user@example.com.json`:

```json
{
  "email": "new.user@example.com",
  "createdAt": "…", "updatedAt": "…",
  "signup": { "loc": "hero", "variant": "ease", "lang": "ar", "votes": [], "utm": {}, "referrer": null },
  "details": { "persona": "tech_maker", "features": ["totp"], "price": "50_80", "worry": "…", "submittedAt": "…" },
  "tokenHash": "<sha256 of the step-2 token>"
}
```

## Security measures

- **Safe file names.** The email is trimmed and lowercased. Only `a-z 0-9 . _ % + -` is allowed
  before the `@`, with no leading, trailing or doubled dots. The domain must be made of valid
  domain labels. Total length is at most 254 characters, with at most 64 before the `@`. Before
  writing, the resolved path is checked to sit directly inside `DATA_DIR`, so `../`, `/` and NUL
  can't get through.
- **Strict input checks.** Unknown fields are rejected. Choice fields must be one of the form's
  values. Lists can't contain duplicates. `worry` is limited to 600 characters, UTM values to 100,
  and `referrer` to 500 (http or https only). Control, zero-width and bidi-override characters are
  stripped from text.
- **No overwrites and no email lookups.** A repeat signup leaves the existing file untouched and gets
  the same kind of reply as a new one. Step-2 answers are saved only with the token issued at signup,
  and only once. Only a hash of the token is stored, and it's compared in constant time.
- **Abuse limits.**
  - Requests are allowed only from `ALLOWED_ORIGINS`.
  - There's a per-IP rate limit, an 8 KB body limit, and request and header timeouts.
  - A hidden honeypot field catches bots. Their submissions get a normal reply and are discarded.
  - A record cap protects the disk.
- **Storage.**
  - Writes are atomic: the server writes a temp file and then renames it.
  - Files are `0600` and the folder is `0700`.
  - Every response is sent with `no-store`, `nosniff`, a strict CSP and `no-referrer` headers.
- **Logs.** Logs contain a salted hash of the email, never the address itself.

## Limits

- Run **one instance** per data folder. Per-email locking happens inside one process.
- Only ASCII addresses are accepted. Internationalized domains work in their `xn--` (punycode) form.
- The `worry` text is user input. Escape it before showing it in any HTML admin view.
