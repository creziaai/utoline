module.exports = [
  {
    slug: 'how-to-count-words-in-a-document',
    title: 'How to Count Words in a Document',
    description: 'Learn different ways to count words in your writing, and why word count matters for essays, articles and SEO content.',
    related: ['word-counter', 'character-counter'],
    body: `
      <p>Word count is one of the simplest but most useful measures of a piece of writing. Whether you’re hitting an essay requirement, staying inside a headline limit, or pacing a blog post for a target reading time, knowing your word count helps you plan and edit more deliberately.</p>
      <h2>Using your word processor</h2>
      <p>Most word processors show a running word count in the status bar. In Microsoft Word, it appears at the bottom-left of the window; in Google Docs, it’s under Tools → Word count (or Ctrl/Cmd+Shift+C). These counts are accurate for the document as a whole, but switching apps just to check a snippet of text is often more friction than it’s worth.</p>
      <h2>Using an online word counter</h2>
      <p>A browser-based <a href="/tools/word-counter/">word counter</a> is often faster: paste your text and get an instant count of words, characters, sentences and paragraphs, along with estimated reading and speaking time — without opening another application or uploading anything.</p>
      <h2>What counts as a "word"?</h2>
      <p>Most tools, including ours, count words by splitting text on whitespace. This means a hyphenated term like "well-known" counts as one word, while contractions like "don’t" also count as one. Numbers and standalone punctuation marks are generally counted as their own "word" if they’re separated by spaces, which can occasionally cause small discrepancies between tools.</p>
      <h2>Why word count matters</h2>
      <ul>
        <li><strong>Academic writing:</strong> assignments often specify a minimum or maximum word count.</li>
        <li><strong>SEO content:</strong> longer, more thorough articles can perform better for competitive search terms, though quality matters more than length alone.</li>
        <li><strong>Social media:</strong> platforms enforce hard character limits, making a live counter useful while drafting.</li>
        <li><strong>Reading time:</strong> knowing the approximate reading time helps set expectations for readers, especially on blogs and newsletters.</li>
      </ul>
    `
  },
  {
    slug: 'what-is-json',
    title: 'What Is JSON? A Plain-English Guide',
    description: 'A beginner-friendly explanation of JSON, its syntax, and why it’s the standard format for exchanging data on the web.',
    related: ['json-formatter', 'base64-encoder-decoder'],
    body: `
      <p>JSON (JavaScript Object Notation) is a lightweight, text-based format for representing structured data. Despite the name, it’s language-independent — nearly every modern programming language can read and write it — which is why it has become the standard format for APIs, configuration files, and data exchange on the web.</p>
      <h2>Basic syntax</h2>
      <p>JSON is built from a small set of building blocks:</p>
      <ul>
        <li><strong>Objects</strong> — key-value pairs wrapped in curly braces, e.g. <code>{"name": "Utoline", "free": true}</code></li>
        <li><strong>Arrays</strong> — ordered lists wrapped in square brackets, e.g. <code>["text", "developer", "pdf"]</code></li>
        <li><strong>Strings</strong> — text wrapped in double quotes (single quotes are not valid JSON)</li>
        <li><strong>Numbers, booleans and null</strong> — written without quotes</li>
      </ul>
      <h2>Common mistakes</h2>
      <p>JSON is stricter than a JavaScript object literal. Trailing commas after the last item, single-quoted strings, and unquoted keys are all invalid JSON, even though they’re valid JavaScript. A <a href="/tools/json-formatter/">JSON formatter and validator</a> will catch these issues and tell you roughly where the problem is.</p>
      <h2>Why JSON is everywhere</h2>
      <p>JSON is compact, human-readable, and maps cleanly onto the data structures most programming languages already have (objects/dictionaries and arrays/lists). That combination made it the default choice for REST APIs, application configuration, and data storage formats across the industry.</p>
    `
  },
  {
    slug: 'how-to-compress-an-image',
    title: 'How to Compress an Image Without Losing Quality',
    description: 'Practical tips for reducing image file size for faster websites and smaller uploads, while keeping visual quality acceptable.',
    related: ['image-compressor', 'image-format-converter', 'image-resizer'],
    body: `
      <p>Large image files slow down websites, use up storage, and make uploads and downloads take longer. Compressing images strikes a balance between visual quality and file size — and for most everyday use cases, that balance can be very favorable: often 50–80% smaller with no visible quality loss.</p>
      <h2>Choose the right format first</h2>
      <p>Compression settings matter less than picking the right format for the content:</p>
      <ul>
        <li><strong>JPG</strong> — best for photos with lots of color detail and gradients; supports adjustable lossy compression.</li>
        <li><strong>PNG</strong> — best for images with transparency, flat colors, or text/screenshots, but produces larger files for photos.</li>
        <li><strong>WebP</strong> — generally smaller than both JPG and PNG at similar quality, with broad modern browser support.</li>
      </ul>
      <p>Our <a href="/tools/image-format-converter/">Image Format Converter</a> can help you switch between these to compare results.</p>
      <h2>Adjust the quality setting</h2>
      <p>For JPG and WebP, quality settings between 60–85% are usually visually indistinguishable from the original for web use, while cutting file size significantly. Very low quality settings introduce visible blockiness ("compression artifacts"), especially around sharp edges and text.</p>
      <h2>Resize before compressing</h2>
      <p>If an image is being displayed smaller than its original resolution (e.g. a 4000px-wide photo shown at 800px on a page), resizing it down first — see our <a href="/tools/image-resizer/">Image Resizer</a> — often reduces file size more than compression settings alone, since there’s simply less pixel data to store.</p>
      <h2>Do it without uploading your photos anywhere</h2>
      <p>Our <a href="/tools/image-compressor/">Image Compressor</a> runs entirely in your browser using the Canvas API, so your images are never uploaded to a server — useful for anything you’d rather keep private.</p>
    `
  },
  {
    slug: 'jpg-vs-png',
    title: 'JPG vs PNG: Which Should You Use?',
    description: 'A clear comparison of JPG and PNG image formats, covering compression, transparency and best use cases for each.',
    related: ['image-format-converter', 'image-compressor'],
    body: `
      <p>JPG and PNG are the two most common image formats on the web, but they’re built for different purposes. Choosing the wrong one can mean unnecessarily large files or a loss of quality where it matters.</p>
      <h2>JPG (JPEG)</h2>
      <p>JPG uses lossy compression, which means some image data is discarded to reduce file size. It handles photographs and images with smooth color gradients very well, and lets you choose a quality level to balance size against fidelity. JPG does not support transparency.</p>
      <h2>PNG</h2>
      <p>PNG uses lossless compression — no image data is discarded, so quality is always preserved exactly. This makes PNG ideal for screenshots, logos, illustrations with flat colors or sharp edges, and any image that needs a transparent background. The tradeoff is larger file sizes for photographic content compared to JPG.</p>
      <h2>Quick decision guide</h2>
      <ul>
        <li>Photo for a website or social media → JPG (or WebP if supported)</li>
        <li>Logo, icon, or screenshot with text → PNG</li>
        <li>Image needs a transparent background → PNG</li>
        <li>Smallest possible file size with good quality → WebP, where supported</li>
      </ul>
      <p>You can convert between formats using our <a href="/tools/image-format-converter/">Image Format Converter</a>, entirely in your browser.</p>
    `
  },
  {
    slug: 'how-to-calculate-percentage-change',
    title: 'How to Calculate Percentage Change',
    description: 'The formula for percentage increase and decrease, explained with worked examples.',
    related: ['percentage-change-calculator', 'percentage-calculator'],
    body: `
      <p>Percentage change tells you how much a value has grown or shrunk relative to its starting point, expressed as a percentage. It’s used everywhere from tracking price changes to measuring business growth.</p>
      <h2>The formula</h2>
      <p><strong>Percentage change = ((New value − Old value) ÷ |Old value|) × 100</strong></p>
      <p>A positive result means an increase; a negative result means a decrease.</p>
      <h2>Worked example</h2>
      <p>Say a product’s price rose from $80 to $92. The change is (92 − 80) ÷ 80 × 100 = 15%. The price increased by 15%.</p>
      <p>If instead the price fell from $80 to $68, the change is (68 − 80) ÷ 80 × 100 = −15%, meaning a 15% decrease.</p>
      <h2>Percentage change vs percentage difference</h2>
      <p>Percentage change is directional and always relative to the original ("old") value. Percentage difference, by contrast, compares two values relative to their average and doesn’t treat either one as the "starting point" — it’s more appropriate when there isn’t a clear before/after relationship between the two numbers.</p>
      <p>Try the <a href="/tools/percentage-change-calculator/">Percentage Change Calculator</a> to compute this instantly for your own numbers.</p>
    `
  },
  {
    slug: 'how-does-base64-encoding-work',
    title: 'How Does Base64 Encoding Work?',
    description: 'An explanation of Base64 encoding, why it exists, and common situations where you’ll encounter it.',
    related: ['base64-encoder-decoder', 'url-encoder-decoder'],
    body: `
      <p>Base64 is a way of representing binary data using only 64 printable ASCII characters (A–Z, a–z, 0–9, + and /). It doesn’t compress or encrypt data — it just re-encodes it into a form that’s safe to include in contexts that only handle plain text, like email, URLs, or JSON strings.</p>
      <h2>Why not just use the raw data?</h2>
      <p>Many older systems and text-based protocols (like email, originally) weren’t designed to safely transmit arbitrary binary bytes — some byte sequences could be misinterpreted as control characters. Base64 sidesteps this by mapping every 3 bytes of binary input into 4 printable characters, guaranteed to be safe everywhere plain text is accepted.</p>
      <h2>The size tradeoff</h2>
      <p>Base64-encoded data is roughly 33% larger than the original, since it uses 4 characters to represent every 3 bytes. This is an accepted tradeoff for compatibility, not a flaw — Base64 isn’t meant to be efficient, just universally safe to transmit.</p>
      <h2>Where you’ll see it</h2>
      <ul>
        <li>Embedding small images directly inside CSS or HTML as <code>data:</code> URLs</li>
        <li>Encoding attachments in email (MIME)</li>
        <li>Storing binary data inside JSON, which only supports text values</li>
        <li>Basic HTTP authentication headers</li>
      </ul>
      <p>Try encoding or decoding your own text with our <a href="/tools/base64-encoder-decoder/">Base64 Encoder/Decoder</a>.</p>
    `
  },
  {
    slug: 'what-is-a-unix-timestamp',
    title: 'What Is a Unix Timestamp?',
    description: 'Understand what Unix timestamps are, why they’re used, and how to convert them to readable dates.',
    related: ['timestamp-converter', 'timezone-converter'],
    body: `
      <p>A Unix timestamp (also called "epoch time") is the number of seconds that have elapsed since 00:00:00 UTC on 1 January 1970 — a reference point known as "the Unix epoch". It’s one of the most common ways computer systems store and exchange dates internally.</p>
      <h2>Why store dates as numbers?</h2>
      <p>A single integer is compact, unambiguous, and easy to compare and sort — no timezone, calendar format, or locale confusion. Two systems anywhere in the world will agree on what "1735689600" means as a moment in time, even if they display it completely differently to a human.</p>
      <h2>Seconds vs milliseconds</h2>
      <p>Traditional Unix timestamps count seconds, but many programming environments — including JavaScript’s <code>Date</code> object — use milliseconds since the epoch instead. Mixing these up is a common source of "year 1970" or "year 50000+" bugs, so always check which unit a system expects.</p>
      <h2>Converting a timestamp</h2>
      <p>You can convert between a Unix timestamp and a readable date — including both local time and UTC — using our <a href="/tools/timestamp-converter/">Timestamp Converter</a>.</p>
    `
  },
  {
    slug: 'how-to-reduce-image-file-size',
    title: 'How to Reduce Image File Size for the Web',
    description: 'A practical checklist for shrinking image files without hurting how they look on your website.',
    related: ['image-compressor', 'image-resizer', 'image-format-converter'],
    body: `
      <p>Slow-loading images are one of the most common causes of a sluggish website. Here’s a practical checklist for keeping image file sizes under control.</p>
      <h2>1. Resize to the display size</h2>
      <p>Don’t serve a 4000-pixel-wide photo to display it at 600 pixels. Use our <a href="/tools/image-resizer/">Image Resizer</a> to match dimensions to where the image will actually appear.</p>
      <h2>2. Choose an efficient format</h2>
      <p>WebP typically produces smaller files than JPG or PNG at comparable visual quality. Use the <a href="/tools/image-format-converter/">Image Format Converter</a> to try it.</p>
      <h2>3. Compress with a sensible quality setting</h2>
      <p>A quality setting of roughly 70–85% is usually visually lossless for web use while meaningfully reducing file size. Our <a href="/tools/image-compressor/">Image Compressor</a> shows a live before/after size comparison so you can find the sweet spot.</p>
      <h2>4. Strip unnecessary metadata</h2>
      <p>Photos often carry embedded metadata (camera settings, GPS location, etc.) that adds to file size without affecting how the image looks. Re-saving through a browser-based tool like ours typically drops this metadata automatically as a side effect of re-encoding.</p>
    `
  },
  {
    slug: 'how-to-create-a-qr-code',
    title: 'How to Create a QR Code',
    description: 'Step-by-step guidance on creating a QR code for a URL, email address or phone number, and tips for making sure it scans reliably.',
    related: ['qr-code-generator'],
    body: `
      <p>QR codes are a fast way to get someone from a physical object — a poster, a business card, a menu — to a digital destination, without them typing anything. Here’s how to create one that works reliably.</p>
      <h2>1. Decide what it should do</h2>
      <p>Common QR code destinations include a website URL, a pre-filled email (<code>mailto:</code>), or a phone number (<code>tel:</code>) that opens the dialer. Our <a href="/tools/qr-code-generator/">QR Code Generator</a> supports all three directly.</p>
      <h2>2. Keep the content short where possible</h2>
      <p>Longer content requires a denser QR code with more small squares, which is harder for cameras to scan reliably, especially at small print sizes. A shortened URL will generally scan more reliably than a very long one.</p>
      <h2>3. Choose an appropriate error-correction level</h2>
      <p>QR codes include built-in error correction, so they can still scan even if partially damaged or obscured. Higher error correction makes the code more robust but also denser — Medium is a reasonable default for most digital and print uses.</p>
      <h2>4. Test before printing</h2>
      <p>Always scan the generated code with a couple of different phones before committing it to print, especially at the final size and material it will be printed on.</p>
    `
  }
];
