module.exports = [
  {
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    category: 'developer-tools',
    description: 'Format, minify and validate JSON with clear error messages and adjustable indentation.',
    keywords: ['json formatter', 'json validator', 'json minifier', 'json beautifier', 'pretty print json'],
    related: ['base64-encoder-decoder', 'url-encoder-decoder', 'regex-tester'],
    html: `
      <div class="tool-panel">
        <label class="field-label" for="json-input">Paste JSON</label>
        <textarea id="json-input" class="textarea code" rows="10" placeholder='{"name":"Utoline","free":true}' aria-label="JSON input" spellcheck="false"></textarea>
        <div class="toolbar toolbar-wrap">
          <label class="field-inline">Indent
            <select id="json-indent" class="select">
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="tab">Tab</option>
            </select>
          </label>
          <button class="btn btn-primary" id="json-format" type="button">Format</button>
          <button class="btn btn-primary" id="json-minify" type="button">Minify</button>
          <button class="btn btn-ghost" id="json-validate" type="button">Validate only</button>
          <button class="btn btn-ghost" id="json-reset" type="button">Reset</button>
        </div>
        <div id="json-error" class="alert alert-error" role="alert" hidden></div>
        <div id="json-success" class="alert alert-success" role="status" hidden></div>
        <label class="field-label" for="json-output">Output</label>
        <textarea id="json-output" class="textarea code" rows="10" readonly aria-label="Formatted JSON" spellcheck="false"></textarea>
        <div class="toolbar">
          <button class="btn btn-ghost" id="json-copy" type="button">Copy output</button>
          <button class="btn btn-ghost" id="json-download" type="button">Download .json</button>
        </div>
      </div>`,
    script: `
      (function(){
        const input = document.getElementById('json-input');
        const output = document.getElementById('json-output');
        const errBox = document.getElementById('json-error');
        const okBox = document.getElementById('json-success');
        function showError(e){
          okBox.hidden = true;
          errBox.hidden = false;
          let msg = e.message;
          const posMatch = msg.match(/position (\\d+)/);
          if (posMatch){
            const pos = parseInt(posMatch[1], 10);
            const upToError = input.value.slice(0, pos);
            const line = upToError.split('\\n').length;
            const col = pos - upToError.lastIndexOf('\\n');
            msg += ' (around line ' + line + ', column ' + col + ')';
          }
          errBox.textContent = 'Invalid JSON: ' + msg;
        }
        function showOk(text){
          errBox.hidden = true;
          okBox.hidden = false;
          okBox.textContent = text;
        }
        function indentValue(){
          const v = document.getElementById('json-indent').value;
          return v === 'tab' ? '\\t' : parseInt(v, 10);
        }
        document.getElementById('json-format').addEventListener('click', function(){
          try {
            const parsed = JSON.parse(input.value);
            output.value = JSON.stringify(parsed, null, indentValue());
            showOk('Valid JSON — formatted below.');
          } catch(e){ output.value=''; showError(e); }
        });
        document.getElementById('json-minify').addEventListener('click', function(){
          try {
            const parsed = JSON.parse(input.value);
            output.value = JSON.stringify(parsed);
            showOk('Valid JSON — minified below.');
          } catch(e){ output.value=''; showError(e); }
        });
        document.getElementById('json-validate').addEventListener('click', function(){
          try { JSON.parse(input.value); output.value=''; showOk('This is valid JSON.'); }
          catch(e){ showError(e); }
        });
        document.getElementById('json-reset').addEventListener('click', function(){
          input.value=''; output.value=''; errBox.hidden = true; okBox.hidden = true;
        });
        document.getElementById('json-copy').addEventListener('click', function(){ copyToClipboard(output.value, this); });
        document.getElementById('json-download').addEventListener('click', function(){ downloadText(output.value, 'formatted.json'); });
      })();`,
    howTo: ['Paste your JSON into the input box.', 'Choose an indentation size.', 'Click Format to beautify, Minify to compress, or Validate only to check for errors without producing output.'],
    faq: [
      { q: 'Where does the validation happen?', a: 'Entirely in your browser using the built-in JSON.parse function. Nothing is sent to a server.' },
      { q: 'Why does it say my JSON is invalid when it looks fine?', a: 'Common causes are trailing commas, single quotes instead of double quotes, or missing quotes around keys — JSON is stricter than JavaScript object literals.' }
    ]
  },
  {
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder / Decoder',
    category: 'developer-tools',
    description: 'Encode text to Base64 or decode Base64 back to text, with correct handling of Unicode characters.',
    keywords: ['base64 encode', 'base64 decode', 'base64 converter online'],
    related: ['url-encoder-decoder', 'html-encoder-decoder', 'json-formatter'],
    html: `
      <div class="tool-panel">
        <div class="tab-group" role="tablist">
          <button class="tab active" data-mode="encode" role="tab" aria-selected="true">Encode</button>
          <button class="tab" data-mode="decode" role="tab" aria-selected="false">Decode</button>
        </div>
        <label class="field-label" for="b64-input">Input</label>
        <textarea id="b64-input" class="textarea" rows="6" placeholder="Type text to encode…" aria-label="Base64 input"></textarea>
        <div class="toolbar">
          <button class="btn btn-primary" id="b64-run" type="button">Convert</button>
          <button class="btn btn-ghost" id="b64-reset" type="button">Reset</button>
        </div>
        <div id="b64-error" class="alert alert-error" role="alert" hidden></div>
        <label class="field-label" for="b64-output">Output</label>
        <textarea id="b64-output" class="textarea" rows="6" readonly aria-label="Result"></textarea>
        <div class="toolbar">
          <button class="btn btn-ghost" id="b64-copy" type="button">Copy result</button>
        </div>
      </div>`,
    script: `
      (function(){
        let mode = 'encode';
        document.querySelectorAll('.tab-group .tab').forEach(t => t.addEventListener('click', function(){
          document.querySelectorAll('.tab-group .tab').forEach(x=>{x.classList.remove('active'); x.setAttribute('aria-selected','false');});
          this.classList.add('active'); this.setAttribute('aria-selected','true');
          mode = this.dataset.mode;
          document.getElementById('b64-input').placeholder = mode === 'encode' ? 'Type text to encode…' : 'Paste Base64 to decode…';
        }));
        function utf8ToB64(str){ return btoa(unescape(encodeURIComponent(str))); }
        function b64ToUtf8(str){ return decodeURIComponent(escape(atob(str))); }
        document.getElementById('b64-run').addEventListener('click', function(){
          const input = document.getElementById('b64-input').value;
          const errBox = document.getElementById('b64-error');
          errBox.hidden = true;
          try {
            document.getElementById('b64-output').value = mode === 'encode' ? utf8ToB64(input) : b64ToUtf8(input);
          } catch(e){
            document.getElementById('b64-output').value = '';
            errBox.hidden = false;
            errBox.textContent = mode === 'decode' ? 'This doesn’t look like valid Base64.' : 'Could not encode this text.';
          }
        });
        document.getElementById('b64-reset').addEventListener('click', function(){
          document.getElementById('b64-input').value=''; document.getElementById('b64-output').value='';
          document.getElementById('b64-error').hidden = true;
        });
        document.getElementById('b64-copy').addEventListener('click', function(){ copyToClipboard(document.getElementById('b64-output').value, this); });
      })();`,
    howTo: ['Choose Encode or Decode.', 'Paste your text or Base64 string.', 'Click Convert and copy the result.'],
    faq: [{ q: 'Does this handle emoji and non-English text?', a: 'Yes. The encoder converts text to UTF-8 bytes before Base64 encoding, so accented letters, emoji and non-Latin scripts round-trip correctly.' }]
  },
  {
    slug: 'url-encoder-decoder',
    name: 'URL Encoder / Decoder',
    category: 'developer-tools',
    description: 'Percent-encode or decode URLs and query string components.',
    keywords: ['url encoder', 'url decoder', 'percent encoding', 'encodeuricomponent online'],
    related: ['base64-encoder-decoder', 'html-encoder-decoder', 'json-formatter'],
    html: `
      <div class="tool-panel">
        <div class="tab-group" role="tablist">
          <button class="tab active" data-mode="encode" role="tab" aria-selected="true">Encode</button>
          <button class="tab" data-mode="decode" role="tab" aria-selected="false">Decode</button>
        </div>
        <label class="field-label" for="url-input">Input</label>
        <textarea id="url-input" class="textarea" rows="5" placeholder="https://example.com/search?q=hello world" aria-label="URL input"></textarea>
        <div class="toolbar">
          <button class="btn btn-primary" id="url-run" type="button">Convert</button>
          <button class="btn btn-ghost" id="url-reset" type="button">Reset</button>
        </div>
        <div id="url-error" class="alert alert-error" role="alert" hidden></div>
        <label class="field-label" for="url-output">Output</label>
        <textarea id="url-output" class="textarea" rows="5" readonly aria-label="Result"></textarea>
        <div class="toolbar"><button class="btn btn-ghost" id="url-copy" type="button">Copy result</button></div>
      </div>`,
    script: `
      (function(){
        let mode = 'encode';
        document.querySelectorAll('.tab-group .tab').forEach(t => t.addEventListener('click', function(){
          document.querySelectorAll('.tab-group .tab').forEach(x=>{x.classList.remove('active'); x.setAttribute('aria-selected','false');});
          this.classList.add('active'); this.setAttribute('aria-selected','true');
          mode = this.dataset.mode;
        }));
        document.getElementById('url-run').addEventListener('click', function(){
          const input = document.getElementById('url-input').value;
          const errBox = document.getElementById('url-error');
          errBox.hidden = true;
          try {
            document.getElementById('url-output').value = mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);
          } catch(e){
            document.getElementById('url-output').value='';
            errBox.hidden = false; errBox.textContent = 'Could not decode this value — it may not be validly percent-encoded.';
          }
        });
        document.getElementById('url-reset').addEventListener('click', function(){
          document.getElementById('url-input').value=''; document.getElementById('url-output').value='';
          document.getElementById('url-error').hidden = true;
        });
        document.getElementById('url-copy').addEventListener('click', function(){ copyToClipboard(document.getElementById('url-output').value, this); });
      })();`,
    howTo: ['Choose Encode or Decode.', 'Paste your URL or query string.', 'Click Convert and copy the result.'],
    faq: [{ q: 'Why does + sometimes mean a space?', a: 'In query strings, + traditionally represents a space, while %20 is the strict percent-encoded form. This tool uses standard percent-encoding via encodeURIComponent.' }]
  },
  {
    slug: 'html-encoder-decoder',
    name: 'HTML Encoder / Decoder',
    category: 'developer-tools',
    description: 'Convert text to HTML entities or decode HTML entities back to plain text.',
    keywords: ['html encoder', 'html entity decoder', 'escape html online'],
    related: ['url-encoder-decoder', 'base64-encoder-decoder', 'json-formatter'],
    html: `
      <div class="tool-panel">
        <div class="tab-group" role="tablist">
          <button class="tab active" data-mode="encode" role="tab" aria-selected="true">Encode</button>
          <button class="tab" data-mode="decode" role="tab" aria-selected="false">Decode</button>
        </div>
        <label class="field-label" for="html-input">Input</label>
        <textarea id="html-input" class="textarea" rows="6" placeholder="<div class=\\"card\\">Hello & welcome</div>" aria-label="HTML input"></textarea>
        <div class="toolbar">
          <button class="btn btn-primary" id="html-run" type="button">Convert</button>
          <button class="btn btn-ghost" id="html-reset" type="button">Reset</button>
        </div>
        <label class="field-label" for="html-output">Output</label>
        <textarea id="html-output" class="textarea" rows="6" readonly aria-label="Result"></textarea>
        <div class="toolbar"><button class="btn btn-ghost" id="html-copy" type="button">Copy result</button></div>
      </div>`,
    script: `
      (function(){
        let mode = 'encode';
        document.querySelectorAll('.tab-group .tab').forEach(t => t.addEventListener('click', function(){
          document.querySelectorAll('.tab-group .tab').forEach(x=>{x.classList.remove('active'); x.setAttribute('aria-selected','false');});
          this.classList.add('active'); this.setAttribute('aria-selected','true');
          mode = this.dataset.mode;
        }));
        function encode(str){
          const map = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};
          return str.replace(/[&<>"']/g, c => map[c]);
        }
        function decode(str){
          const el = document.createElement('textarea');
          el.innerHTML = str;
          return el.value;
        }
        document.getElementById('html-run').addEventListener('click', function(){
          const input = document.getElementById('html-input').value;
          document.getElementById('html-output').value = mode === 'encode' ? encode(input) : decode(input);
        });
        document.getElementById('html-reset').addEventListener('click', function(){
          document.getElementById('html-input').value=''; document.getElementById('html-output').value='';
        });
        document.getElementById('html-copy').addEventListener('click', function(){ copyToClipboard(document.getElementById('html-output').value, this); });
      })();`,
    howTo: ['Choose Encode or Decode.', 'Paste your HTML or text.', 'Click Convert and copy the result.'],
    faq: [{ q: 'Is decoding safe from malicious scripts?', a: 'Decoding here only extracts text content; it does not execute the HTML, so scripts embedded in decoded input will not run.' }]
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    category: 'developer-tools',
    description: 'Generate random UUID v4 values using your browser’s cryptographically secure random number generator.',
    keywords: ['uuid generator', 'guid generator', 'random uuid v4'],
    related: ['random-string-generator', 'password-generator', 'hash-generator'],
    html: `
      <div class="tool-panel">
        <div class="toolbar toolbar-wrap">
          <label class="field-inline">Quantity
            <input type="number" id="uuid-qty" class="input input-narrow" value="5" min="1" max="1000">
          </label>
          <label class="check"><input type="checkbox" id="uuid-upper"> Uppercase</label>
          <label class="check"><input type="checkbox" id="uuid-hyphens" checked> Include hyphens</label>
          <button class="btn btn-primary" id="uuid-run" type="button">Generate</button>
        </div>
        <label class="field-label" for="uuid-output">Generated UUIDs</label>
        <textarea id="uuid-output" class="textarea code" rows="10" readonly aria-label="Generated UUIDs"></textarea>
        <div class="toolbar"><button class="btn btn-ghost" id="uuid-copy" type="button">Copy all</button></div>
      </div>`,
    script: `
      (function(){
        function uuidv4(){
          if (crypto.randomUUID) return crypto.randomUUID();
          const bytes = crypto.getRandomValues(new Uint8Array(16));
          bytes[6] = (bytes[6] & 0x0f) | 0x40;
          bytes[8] = (bytes[8] & 0x3f) | 0x80;
          const hex = [...bytes].map(b => b.toString(16).padStart(2,'0'));
          return hex.slice(0,4).join('') + '-' + hex.slice(4,6).join('') + '-' + hex.slice(6,8).join('') + '-' + hex.slice(8,10).join('') + '-' + hex.slice(10,16).join('');
        }
        document.getElementById('uuid-run').addEventListener('click', function(){
          const qty = Math.min(1000, Math.max(1, parseInt(document.getElementById('uuid-qty').value, 10) || 1));
          const upper = document.getElementById('uuid-upper').checked;
          const hyphens = document.getElementById('uuid-hyphens').checked;
          const out = [];
          for (let i=0;i<qty;i++){
            let id = uuidv4();
            if (!hyphens) id = id.replace(/-/g, '');
            if (upper) id = id.toUpperCase();
            out.push(id);
          }
          document.getElementById('uuid-output').value = out.join('\\n');
        });
        document.getElementById('uuid-copy').addEventListener('click', function(){ copyToClipboard(document.getElementById('uuid-output').value, this); });
      })();`,
    howTo: ['Set the quantity of UUIDs you need.', 'Choose formatting options.', 'Click Generate, then copy all the values.'],
    faq: [{ q: 'Are these UUIDs cryptographically random?', a: 'Yes. They use the Web Crypto API (crypto.randomUUID or crypto.getRandomValues), the same secure source browsers use for cryptography.' }]
  },
  {
    slug: 'timestamp-converter',
    name: 'Timestamp Converter',
    category: 'developer-tools',
    description: 'Convert between Unix timestamps and human-readable dates, in both seconds and milliseconds, local time and UTC.',
    keywords: ['unix timestamp converter', 'epoch converter', 'timestamp to date'],
    related: ['date-difference-calculator', 'timezone-converter', 'countdown-calculator'],
    html: `
      <div class="tool-panel">
        <div class="grid-2">
          <div>
            <label class="field-label" for="ts-unix">Unix timestamp</label>
            <input id="ts-unix" class="input" type="text" placeholder="e.g. 1735689600" inputmode="numeric">
            <div class="toolbar toolbar-wrap">
              <label class="check"><input type="radio" name="ts-unit" value="s" checked> Seconds</label>
              <label class="check"><input type="radio" name="ts-unit" value="ms"> Milliseconds</label>
              <button class="btn btn-primary" id="ts-to-date" type="button">Convert to date</button>
              <button class="btn btn-ghost" id="ts-now" type="button">Use current time</button>
            </div>
          </div>
          <div>
            <label class="field-label" for="ts-date">Date &amp; time (local)</label>
            <input id="ts-date" class="input" type="datetime-local">
            <div class="toolbar">
              <button class="btn btn-primary" id="ts-to-unix" type="button">Convert to timestamp</button>
            </div>
          </div>
        </div>
        <div id="ts-error" class="alert alert-error" role="alert" hidden></div>
        <div class="stats-grid" id="ts-results" aria-live="polite">
          <div class="stat"><span class="stat-value" id="ts-local">—</span><span class="stat-label">Local time</span></div>
          <div class="stat"><span class="stat-value" id="ts-utc">—</span><span class="stat-label">UTC</span></div>
          <div class="stat"><span class="stat-value" id="ts-sec">—</span><span class="stat-label">Unix (seconds)</span></div>
          <div class="stat"><span class="stat-value" id="ts-ms">—</span><span class="stat-label">Unix (milliseconds)</span></div>
        </div>
      </div>`,
    script: `
      (function(){
        const errBox = document.getElementById('ts-error');
        function showResults(d){
          errBox.hidden = true;
          document.getElementById('ts-local').textContent = d.toLocaleString();
          document.getElementById('ts-utc').textContent = d.toUTCString();
          document.getElementById('ts-sec').textContent = Math.floor(d.getTime()/1000);
          document.getElementById('ts-ms').textContent = d.getTime();
        }
        document.getElementById('ts-to-date').addEventListener('click', function(){
          const raw = document.getElementById('ts-unix').value.trim();
          const unit = document.querySelector('input[name=ts-unit]:checked').value;
          if (!/^-?\\d+$/.test(raw)){ errBox.hidden = false; errBox.textContent = 'Enter a valid integer timestamp.'; return; }
          const num = parseInt(raw, 10);
          const ms = unit === 's' ? num * 1000 : num;
          const d = new Date(ms);
          if (isNaN(d.getTime())){ errBox.hidden = false; errBox.textContent = 'That timestamp is out of range.'; return; }
          showResults(d);
        });
        document.getElementById('ts-to-unix').addEventListener('click', function(){
          const val = document.getElementById('ts-date').value;
          if (!val){ errBox.hidden = false; errBox.textContent = 'Choose a date and time first.'; return; }
          const d = new Date(val);
          showResults(d);
        });
        document.getElementById('ts-now').addEventListener('click', function(){ showResults(new Date()); });
      })();`,
    howTo: ['Enter a Unix timestamp and choose seconds or milliseconds, then click Convert to date — or pick a date/time and click Convert to timestamp.', 'Results show local time, UTC, and both timestamp units at once.'],
    faq: [{ q: 'What is a Unix timestamp?', a: 'It’s the number of seconds (or milliseconds) elapsed since 00:00:00 UTC on 1 January 1970, widely used to store dates in a timezone-independent way.' }]
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    category: 'developer-tools',
    description: 'Test regular expressions against sample text with live match highlighting and capture groups.',
    keywords: ['regex tester', 'regular expression tester online', 'regex match highlighter'],
    related: ['json-formatter', 'text-cleaner', 'text-to-slug'],
    html: `
      <div class="tool-panel">
        <p class="hint">Your regex and text are matched entirely in your browser — nothing is sent anywhere.</p>
        <label class="field-label" for="regex-pattern">Regular expression</label>
        <div class="regex-row">
          <span class="regex-slash">/</span>
          <input id="regex-pattern" class="input" type="text" placeholder="[a-z]+@[a-z]+\\.[a-z]{2,}" spellcheck="false">
          <span class="regex-slash">/</span>
          <input id="regex-flags" class="input input-narrow" type="text" placeholder="gi" value="g" spellcheck="false" aria-label="Flags">
        </div>
        <div id="regex-error" class="alert alert-error" role="alert" hidden></div>
        <label class="field-label" for="regex-text">Test text</label>
        <textarea id="regex-text" class="textarea" rows="8" placeholder="Paste text to test against…" aria-label="Test text"></textarea>
        <label class="field-label">Highlighted matches</label>
        <div id="regex-highlight" class="highlight-box" aria-live="polite"></div>
        <label class="field-label" for="regex-matches">Matches &amp; capture groups</label>
        <textarea id="regex-matches" class="textarea code" rows="6" readonly aria-label="Matches"></textarea>
      </div>`,
    script: `
      (function(){
        const pattern = document.getElementById('regex-pattern');
        const flags = document.getElementById('regex-flags');
        const text = document.getElementById('regex-text');
        const highlight = document.getElementById('regex-highlight');
        const matchesBox = document.getElementById('regex-matches');
        const errBox = document.getElementById('regex-error');
        function esc(s){ return s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }
        function run(){
          errBox.hidden = true;
          const p = pattern.value;
          if (!p){ highlight.innerHTML = esc(text.value); matchesBox.value=''; return; }
          let re;
          try { re = new RegExp(p, flags.value.includes('g') ? flags.value : flags.value + 'g'); }
          catch(e){ errBox.hidden = false; errBox.textContent = 'Invalid regular expression: ' + e.message; return; }
          const t = text.value;
          let lastIndex = 0, html = '', results = [], m, count = 0;
          re.lastIndex = 0;
          while ((m = re.exec(t)) !== null && count < 2000){
            html += esc(t.slice(lastIndex, m.index)) + '<mark>' + esc(m[0] || '') + '</mark>';
            lastIndex = m.index + (m[0].length || 1);
            results.push('Match ' + (count+1) + ': "' + m[0] + '" at index ' + m.index + (m.length > 1 ? '\\n  Groups: ' + JSON.stringify(m.slice(1)) : ''));
            if (m[0].length === 0) re.lastIndex++;
            count++;
          }
          html += esc(t.slice(lastIndex));
          highlight.innerHTML = html || '<span class="hint">No text yet.</span>';
          matchesBox.value = results.length ? results.join('\\n') : 'No matches found.';
        }
        [pattern, flags, text].forEach(el => el.addEventListener('input', run));
        run();
      })();`,
    howTo: ['Enter a regular expression pattern and flags (e.g. g, i, m).', 'Paste your test text.', 'Matches highlight live, and capture groups list below.'],
    faq: [{ q: 'Is my regex or text sent to a server?', a: 'No. Matching runs locally using JavaScript’s built-in RegExp engine.' }]
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    category: 'developer-tools',
    description: 'Generate SHA-1, SHA-256, SHA-384 and SHA-512 hashes of text using your browser’s built-in cryptography.',
    keywords: ['hash generator', 'sha256 online', 'sha1 generator', 'text to hash'],
    related: ['password-generator', 'base64-encoder-decoder', 'uuid-generator'],
    html: `
      <div class="tool-panel">
        <label class="field-label" for="hash-input">Text to hash</label>
        <textarea id="hash-input" class="textarea" rows="6" placeholder="Type or paste text…" aria-label="Text to hash"></textarea>
        <div class="toolbar">
          <button class="btn btn-primary" id="hash-run" type="button">Generate hashes</button>
          <button class="btn btn-ghost" id="hash-reset" type="button">Reset</button>
        </div>
        <div class="stats-grid stats-grid-wide" id="hash-results" aria-live="polite">
          <div class="stat stat-wide"><span class="stat-label">SHA-1</span><code class="hash-value" id="hash-sha1">—</code></div>
          <div class="stat stat-wide"><span class="stat-label">SHA-256</span><code class="hash-value" id="hash-sha256">—</code></div>
          <div class="stat stat-wide"><span class="stat-label">SHA-384</span><code class="hash-value" id="hash-sha384">—</code></div>
          <div class="stat stat-wide"><span class="stat-label">SHA-512</span><code class="hash-value" id="hash-sha512">—</code></div>
        </div>
      </div>`,
    script: `
      (function(){
        async function hashText(text, algo){
          const enc = new TextEncoder().encode(text);
          const buf = await crypto.subtle.digest(algo, enc);
          return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,'0')).join('');
        }
        document.getElementById('hash-run').addEventListener('click', function(){
          const text = document.getElementById('hash-input').value;
          const algos = [['SHA-1','hash-sha1'],['SHA-256','hash-sha256'],['SHA-384','hash-sha384'],['SHA-512','hash-sha512']];
          withLoading(this, 'Hashing…', async function(){
            for (const [algo, id] of algos){
              document.getElementById(id).textContent = text ? await hashText(text, algo) : '—';
            }
          });
        });
        document.getElementById('hash-reset').addEventListener('click', function(){
          document.getElementById('hash-input').value = '';
          ['hash-sha1','hash-sha256','hash-sha384','hash-sha512'].forEach(id => document.getElementById(id).textContent = '—');
        });
      })();`,
    howTo: ['Type or paste the text you want to hash.', 'Click Generate hashes.', 'All four algorithms compute locally using the Web Crypto API.'],
    faq: [
      { q: 'Is this suitable for hashing passwords?', a: 'These are general-purpose cryptographic hash functions, not password-hashing algorithms. Password storage should use a dedicated function like bcrypt or Argon2 with salting, implemented server-side.' },
      { q: 'Why is there no MD5 option?', a: 'MD5 is not exposed by the browser’s built-in Web Crypto API and is considered cryptographically broken, so it’s intentionally omitted here.' }
    ]
  }
];
