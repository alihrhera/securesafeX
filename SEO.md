# SEO

Production URL used in `canonical`, `og:*`, JSON-LD, `robots.txt` and `sitemap.xml`: `https://securesafex.pollenbyte.com/`.
If the domain changes, search-and-replace it in those five places.

## Do by hand (needs your accounts)

1. **Search Console**: add `https://securesafex.pollenbyte.com/` as a URL-prefix property, verify with the HTML tag
   (paste the `<meta name="google-site-verification" ...>` it gives you into `<head>` in `index.html`) or a DNS TXT record.
   Then submit `https://securesafex.pollenbyte.com/sitemap.xml` and run URL Inspection on `/`.
2. **Bing Webmaster Tools**: import the site from Search Console.
3. **HTTPS**: the TLS terminator in front of the container must send `X-Forwarded-Proto`; `nginx.conf` then redirects
   `http` to `https` and sends HSTS (1 year, no `includeSubDomains`).
4. **Re-check**: after deploy, test the page in the Rich Results Test and PageSpeed Insights (mobile).
5. **Social preview**: re-scrape with the Facebook Sharing Debugger / LinkedIn Post Inspector (they cache `og:image`).

## Known limits

- Arabic is a client-side switch on the same URL (`?lang=ar`), so search engines index the English raw HTML only.
  Ranking in Arabic needs a real `/ar/` page with its own title, description, canonical and `hreflang` pair.
- No `Product` schema on purpose: there is no price, availability or review to state truthfully yet.
  Add `Product` + `offers` when the price is set.

## Backlink strategy (pre-launch, no fabricated proof)

Goal: a few relevant, editorial links, not volume.

1. **Maker / hardware communities**: post the ESP32-S3 build story on Hackaday.io, r/esp32, r/selfhosted, r/privacy, and the
   Arduino / ESP32 forums, with the landing page as the project link.
2. **Privacy and security writers**: pitch the "no server, nothing to breach" angle (2022 vault-backup theft is the hook)
   to privacy newsletters and blogs. Offer a prototype for hands-on review.
3. **Arabic tech audience** (primary market): Egyptian and MENA tech blogs, YouTube creators, and Facebook/Telegram groups
   for programmers and privacy; a short Arabic write-up links better than a translated English one.
4. **Directories**: Product Hunt "upcoming" page, AlternativeTo (as an alternative to cloud managers), Indie Hackers,
   Hacker News "Show HN" once there is something to try.
5. **Own the profiles**: GitHub, LinkedIn, X and YouTube profiles for the project, each linking home; once they exist,
   add them to `sameAs` in the Organization JSON-LD.
6. **Comparison content**: a "hardware password manager vs cloud manager" article that others cite; the table on the page
   is the seed.

Avoid bought links, link exchanges and comment spam.
