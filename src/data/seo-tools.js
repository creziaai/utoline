module.exports = [
  {
    slug: 'meta-tag-generator',
    name: 'Meta Tag Generator',
    category: 'seo-tools',
    description: 'Generate HTML meta tags for title, description, keywords, canonical URL and robots directives.',
    keywords: ['meta tag generator', 'html meta tags', 'seo meta tags generator'],
    related: ['open-graph-generator', 'serp-snippet-preview', 'robots-txt-generator'],
    html: `
      <div class="tool-panel">
        <label class="field-label" for="meta-title">Page title</label>
        <input id="meta-title" class="input" type="text" placeholder="Free Word Counter — Count Words &amp; Characters Online" maxlength="70">
        <label class="field-label" for="meta-desc">Meta description</label>
        <textarea id="meta-desc" class="textarea" rows="3" maxlength="170" placeholder="Count words, characters, sentences and paragraphs instantly with our free online word counter."></textarea>
        <div class="grid-2">
          <div><label class="field-label" for="meta-keywords">Keywords (optional, comma separated)</label><input id="meta-keywords" class="input" type="text" placeholder="word counter, character count"></div>
          <div><label class="field-label" for="meta-canonical">Canonical URL</label><input id="meta-canonical" class="input" type="text" placeholder="https://example.com/tools/word-counter"></div>
        </div>
        <div class="grid-2">
          <div><label class="field-label" for="meta-robots">Robots</label>
            <select id="meta-robots" class="select">
              <option value="index, follow">index, follow</option>
              <option value="noindex, follow">noindex, follow</option>
              <option value="index, nofollow">index, nofollow</option>
              <option value="noindex, nofollow">noindex, nofollow</option>
            </select>
          </div>
          <div><label class="field-label" for="meta-author">Author (optional)</label><input id="meta-author" class="input" type="text" placeholder="Your name or brand"></div>
        </div>
        <div class="toolbar">
          <button class="btn btn-primary" id="meta-run" type="button">Generate tags</button>
          <button class="btn btn-ghost" id="meta-reset" type="button">Reset</button>
        </div>
        <label class="field-label" for="meta-output">Generated HTML</label>
        <textarea id="meta-output" class="textarea code" rows="9" readonly spellcheck="false"></textarea>
        <div class="toolbar"><button class="btn btn-ghost" id="meta-copy" type="button">Copy tags</button></div>
      </div>`,
    script: `
      (function(){
        function esc(s){ return s.replace(/"/g,'&quot;'); }
        document.getElementById('meta-run').addEventListener('click', function(){
          const title = document.getElementById('meta-title').value.trim();
          const desc = document.getElementById('meta-desc').value.trim();
          const keywords = document.getElementById('meta-keywords').value.trim();
          const canonical = document.getElementById('meta-canonical').value.trim();
          const robots = document.getElementById('meta-robots').value;
          const author = document.getElementById('meta-author').value.trim();
          let lines = [];
          if (title) lines.push('<title>'+esc(title)+'</title>');
          if (desc) lines.push('<meta name="description" content="'+esc(desc)+'">');
          if (keywords) lines.push('<meta name="keywords" content="'+esc(keywords)+'">');
          lines.push('<meta name="robots" content="'+robots+'">');
          if (author) lines.push('<meta name="author" content="'+esc(author)+'">');
          if (canonical) lines.push('<link rel="canonical" href="'+esc(canonical)+'">');
          document.getElementById('meta-output').value = lines.join('\\n');
        });
        document.getElementById('meta-reset').addEventListener('click', function(){
          ['meta-title','meta-desc','meta-keywords','meta-canonical','meta-author'].forEach(id => document.getElementById(id).value='');
          document.getElementById('meta-output').value = '';
        });
        document.getElementById('meta-copy').addEventListener('click', function(){ copyToClipboard(document.getElementById('meta-output').value, this); });
      })();`,
    howTo: ['Fill in your page title, description and optional fields.', 'Click Generate tags.', 'Copy the HTML into your page’s &lt;head&gt; section.'],
    faq: [{ q: 'What is a good meta description length?', a: 'Around 150–160 characters is a common target, since search engines typically truncate longer descriptions in results.' }]
  },
  {
    slug: 'open-graph-generator',
    name: 'Open Graph Meta Generator',
    category: 'seo-tools',
    description: 'Generate Open Graph and Twitter/X meta tags for rich social media link previews.',
    keywords: ['open graph generator', 'og meta tags', 'twitter card generator', 'social share tags'],
    related: ['meta-tag-generator', 'serp-snippet-preview', 'robots-txt-generator'],
    html: `
      <div class="tool-panel">
        <div class="grid-2">
          <div><label class="field-label" for="og-title">Title</label><input id="og-title" class="input" type="text" placeholder="Free Online Tools for Everyday Tasks"></div>
          <div><label class="field-label" for="og-type">Type</label>
            <select id="og-type" class="select"><option value="website">website</option><option value="article">article</option><option value="product">product</option></select>
          </div>
        </div>
        <label class="field-label" for="og-desc">Description</label>
        <textarea id="og-desc" class="textarea" rows="3" placeholder="Fast, simple and privacy-friendly tools for text, images, developers, PDFs, calculators and more."></textarea>
        <div class="grid-2">
          <div><label class="field-label" for="og-url">Page URL</label><input id="og-url" class="input" type="text" placeholder="https://example.com/"></div>
          <div><label class="field-label" for="og-image">Image URL</label><input id="og-image" class="input" type="text" placeholder="https://example.com/og-image.png"></div>
        </div>
        <div class="grid-2">
          <div><label class="field-label" for="og-site">Site name</label><input id="og-site" class="input" type="text" placeholder="Utoline"></div>
          <div><label class="field-label" for="og-twitter">Twitter card type</label>
            <select id="og-twitter" class="select"><option value="summary_large_image">summary_large_image</option><option value="summary">summary</option></select>
          </div>
        </div>
        <div class="toolbar">
          <button class="btn btn-primary" id="og-run" type="button">Generate tags</button>
          <button class="btn btn-ghost" id="og-reset" type="button">Reset</button>
        </div>
        <label class="field-label" for="og-output">Generated HTML</label>
        <textarea id="og-output" class="textarea code" rows="12" readonly spellcheck="false"></textarea>
        <div class="toolbar"><button class="btn btn-ghost" id="og-copy" type="button">Copy tags</button></div>
      </div>`,
    script: `
      (function(){
        function esc(s){ return s.replace(/"/g,'&quot;'); }
        document.getElementById('og-run').addEventListener('click', function(){
          const v = id => document.getElementById(id).value.trim();
          const title=v('og-title'), desc=v('og-desc'), url=v('og-url'), image=v('og-image'), site=v('og-site');
          const type = document.getElementById('og-type').value;
          const twitterCard = document.getElementById('og-twitter').value;
          let lines = [];
          if (title) lines.push('<meta property="og:title" content="'+esc(title)+'">');
          if (desc) lines.push('<meta property="og:description" content="'+esc(desc)+'">');
          lines.push('<meta property="og:type" content="'+type+'">');
          if (url) lines.push('<meta property="og:url" content="'+esc(url)+'">');
          if (image) lines.push('<meta property="og:image" content="'+esc(image)+'">');
          if (site) lines.push('<meta property="og:site_name" content="'+esc(site)+'">');
          lines.push('<meta name="twitter:card" content="'+twitterCard+'">');
          if (title) lines.push('<meta name="twitter:title" content="'+esc(title)+'">');
          if (desc) lines.push('<meta name="twitter:description" content="'+esc(desc)+'">');
          if (image) lines.push('<meta name="twitter:image" content="'+esc(image)+'">');
          document.getElementById('og-output').value = lines.join('\\n');
          document.querySelector('.tool-panel').dispatchEvent(new CustomEvent('utoline:operation', {detail:{state:'success', message:'Open Graph and social preview tags are ready.', result:document.getElementById('og-output').value}}));
        });
        document.getElementById('og-reset').addEventListener('click', function(){
          ['og-title','og-desc','og-url','og-image','og-site'].forEach(id => document.getElementById(id).value='');
          document.getElementById('og-output').value = '';
        });
        document.getElementById('og-copy').addEventListener('click', function(){ copyToClipboard(document.getElementById('og-output').value, this); });
      })();`,
    howTo: ['Fill in your page details and image URL.', 'Click Generate tags.', 'Paste the result into your page’s &lt;head&gt; to control how links look when shared.'],
    faq: [{ q: 'What image size works best for og:image?', a: 'A common recommendation is 1200×630 pixels for a good appearance across most platforms.' }]
  },
  {
    slug: 'robots-txt-generator',
    name: 'Robots.txt Generator',
    category: 'seo-tools',
    description: 'Generate a valid robots.txt file to control which search engine crawlers can access your site.',
    keywords: ['robots.txt generator', 'create robots.txt', 'disallow crawler'],
    related: ['sitemap-generator', 'meta-tag-generator', 'serp-snippet-preview'],
    html: `
      <div class="tool-panel">
        <label class="field-label" for="robots-agent">User-agent</label>
        <input id="robots-agent" class="input" type="text" value="*" placeholder="* (all crawlers)">
        <div class="grid-2">
          <div><label class="field-label" for="robots-allow">Allow paths (one per line)</label><textarea id="robots-allow" class="textarea" rows="4" placeholder="/"></textarea></div>
          <div><label class="field-label" for="robots-disallow">Disallow paths (one per line)</label><textarea id="robots-disallow" class="textarea" rows="4" placeholder="/admin/\n/api/"></textarea></div>
        </div>
        <label class="field-label" for="robots-sitemap">Sitemap URL (optional)</label>
        <input id="robots-sitemap" class="input" type="text" placeholder="https://example.com/sitemap.xml">
        <div class="toolbar">
          <button class="btn btn-primary" id="robots-run" type="button">Generate robots.txt</button>
          <button class="btn btn-ghost" id="robots-reset" type="button">Reset</button>
        </div>
        <label class="field-label" for="robots-output">robots.txt</label>
        <textarea id="robots-output" class="textarea code" rows="8" readonly spellcheck="false"></textarea>
        <div class="toolbar">
          <button class="btn btn-ghost" id="robots-copy" type="button">Copy</button>
          <button class="btn btn-ghost" id="robots-download" type="button">Download robots.txt</button>
        </div>
      </div>`,
    script: `
      (function(){
        document.getElementById('robots-run').addEventListener('click', function(){
          const agent = document.getElementById('robots-agent').value.trim() || '*';
          const allow = document.getElementById('robots-allow').value.split('\\n').map(l=>l.trim()).filter(Boolean);
          const disallow = document.getElementById('robots-disallow').value.split('\\n').map(l=>l.trim()).filter(Boolean);
          const sitemap = document.getElementById('robots-sitemap').value.trim();
          let lines = ['User-agent: ' + agent];
          allow.forEach(p => lines.push('Allow: ' + p));
          disallow.forEach(p => lines.push('Disallow: ' + p));
          if (!allow.length && !disallow.length) lines.push('Disallow:');
          if (sitemap) { lines.push(''); lines.push('Sitemap: ' + sitemap); }
          document.getElementById('robots-output').value = lines.join('\\n');
        });
        document.getElementById('robots-reset').addEventListener('click', function(){
          document.getElementById('robots-agent').value='*';
          ['robots-allow','robots-disallow','robots-sitemap'].forEach(id => document.getElementById(id).value='');
          document.getElementById('robots-output').value = '';
        });
        document.getElementById('robots-copy').addEventListener('click', function(){ copyToClipboard(document.getElementById('robots-output').value, this); });
        document.getElementById('robots-download').addEventListener('click', function(){ downloadText(document.getElementById('robots-output').value, 'robots.txt'); });
      })();`,
    howTo: ['Set the user-agent (use * for all crawlers).', 'List paths to allow or disallow, one per line.', 'Optionally add your sitemap URL, then generate and download robots.txt.'],
    faq: [{ q: 'Where do I put this file?', a: 'Upload the generated robots.txt to the root of your domain, e.g. https://example.com/robots.txt.' }]
  },
  {
    slug: 'sitemap-generator',
    name: 'Sitemap Generator',
    category: 'seo-tools',
    description: 'Generate a valid XML sitemap from a list of URLs you provide.',
    keywords: ['sitemap generator', 'xml sitemap creator', 'sitemap.xml generator'],
    related: ['robots-txt-generator', 'meta-tag-generator', 'open-graph-generator'],
    html: `
      <div class="tool-panel">
        <label class="field-label" for="sm-urls">URLs (one per line)</label>
        <textarea id="sm-urls" class="textarea" rows="8" placeholder="https://example.com/\nhttps://example.com/about\nhttps://example.com/tools/word-counter"></textarea>
        <div class="grid-2">
          <div><label class="field-label" for="sm-freq">Change frequency</label>
            <select id="sm-freq" class="select"><option value="">(none)</option><option>always</option><option>hourly</option><option>daily</option><option selected>weekly</option><option>monthly</option><option>yearly</option><option>never</option></select>
          </div>
          <div><label class="field-label" for="sm-priority">Priority</label><input id="sm-priority" class="input" type="number" min="0" max="1" step="0.1" value="0.8"></div>
        </div>
        <div class="toolbar">
          <button class="btn btn-primary" id="sm-run" type="button">Generate sitemap</button>
          <button class="btn btn-ghost" id="sm-reset" type="button">Reset</button>
        </div>
        <div id="sm-error" class="alert alert-error" role="alert" hidden></div>
        <label class="field-label" for="sm-output">sitemap.xml</label>
        <textarea id="sm-output" class="textarea code" rows="10" readonly spellcheck="false"></textarea>
        <div class="toolbar">
          <button class="btn btn-ghost" id="sm-copy" type="button">Copy</button>
          <button class="btn btn-ghost" id="sm-download" type="button">Download sitemap.xml</button>
        </div>
      </div>`,
    script: `
      (function(){
        function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
        document.getElementById('sm-run').addEventListener('click', function(){
          const raw = document.getElementById('sm-urls').value.split('\\n').map(l=>l.trim()).filter(Boolean);
          const errBox = document.getElementById('sm-error');
          const valid = raw.filter(u => /^https?:\\/\\//i.test(u));
          if (!valid.length){ errBox.hidden=false; errBox.textContent='Enter at least one valid absolute URL (starting with http:// or https://).'; document.getElementById('sm-output').value=''; return; }
          errBox.hidden = true;
          const freq = document.getElementById('sm-freq').value;
          const priority = document.getElementById('sm-priority').value;
          const today = new Date().toISOString().slice(0,10);
          let xml = '<?xml version="1.0" encoding="UTF-8"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n';
          valid.forEach(u => {
            xml += '  <url>\\n    <loc>' + esc(u) + '</loc>\\n    <lastmod>' + today + '</lastmod>\\n';
            if (freq) xml += '    <changefreq>' + freq + '</changefreq>\\n';
            if (priority) xml += '    <priority>' + priority + '</priority>\\n';
            xml += '  </url>\\n';
          });
          xml += '</urlset>';
          document.getElementById('sm-output').value = xml;
        });
        document.getElementById('sm-reset').addEventListener('click', function(){
          document.getElementById('sm-urls').value=''; document.getElementById('sm-output').value=''; document.getElementById('sm-error').hidden=true;
        });
        document.getElementById('sm-copy').addEventListener('click', function(){ copyToClipboard(document.getElementById('sm-output').value, this); });
        document.getElementById('sm-download').addEventListener('click', function(){ downloadText(document.getElementById('sm-output').value, 'sitemap.xml'); });
      })();`,
    howTo: ['Paste your list of full URLs, one per line.', 'Choose a change frequency and priority.', 'Generate, then download sitemap.xml and upload it to your site’s root.'],
    faq: [{ q: 'Do URLs need to be absolute?', a: 'Yes — sitemap entries must be full URLs including the https:// scheme and domain, not relative paths.' }]
  },
  {
    slug: 'serp-snippet-preview',
    name: 'SERP Snippet Preview',
    category: 'seo-tools',
    description: 'Preview how your page title and description might appear as a search result snippet, on desktop and mobile widths.',
    keywords: ['serp preview', 'google snippet preview tool', 'search result preview'],
    related: ['meta-tag-generator', 'open-graph-generator', 'robots-txt-generator'],
    html: `
      <div class="tool-panel">
        <p class="hint">This is an approximate visual guide, not an exact reproduction of Google’s current search results design, which changes over time.</p>
        <label class="field-label" for="serp-title">Title</label>
        <input id="serp-title" class="input" type="text" maxlength="70" placeholder="Free Word Counter — Count Words &amp; Characters Online">
        <label class="field-label" for="serp-url">URL</label>
        <input id="serp-url" class="input" type="text" placeholder="https://example.com/tools/word-counter">
        <label class="field-label" for="serp-desc">Description</label>
        <textarea id="serp-desc" class="textarea" rows="3" maxlength="170" placeholder="Count words, characters, sentences and paragraphs instantly with our free online word counter."></textarea>
        <div class="tab-group" role="tablist">
          <button class="tab active" data-view="desktop" role="tab" aria-selected="true">Desktop</button>
          <button class="tab" data-view="mobile" role="tab" aria-selected="false">Mobile</button>
        </div>
        <div id="serp-preview" class="serp-preview" aria-live="polite"></div>
      </div>`,
    script: `
      (function(){
        let view = 'desktop';
        function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
        function render(){
          const title = document.getElementById('serp-title').value || 'Your page title here';
          const url = document.getElementById('serp-url').value || 'https://example.com/page';
          const desc = document.getElementById('serp-desc').value || 'Your meta description will appear here as a preview snippet.';
          const box = document.getElementById('serp-preview');
          box.className = 'serp-preview serp-' + view;
          box.innerHTML = '<div class="serp-url">' + esc(url) + '</div><div class="serp-title">' + esc(title) + '</div><div class="serp-desc">' + esc(desc) + '</div>';
        }
        document.querySelectorAll('.tab-group .tab').forEach(t => t.addEventListener('click', function(){
          document.querySelectorAll('.tab-group .tab').forEach(x=>{x.classList.remove('active'); x.setAttribute('aria-selected','false');});
          this.classList.add('active'); this.setAttribute('aria-selected','true');
          view = this.dataset.view; render();
        }));
        ['serp-title','serp-url','serp-desc'].forEach(id => document.getElementById(id).addEventListener('input', render));
        render();
      })();`,
    howTo: ['Enter your title, URL and description.', 'Switch between desktop and mobile preview widths.', 'Adjust wording until it fits comfortably without truncating.'],
    faq: [{ q: 'Does this exactly match Google’s search results?', a: 'No — it’s a close visual approximation. Google’s actual snippet design, truncation length and rendering rules change periodically and can vary by query.' }]
  }
];
