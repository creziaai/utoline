module.exports = {
  acknowledgements: {
    title: 'Acknowledgements & Open Source Credits',
    description: 'The open-source libraries and fonts Utoline relies on, with license and attribution details.',
    body: `
      <p>Utoline is built almost entirely from first principles — most tools run on nothing but native browser APIs (Canvas, Web Crypto, Intl, Clipboard). Two categories of tool load a small, well-established open-source library to do something that genuinely deserves a dedicated, battle-tested implementation rather than a reinvented one. We’re glad to credit them here.</p>
      <h2>Libraries used at runtime</h2>
      <div class="ack-grid">
        <div class="ack-card">
          <h3>pdf-lib</h3>
          <p>Powers PDF Merge, PDF Split &amp; Page Extractor, and PDF Rotate. A pure JavaScript library for creating and modifying PDF documents, used under the MIT License.</p>
          <a href="https://pdf-lib.js.org/" rel="noopener">pdf-lib.js.org</a>
        </div>
        <div class="ack-card">
          <h3>qrcode.js</h3>
          <p>Powers the QR Code Generator, implementing the QR error-correction algorithm correctly so generated codes actually scan. Used under the MIT License.</p>
          <a href="https://github.com/davidshimjs/qrcodejs" rel="noopener">github.com/davidshimjs/qrcodejs</a>
        </div>
      </div>
      <h2>Typography</h2>
      <div class="ack-grid">
        <div class="ack-card">
          <h3>Manrope</h3>
          <p>Display and heading typeface, designed by Mikhail Sharanda. Licensed under the SIL Open Font License, served via Google Fonts.</p>
          <a href="https://fonts.google.com/specimen/Manrope" rel="noopener">fonts.google.com/specimen/Manrope</a>
        </div>
        <div class="ack-card">
          <h3>Inter</h3>
          <p>Body typeface, designed by Rasmus Andersson. Licensed under the SIL Open Font License, served via Google Fonts.</p>
          <a href="https://fonts.google.com/specimen/Inter" rel="noopener">fonts.google.com/specimen/Inter</a>
        </div>
      </div>
      <h2>Everything else</h2>
      <p>All calculators, converters, text tools, developer tools, image tools (compression, resizing, cropping and format conversion), security tools and SEO generators are implemented directly against standard browser APIs, with no third-party runtime dependency — see each tool’s page for exactly how it works.</p>
      <p>Site design, copy, tool logic and architecture are original to this project.</p>
    `
  },
  about: {
    title: 'About Utoline',
    description: 'Learn about Utoline, a free collection of fast, privacy-friendly online tools for everyday tasks.',
    body: `
      <p>Utoline is a collection of free online tools built around one idea: everyday tasks like counting words, formatting JSON, resizing an image or calculating a loan payment shouldn’t require installing software, creating an account, or uploading your files to someone else’s server.</p>
      <h2>What we build</h2>
      <p>Every tool on Utoline is designed to do one job well: text utilities, developer tools, calculators, converters, image tools, PDF utilities, SEO helpers, security tools and more. You can see the full list on the <a href="/tools/">All Tools</a> page.</p>
      <h2>Our approach to privacy</h2>
      <p>Wherever technically possible, Utoline processes your input directly in your browser using JavaScript — your text, images, passwords and documents are not uploaded to a server. Where a tool does need to load an external library (for example, to draw a QR code or manipulate a PDF), that library still runs locally in your browser; your content itself is not sent anywhere.</p>
      <h2>How this site is funded</h2>
      <p>Utoline is free to use. Development and hosting costs may eventually be supported by unobtrusive, clearly labeled advertising, which is disabled by default and never mixed in with tool controls.</p>
      <h2>Feedback</h2>
      <p>Found a bug, or want to suggest a tool? Get in touch via our <a href="/contact/">Contact page</a>.</p>
    `
  },
  contact: {
    title: 'Contact Us',
    description: 'Get in touch with the Utoline team with questions, feedback or bug reports.',
    body: `
      <p>We’d love to hear from you — whether it’s a bug report, a tool request, or general feedback.</p>
      <p><strong>Support email:</strong> creziaai@gmail.com</p>
      <p>When reporting a bug, it helps to include: which tool you were using, what you expected to happen, what actually happened, and your browser and device if relevant.</p>
      <p>Email is the current support channel. Please include the tool name, expected result, actual result, and your browser/device when reporting a bug.</p>
    `
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'Read Utoline’s Privacy Policy covering local processing, analytics, cookies and advertising.',
    body: `
      <p><em>Last updated: 10 October 2026. This is a template and does not constitute legal advice — have it reviewed by a qualified professional before publishing, and replace bracketed placeholders with your actual business details.</em></p>
      <h2>Local, browser-based processing</h2>
      <p>Most tools on this site process your input — text, images, passwords, documents — entirely within your web browser using JavaScript. This content is not uploaded to our servers or any third party in the course of normal tool use, except where a tool explicitly states it loads an external code library (in which case only the library code, not your content, is fetched from that library’s host).</p>
      <h2>Analytics</h2>
      <p>If enabled by the site operator, this site may use Google Analytics 4 to understand aggregate usage patterns (e.g. which tools are used, page views, approximate location by country/region). Analytics is only active if a Measurement ID is configured; by default it is disabled. Analytics data is processed by Google in accordance with <a href="https://policies.google.com/privacy" rel="noopener">Google’s Privacy Policy</a>.</p>
      <h2>Cookies</h2>
      <p>This site uses a small amount of local storage (not a server-side cookie) to remember your light/dark theme preference. If analytics or advertising is enabled by the site operator, those third-party services may set their own cookies as described in their respective privacy policies.</p>
      <h2>Advertising</h2>
      <p>This site may display advertising via Google AdSense once enabled by the site operator. AdSense may use cookies to serve ads based on your visits to this and other sites. You can learn more and opt out of personalized advertising at <a href="https://adssettings.google.com" rel="noopener">Google Ads Settings</a>.</p>
      <h2>Data we do not collect</h2>
      <p>We do not require account registration for any tool, and we do not ask for or intentionally collect passwords, private documents, or other sensitive personal content you enter into our tools — those are processed locally in your browser as described above.</p>
      <h2>Contact</h2>
      <p>Before publication, add the real business or support contact for privacy questions.</p>
    `
  },
  terms: {
    title: 'Terms of Service',
    description: 'Terms of Service for using Utoline’s free online tools.',
    body: `
      <p><em>This is a template and does not constitute legal advice — have it reviewed by a qualified professional before publishing.</em></p>
      <h2>Use of the service</h2>
      <p>Utoline provides free online tools "as is" for personal and business use. You may use these tools without creating an account. You agree not to use the tools for any unlawful purpose or in a way that could damage, disable or impair the service.</p>
      <h2>No warranty</h2>
      <p>Tools are provided without warranties of any kind, express or implied, including but not limited to accuracy, reliability, or fitness for a particular purpose. Calculators and converters are provided for general informational purposes and should not be relied upon as professional financial, legal, medical or tax advice.</p>
      <h2>Limitation of liability</h2>
      <p>To the maximum extent permitted by law, Utoline shall not be liable for any indirect, incidental, or consequential damages arising from use of this site or its tools.</p>
      <h2>Changes to the service</h2>
      <p>We may modify, suspend or discontinue any tool or feature at any time.</p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India.</p>
      <h2>Contact</h2>
      <p>Before publication, add the real business or support contact for questions about these terms.</p>
    `
  },
  disclaimer: {
    title: 'Disclaimer',
    description: 'Important disclaimers regarding calculators, health tools and other informational content on Utoline.',
    body: `
      <h2>General informational purpose</h2>
      <p>Tools and content on this site — including calculators, converters and guides — are provided for general informational and educational purposes only. They are not a substitute for professional advice.</p>
      <h2>Financial calculators</h2>
      <p>Calculators such as the EMI, GST and discount calculators provide estimates based on the formulas and inputs you provide. They do not account for every real-world factor (fees, taxes, rounding conventions used by specific lenders or authorities, etc.) and should not be treated as financial advice. Consult a qualified financial advisor or the relevant institution for decisions that matter.</p>
      <h2>Health calculators</h2>
      <p>The BMI calculator provides a general screening measure only. It does not account for muscle mass, bone density, age, sex or overall health, and is not a medical diagnosis. Consult a healthcare professional for personal health guidance.</p>
      <h2>SEO tools</h2>
      <p>Tools like the SERP Snippet Preview are visual approximations, not guarantees of how any specific search engine will display your content, since search engine result designs change over time and vary by query.</p>
      <h2>No liability</h2>
      <p>Use of any tool or information on this site is at your own risk.</p>
    `
  },
  cookies: {
    title: 'Cookie Policy',
    description: 'How Utoline uses cookies and local storage, including for theme preference, analytics and advertising.',
    body: `
      <h2>What we use</h2>
      <p>This site itself uses your browser’s local storage (not a traditional server-readable cookie) to remember one thing: your light/dark theme preference. This never leaves your device.</p>
      <h2>Third-party cookies</h2>
      <p>If the site operator has enabled analytics or advertising, those third-party providers (Google Analytics and/or Google AdSense) may set their own cookies to measure usage or serve ads, in accordance with their own privacy policies. These are disabled by default.</p>
      <h2>Managing cookies</h2>
      <p>You can control or delete cookies through your browser settings at any time. Blocking cookies may affect the personalization of ads shown to you but will not prevent you from using any tool on this site.</p>
      <h2>More information</h2>
      <p>For information about how data is handled, review the actual services and browser permissions involved before use.</p>
    `
  }
};
