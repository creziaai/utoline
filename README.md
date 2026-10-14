# Utoline — Useful Tools. One Online Destination.

Utoline is a static website with 57 browser-based utilities across calculators, converters, text, developer, image, PDF, SEO, security, date/time, and miscellaneous tools. It is generated with plain Node.js and has no npm package dependencies for building.

## Requirements

- Node.js 20 or newer (the build script uses built-in Node modules only).
- A modern browser for interactive tools.
- An internet connection for the PDF tools (`pdf-lib`) and QR Code Generator (`qrcode.js`), which load their libraries from public CDNs at runtime. Tool data is processed in the browser; external library code is downloaded from the respective CDN.

## Local build and preview

```bash
node --check scripts/build.js
node scripts/build.js
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000`. The `dist/` directory is regenerated from `src/` on each build. Do not edit `dist/` directly; update source files and rebuild.

## Netlify deployment

A `netlify.toml` is included with build command `node scripts/build.js` and publish directory `dist`.

1. Push this project to a Git repository.
2. Import the repository into Netlify.
3. Set the environment variable `NEXT_PUBLIC_SITE_URL` to the real production origin (for example, your actual `https://your-domain.tld`, without a trailing slash).
4. Deploy and inspect the live site, sitemap, metadata, and all interactive tools.

**Do not deploy before configuring `NEXT_PUBLIC_SITE_URL`.** When it is unset, the build intentionally omits canonical URLs and absolute sitemap entries instead of publishing a fabricated domain. Set it in the Netlify build environment and rebuild to generate canonical URLs, absolute sitemap URLs, and correct Open Graph URLs.

GitHub Pages can host the generated static output too, but configure the site's base path if deploying under a repository subpath; the current site assumes it is hosted at the origin root.

## Configuration

Copy `.env.example` to `.env` if building locally with environment variables. The build script reads environment variables directly from the process; it does not automatically load `.env`. Export them in your shell or configure them in your hosting provider.

- `NEXT_PUBLIC_SITE_URL`: required for production canonical URLs, absolute sitemap URLs, and social metadata.
- `NEXT_PUBLIC_GA_ID`: optional Google Analytics 4 ID. Empty by default.
- `NEXT_PUBLIC_ADSENSE_ENABLED`: remains `false` until real provider details are supplied and the publisher has appropriate approval.
- `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` and `NEXT_PUBLIC_ADSENSE_SLOT_*`: public-facing provider identifiers only; do not place secrets in client-side configuration.

Advertising and analytics are disabled by default. No approval or earnings are implied by this project.

## Project layout

- `src/data/`: tool registry and content for tools, categories, guides, and legal pages.
- `src/assets/css/`: site stylesheet.
- `src/assets/js/`: shared client runtime and completion UI.
- `src/assets/logo.svg`: Utoline wordmark source.
- `src/tools/`: microphone test markup and client implementation.
- `scripts/build.js`: static-site generator.
- `dist/`: generated production website.
- `QA-REPORT.md`: checks performed and unverified functional work.
- `netlify.toml`: Netlify build/publish configuration.

## Privacy and legal setup

Most tools process inputs locally in the browser. PDF and QR tools fetch third-party library code at runtime; that does not itself upload the user's input. Analytics and ads can be enabled by configuration and may introduce third-party data processing/cookies. Review and adapt the privacy, terms, cookie, and disclaimer pages for the actual operator and applicable law before launch. Configure a real support email/contact in `/contact/` and in privacy/terms pages before publishing; this project intentionally does not invent one.

## QA

See `QA-REPORT.md`. Static build, source-script syntax, generated links, structured data, and branding checks are recorded separately from browser-level tests. A successful build does not prove every tool works on every browser/device. PDF/image file processing, clipboard/download behavior, microphone permission/hardware, and every individual tool workflow still require live-browser acceptance testing before describing the site as fully production-verified.
