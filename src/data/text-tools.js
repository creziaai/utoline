module.exports = [
  {
    slug: 'word-counter',
    name: 'Word Counter',
    category: 'text-tools',
    description: 'Count words, characters, sentences and paragraphs in real time, plus estimated reading and speaking time.',
    keywords: ['word counter', 'character count', 'reading time', 'text counter', 'count words online'],
    related: ['character-counter', 'text-cleaner', 'case-converter'],
    html: `
      <div class="tool-panel">
        <label class="field-label" for="wc-input">Paste or type your text</label>
        <textarea id="wc-input" class="textarea" rows="10" placeholder="Start typing or paste your text here…" aria-label="Text to analyze"></textarea>
        <div class="toolbar">
          <button class="btn btn-ghost" id="wc-reset" type="button">Reset</button>
          <button class="btn btn-ghost" id="wc-copy" type="button">Copy text</button>
        </div>
        <div class="stats-grid" id="wc-stats" aria-live="polite">
          <div class="stat"><span class="stat-value" id="wc-words">0</span><span class="stat-label">Words</span></div>
          <div class="stat"><span class="stat-value" id="wc-chars">0</span><span class="stat-label">Characters</span></div>
          <div class="stat"><span class="stat-value" id="wc-chars-ns">0</span><span class="stat-label">Characters (no spaces)</span></div>
          <div class="stat"><span class="stat-value" id="wc-sentences">0</span><span class="stat-label">Sentences</span></div>
          <div class="stat"><span class="stat-value" id="wc-paragraphs">0</span><span class="stat-label">Paragraphs</span></div>
          <div class="stat"><span class="stat-value" id="wc-avg">0</span><span class="stat-label">Avg. word length</span></div>
          <div class="stat"><span class="stat-value" id="wc-read">0 sec</span><span class="stat-label">Reading time</span></div>
          <div class="stat"><span class="stat-value" id="wc-speak">0 sec</span><span class="stat-label">Speaking time</span></div>
        </div>
      </div>`,
    script: `
      (function(){
        const input = document.getElementById('wc-input');
        const els = {
          words: document.getElementById('wc-words'),
          chars: document.getElementById('wc-chars'),
          charsNs: document.getElementById('wc-chars-ns'),
          sentences: document.getElementById('wc-sentences'),
          paragraphs: document.getElementById('wc-paragraphs'),
          avg: document.getElementById('wc-avg'),
          read: document.getElementById('wc-read'),
          speak: document.getElementById('wc-speak'),
        };
        function fmtTime(seconds){
          if (seconds < 60) return Math.max(1, Math.round(seconds)) + ' sec';
          const m = Math.floor(seconds/60), s = Math.round(seconds%60);
          return m + ' min ' + s + ' sec';
        }
        function update(){
          const text = input.value;
          const trimmed = text.trim();
          const words = trimmed.length ? trimmed.split(/\\s+/).filter(Boolean) : [];
          const chars = text.length;
          const charsNs = text.replace(/\\s/g,'').length;
          const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []).filter(s=>s.trim().length).length : 0;
          const paragraphs = trimmed ? trimmed.split(/\\n\\s*\\n/).filter(p=>p.trim().length).length : 0;
          const avgLen = words.length ? (words.join('').length / words.length).toFixed(1) : '0';
          els.words.textContent = words.length.toLocaleString();
          els.chars.textContent = chars.toLocaleString();
          els.charsNs.textContent = charsNs.toLocaleString();
          els.sentences.textContent = sentences.toLocaleString();
          els.paragraphs.textContent = paragraphs.toLocaleString();
          els.avg.textContent = avgLen;
          els.read.textContent = fmtTime((words.length/225)*60);
          els.speak.textContent = fmtTime((words.length/130)*60);
        }
        input.addEventListener('input', update);
        document.getElementById('wc-reset').addEventListener('click', function(){ input.value=''; update(); input.focus(); });
        document.getElementById('wc-copy').addEventListener('click', function(){ copyToClipboard(input.value, this); });
        update();
      })();`,
    howTo: [
      'Paste or type your text into the box above.',
      'Counts update instantly as you type — no button required.',
      'Use Copy to copy your original text, or Reset to start over.'
    ],
    faq: [
      { q: 'Does this word counter send my text anywhere?', a: 'No. All counting happens locally in your browser using JavaScript. Your text is never uploaded or stored.' },
      { q: 'How is reading time calculated?', a: 'Reading time is estimated at 225 words per minute, a commonly used average adult silent-reading speed. Speaking time uses 130 words per minute.' },
      { q: 'How are sentences counted?', a: 'Sentences are detected by splitting on ., ! and ? punctuation. Abbreviations or unusual formatting can occasionally affect accuracy.' }
    ]
  },
  {
    slug: 'character-counter',
    name: 'Character Counter',
    category: 'text-tools',
    description: 'Count characters, characters without spaces, words and lines instantly — useful for meeting title tags, bios and SMS limits.',
    keywords: ['character counter', 'character count', 'letter count', 'count characters'],
    related: ['word-counter', 'text-cleaner', 'case-converter'],
    html: `
      <div class="tool-panel">
        <label class="field-label" for="cc-input">Your text</label>
        <textarea id="cc-input" class="textarea" rows="8" placeholder="Type or paste text…" aria-label="Text to count"></textarea>
        <div class="toolbar">
          <button class="btn btn-ghost" id="cc-reset" type="button">Reset</button>
          <button class="btn btn-ghost" id="cc-copy" type="button">Copy text</button>
        </div>
        <div class="stats-grid" aria-live="polite">
          <div class="stat"><span class="stat-value" id="cc-chars">0</span><span class="stat-label">Characters</span></div>
          <div class="stat"><span class="stat-value" id="cc-chars-ns">0</span><span class="stat-label">Characters (no spaces)</span></div>
          <div class="stat"><span class="stat-value" id="cc-words">0</span><span class="stat-label">Words</span></div>
          <div class="stat"><span class="stat-value" id="cc-lines">0</span><span class="stat-label">Lines</span></div>
        </div>
      </div>`,
    script: `
      (function(){
        const input = document.getElementById('cc-input');
        function update(){
          const text = input.value;
          const trimmed = text.trim();
          document.getElementById('cc-chars').textContent = text.length.toLocaleString();
          document.getElementById('cc-chars-ns').textContent = text.replace(/\\s/g,'').length.toLocaleString();
          document.getElementById('cc-words').textContent = (trimmed ? trimmed.split(/\\s+/).filter(Boolean).length : 0).toLocaleString();
          document.getElementById('cc-lines').textContent = (text.length ? text.split(/\\n/).length : 0).toLocaleString();
        }
        input.addEventListener('input', update);
        document.getElementById('cc-reset').addEventListener('click', function(){ input.value=''; update(); input.focus(); });
        document.getElementById('cc-copy').addEventListener('click', function(){ copyToClipboard(input.value, this); });
        update();
      })();`,
    howTo: ['Paste your text in the box.', 'Read off character, word and line counts instantly.', 'Use this to check limits for bios, SMS, meta titles and tweets.'],
    faq: [{ q: 'Does a space count as a character?', a: 'Yes, in the standard character count. The "characters without spaces" stat excludes all whitespace.' }]
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    category: 'text-tools',
    description: 'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, aLtErNaTiNg case and more with one click.',
    keywords: ['case converter', 'uppercase to lowercase', 'title case converter', 'sentence case'],
    related: ['word-counter', 'text-cleaner', 'text-to-slug'],
    html: `
      <div class="tool-panel">
        <label class="field-label" for="case-input">Your text</label>
        <textarea id="case-input" class="textarea" rows="8" placeholder="Type or paste text…" aria-label="Text to convert"></textarea>
        <div class="toolbar toolbar-wrap">
          <button class="btn btn-primary" data-case="upper" type="button">UPPERCASE</button>
          <button class="btn btn-primary" data-case="lower" type="button">lowercase</button>
          <button class="btn btn-primary" data-case="title" type="button">Title Case</button>
          <button class="btn btn-primary" data-case="sentence" type="button">Sentence case</button>
          <button class="btn btn-primary" data-case="capitalize" type="button">Capitalize Each Word</button>
          <button class="btn btn-primary" data-case="alternating" type="button">aLtErNaTiNg</button>
          <button class="btn btn-primary" data-case="inverse" type="button">InVERSE</button>
        </div>
        <div class="toolbar">
          <button class="btn btn-ghost" id="case-reset" type="button">Reset</button>
          <button class="btn btn-ghost" id="case-copy" type="button">Copy result</button>
        </div>
      </div>`,
    script: `
      (function(){
        const input = document.getElementById('case-input');
        function titleCase(s){ return s.toLowerCase().replace(/(^|\\s)([a-z])/g, function(m,p1,p2){ return p1+p2.toUpperCase(); }); }
        function sentenceCase(s){ return s.toLowerCase().replace(/(^\\s*[a-z])|([.!?]\\s*[a-z])/g, m => m.toUpperCase()); }
        function capitalizeEach(s){ return s.replace(/\\S+/g, w => w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()); }
        function alternating(s){ return s.split('').map((c,i)=> i%2===0 ? c.toLowerCase() : c.toUpperCase()).join(''); }
        function inverse(s){ return s.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''); }
        document.querySelectorAll('[data-case]').forEach(btn => {
          btn.addEventListener('click', function(){
            const s = input.value;
            let out = s;
            switch(this.dataset.case){
              case 'upper': out = s.toUpperCase(); break;
              case 'lower': out = s.toLowerCase(); break;
              case 'title': out = titleCase(s); break;
              case 'sentence': out = sentenceCase(s); break;
              case 'capitalize': out = capitalizeEach(s); break;
              case 'alternating': out = alternating(s); break;
              case 'inverse': out = inverse(s); break;
            }
            input.value = out;
            input.focus();
          });
        });
        document.getElementById('case-reset').addEventListener('click', function(){ input.value=''; input.focus(); });
        document.getElementById('case-copy').addEventListener('click', function(){ copyToClipboard(input.value, this); });
      })();`,
    howTo: ['Paste your text.', 'Click the case style you want.', 'The text box updates in place — click Copy result to copy it.'],
    faq: [{ q: 'Can I undo a conversion?', a: 'Converting again with the original wording isn’t always reversible (e.g. UPPERCASE loses original casing), so keep a copy of your original text if you need it later.' }]
  },
  {
    slug: 'remove-duplicate-lines',
    name: 'Remove Duplicate Lines',
    category: 'text-tools',
    description: 'Remove duplicate lines from a list while preserving the first occurrence, with case-sensitivity, trimming and sorting options.',
    keywords: ['remove duplicate lines', 'unique lines', 'dedupe text', 'remove duplicates from list'],
    related: ['text-sorter', 'text-cleaner', 'word-counter'],
    html: `
      <div class="tool-panel">
        <label class="field-label" for="rdl-input">Paste your list (one item per line)</label>
        <textarea id="rdl-input" class="textarea" rows="10" placeholder="apple\napple\nbanana\ncherry" aria-label="Lines to deduplicate"></textarea>
        <div class="toolbar toolbar-wrap">
          <label class="check"><input type="checkbox" id="rdl-case"> Case-sensitive</label>
          <label class="check"><input type="checkbox" id="rdl-trim" checked> Trim whitespace</label>
          <label class="check"><input type="checkbox" id="rdl-sort"> Sort results (A→Z)</label>
        </div>
        <div class="toolbar">
          <button class="btn btn-primary" id="rdl-run" type="button">Remove duplicates</button>
          <button class="btn btn-ghost" id="rdl-reset" type="button">Reset</button>
        </div>
        <label class="field-label" for="rdl-output">Result</label>
        <textarea id="rdl-output" class="textarea" rows="8" readonly aria-label="Result"></textarea>
        <div class="toolbar">
          <button class="btn btn-ghost" id="rdl-copy" type="button">Copy result</button>
          <button class="btn btn-ghost" id="rdl-download" type="button">Download .txt</button>
        </div>
        <p class="hint" id="rdl-count"></p>
      </div>`,
    script: `
      (function(){
        const input = document.getElementById('rdl-input');
        const output = document.getElementById('rdl-output');
        function run(){
          const caseSensitive = document.getElementById('rdl-case').checked;
          const trim = document.getElementById('rdl-trim').checked;
          const sort = document.getElementById('rdl-sort').checked;
          let lines = input.value.split(/\\n/);
          if (trim) lines = lines.map(l => l.trim());
          const seen = new Set();
          const result = [];
          for (const line of lines){
            const key = caseSensitive ? line : line.toLowerCase();
            if (!seen.has(key)){ seen.add(key); result.push(line); }
          }
          if (sort) result.sort((a,b) => a.localeCompare(b));
          output.value = result.join('\\n');
          document.getElementById('rdl-count').textContent = lines.length + ' lines in → ' + result.length + ' unique lines out.';
        }
        document.getElementById('rdl-run').addEventListener('click', run);
        document.getElementById('rdl-reset').addEventListener('click', function(){ input.value=''; output.value=''; document.getElementById('rdl-count').textContent=''; });
        document.getElementById('rdl-copy').addEventListener('click', function(){ copyToClipboard(output.value, this); });
        document.getElementById('rdl-download').addEventListener('click', function(){ downloadText(output.value, 'unique-lines.txt'); });
      })();`,
    howTo: ['Paste a list with one item per line.', 'Choose case-sensitivity, trimming and sorting options.', 'Click Remove duplicates, then copy or download the result.'],
    faq: [{ q: 'Which occurrence is kept when a duplicate is found?', a: 'The first occurrence of each line is kept; later duplicates are removed.' }]
  },
  {
    slug: 'text-sorter',
    name: 'Text Sorter',
    category: 'text-tools',
    description: 'Sort lines of text alphabetically or numerically, reverse line order, remove duplicates, or shuffle lines randomly.',
    keywords: ['text sorter', 'sort lines', 'alphabetical order', 'randomize lines'],
    related: ['remove-duplicate-lines', 'text-cleaner', 'random-number-generator'],
    html: `
      <div class="tool-panel">
        <label class="field-label" for="ts-input">Paste your list (one item per line)</label>
        <textarea id="ts-input" class="textarea" rows="10" placeholder="banana\napple\ncherry" aria-label="Lines to sort"></textarea>
        <div class="toolbar toolbar-wrap">
          <button class="btn btn-primary" data-sort="az" type="button">A → Z</button>
          <button class="btn btn-primary" data-sort="za" type="button">Z → A</button>
          <button class="btn btn-primary" data-sort="numasc" type="button">Numeric ↑</button>
          <button class="btn btn-primary" data-sort="numdesc" type="button">Numeric ↓</button>
          <button class="btn btn-primary" data-sort="reverse" type="button">Reverse lines</button>
          <button class="btn btn-primary" data-sort="shuffle" type="button">Randomize</button>
          <button class="btn btn-primary" data-sort="unique" type="button">Remove duplicates</button>
        </div>
        <div class="toolbar">
          <button class="btn btn-ghost" id="ts-reset" type="button">Reset</button>
          <button class="btn btn-ghost" id="ts-copy" type="button">Copy result</button>
        </div>
      </div>`,
    script: `
      (function(){
        const input = document.getElementById('ts-input');
        function lines(){ return input.value.split(/\\n/); }
        document.querySelectorAll('[data-sort]').forEach(btn=>{
          btn.addEventListener('click', function(){
            let arr = lines();
            switch(this.dataset.sort){
              case 'az': arr.sort((a,b)=>a.localeCompare(b)); break;
              case 'za': arr.sort((a,b)=>b.localeCompare(a)); break;
              case 'numasc': arr.sort((a,b)=>(parseFloat(a)||0)-(parseFloat(b)||0)); break;
              case 'numdesc': arr.sort((a,b)=>(parseFloat(b)||0)-(parseFloat(a)||0)); break;
              case 'reverse': arr.reverse(); break;
              case 'shuffle':
                for (let i = arr.length - 1; i > 0; i--){
                  const j = Math.floor(Math.random() * (i + 1));
                  [arr[i], arr[j]] = [arr[j], arr[i]];
                }
                break;
              case 'unique': arr = [...new Set(arr)]; break;
            }
            input.value = arr.join('\\n');
          });
        });
        document.getElementById('ts-reset').addEventListener('click', function(){ input.value=''; input.focus(); });
        document.getElementById('ts-copy').addEventListener('click', function(){ copyToClipboard(input.value, this); });
      })();`,
    howTo: ['Paste one item per line.', 'Click a sort option — the box updates immediately.', 'Copy the result when you’re happy with the order.'],
    faq: [{ q: 'What happens to non-numeric values in numeric sort?', a: 'Lines that don’t start with a number are treated as 0, so they’ll sort to the start (ascending) or end (descending).' }]
  },
  {
    slug: 'text-cleaner',
    name: 'Text Cleaner',
    category: 'text-tools',
    description: 'Clean up messy text: remove extra spaces, blank lines, special characters and normalize line breaks.',
    keywords: ['text cleaner', 'remove extra spaces', 'clean text online', 'remove blank lines'],
    related: ['word-counter', 'case-converter', 'remove-duplicate-lines'],
    html: `
      <div class="tool-panel">
        <label class="field-label" for="tc-input">Your text</label>
        <textarea id="tc-input" class="textarea" rows="10" placeholder="Paste messy text here…" aria-label="Text to clean"></textarea>
        <div class="toolbar toolbar-wrap">
          <label class="check"><input type="checkbox" id="tc-spaces" checked> Remove extra spaces</label>
          <label class="check"><input type="checkbox" id="tc-blank" checked> Remove blank lines</label>
          <label class="check"><input type="checkbox" id="tc-trim" checked> Trim each line</label>
          <label class="check"><input type="checkbox" id="tc-breaks"> Normalize line breaks</label>
          <label class="check"><input type="checkbox" id="tc-special"> Remove special characters</label>
          <label class="check"><input type="checkbox" id="tc-punct"> Remove punctuation</label>
        </div>
        <div class="toolbar">
          <button class="btn btn-primary" id="tc-run" type="button">Clean text</button>
          <button class="btn btn-ghost" id="tc-reset" type="button">Reset</button>
        </div>
        <label class="field-label" for="tc-output">Result</label>
        <textarea id="tc-output" class="textarea" rows="8" readonly aria-label="Cleaned text"></textarea>
        <div class="toolbar">
          <button class="btn btn-ghost" id="tc-copy" type="button">Copy result</button>
          <button class="btn btn-ghost" id="tc-download" type="button">Download .txt</button>
        </div>
      </div>`,
    script: `
      (function(){
        const input = document.getElementById('tc-input');
        const output = document.getElementById('tc-output');
        function run(){
          let text = input.value;
          if (document.getElementById('tc-breaks').checked) text = text.replace(/\\r\\n?/g, '\\n');
          let lines = text.split('\\n');
          if (document.getElementById('tc-trim').checked) lines = lines.map(l => l.trim());
          text = lines.join('\\n');
          if (document.getElementById('tc-spaces').checked) text = text.split('\\n').map(l => l.replace(/[ \\t]+/g,' ')).join('\\n');
          if (document.getElementById('tc-blank').checked) text = text.split('\\n').filter(l => l.trim().length).join('\\n');
          if (document.getElementById('tc-special').checked) text = text.replace(/[^\\p{L}\\p{N}\\s.,!?'"-]/gu, '');
          if (document.getElementById('tc-punct').checked) text = text.replace(/[.,!?;:'"()\\[\\]{}]/g, '');
          output.value = text;
        }
        document.getElementById('tc-run').addEventListener('click', run);
        document.getElementById('tc-reset').addEventListener('click', function(){ input.value=''; output.value=''; });
        document.getElementById('tc-copy').addEventListener('click', function(){ copyToClipboard(output.value, this); });
        document.getElementById('tc-download').addEventListener('click', function(){ downloadText(output.value, 'cleaned-text.txt'); });
      })();`,
    howTo: ['Paste your text.', 'Tick the cleanup options you need.', 'Click Clean text, then copy or download the result.'],
    faq: [{ q: 'Will this change the meaning of my text?', a: 'Options like removing punctuation or special characters can change meaning, so preview the result before replacing your original text.' }]
  }
];
