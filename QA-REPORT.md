# Utoline QA Report

Date: 2026-10-14

## Summary of verified checks

- **PASS** — `node --check scripts/build.js` and `node scripts/build.js` completed successfully.
- **PASS** — 57 tool records and all 57 individual tool pages were found in the generated site.
- **PASS** — JavaScript syntax parsed for all 19 source JavaScript files and all 57 tool implementation scripts.
- **PASS** — 3,674 root-relative internal links checked across generated HTML; 0 broken links found.
- **PASS** — 192 JSON-LD blocks parsed; 0 invalid JSON blocks found.
- **PASS** — no old-brand references found in scanned source JavaScript and generated HTML.
- **PASS** — Utoline wordmark and favicon exist in `dist/`; Privacy Policy, Terms, and Open-source credits pages are generated.
- **PASS (static only)** — PDF Merge has Move up / Move down controls, safely renders filenames as text, and merges according to the selected array order. Actual PDF processing and output validity were not browser-tested.
- **CONFIGURATION REQUIRED** — Set `NEXT_PUBLIC_SITE_URL` to the actual production origin before deployment. Without it, canonical URLs and absolute sitemap entries are deliberately omitted rather than using a fabricated domain.
- **CONFIGURATION REQUIRED** — Configure the real support email/business contact in Contact, Privacy Policy, and Terms. Review legal copy for the actual operator and jurisdiction before launch.
- **NOT TESTED** — No browser end-to-end session was completed. No claim is made that every operation, download, permission flow, or edge case has passed runtime testing.

## Test scope and limitation

The static checks verify build generation, JavaScript syntax, generated routes, internal links, structured-data syntax, and branding. They do **not** establish calculation correctness or prove that controls work in a real browser. The following matrix honestly records each tool's runtime status.

## Tool-by-tool functional matrix

| Tool | Route | Test input actually used | Expected result | Observed result | Status |
|---|---|---|---|---|---|
| Add / Subtract Days from Date | `/tools/add-subtract-days/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Age Calculator | `/tools/age-calculator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Area Converter | `/tools/area-converter/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Average Calculator | `/tools/average-calculator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Base64 Encoder / Decoder | `/tools/base64-encoder-decoder/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| BMI Calculator | `/tools/bmi-calculator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Case Converter | `/tools/case-converter/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Character Counter | `/tools/character-counter/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Color Converter & Picker | `/tools/color-converter/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Countdown Calculator | `/tools/countdown-calculator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Data Storage Converter | `/tools/data-storage-converter/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Date Difference Calculator | `/tools/date-difference-calculator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Discount Calculator | `/tools/discount-calculator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| EMI / Loan Calculator | `/tools/emi-calculator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| GST / Sales Tax Calculator | `/tools/gst-calculator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Hash Generator | `/tools/hash-generator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| HTML Encoder / Decoder | `/tools/html-encoder-decoder/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Image Compressor | `/tools/image-compressor/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Image Cropper | `/tools/image-cropper/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Image Format Converter | `/tools/image-format-converter/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Image Resizer | `/tools/image-resizer/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| JSON Formatter & Validator | `/tools/json-formatter/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Length Converter | `/tools/length-converter/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Lorem Ipsum Generator | `/tools/lorem-ipsum-generator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Meta Tag Generator | `/tools/meta-tag-generator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Microphone Test | `/tools/microphone-test/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Open Graph Meta Generator | `/tools/open-graph-generator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Password Generator | `/tools/password-generator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Password Strength Checker | `/tools/password-strength-checker/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| PDF Merge | `/tools/pdf-merge/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| PDF Rotate | `/tools/pdf-rotate/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| PDF Split & Page Extractor | `/tools/pdf-split/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Percentage Calculator | `/tools/percentage-calculator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Percentage Change Calculator | `/tools/percentage-change-calculator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| QR Code Generator | `/tools/qr-code-generator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Random Number Generator | `/tools/random-number-generator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Random String Generator | `/tools/random-string-generator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Ratio Calculator | `/tools/ratio-calculator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Regex Tester | `/tools/regex-tester/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Remove Duplicate Lines | `/tools/remove-duplicate-lines/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Robots.txt Generator | `/tools/robots-txt-generator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| SERP Snippet Preview | `/tools/serp-snippet-preview/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Sitemap Generator | `/tools/sitemap-generator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Speed Converter | `/tools/speed-converter/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Temperature Converter | `/tools/temperature-converter/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Text Cleaner | `/tools/text-cleaner/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Text Sorter | `/tools/text-sorter/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Text to Slug Generator | `/tools/text-to-slug/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Time Duration Calculator | `/tools/time-duration-calculator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Timestamp Converter | `/tools/timestamp-converter/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Time Zone Converter | `/tools/timezone-converter/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Tip Calculator | `/tools/tip-calculator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| URL Encoder / Decoder | `/tools/url-encoder-decoder/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| UUID Generator | `/tools/uuid-generator/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Volume Converter | `/tools/volume-converter/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Weight Converter | `/tools/weight-converter/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |
| Word Counter | `/tools/word-counter/` | Not executed in browser | Run the tool with valid and invalid representative input; expected behavior is defined by its stated purpose | Not tested in browser; source script syntax passed | **NOT TESTED** |

## Remaining acceptance tests

1. Test each tool in a real supported browser with valid, empty, malformed, and boundary inputs.
2. Compare calculator and converter outputs against independent known values, including date/time and rounding edge cases.
3. Use real image/PDF files to verify previews, file output validity, dimensions/pages, merge order, and downloads.
4. Test clipboard permissions, reset/retry, keyboard accessibility, and responsive layouts at mobile and desktop sizes.
5. Test microphone permission granted/denied, live input, no-input state, and stream cleanup on a real device/browser.
6. Configure the production domain and verify live canonical URLs, Open Graph URLs, and absolute sitemap entries.
7. Replace the support-contact configuration prompt and review legal policies before publishing.

**Status definitions:** PASS = the stated check ran and succeeded; FAIL = the stated check ran and failed; NOT TESTED = runtime behavior was not verified; CONFIGURATION REQUIRED = operator-supplied configuration is needed.
