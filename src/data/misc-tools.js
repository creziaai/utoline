module.exports = [
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    category: 'misc-tools',
    description: 'Generate a scannable QR code from a URL, plain text, email address or phone number, and download it as a PNG.',
    keywords: ['qr code generator', 'create qr code online', 'qr code for url'],
    related: ['color-converter', 'text-to-slug', 'random-string-generator'],
    usesExternalLib: 'qrcode',
    html: `
      <div class="tool-panel">
        <p class="hint">This tool loads a small, widely used open-source QR rendering library so it can draw a real, scannable code. Your input is encoded locally in your browser — it is not uploaded anywhere.</p>
        <div class="tab-group" role="tablist">
          <button class="tab active" data-type="text" role="tab" aria-selected="true">URL / Text</button>
          <button class="tab" data-type="email" role="tab" aria-selected="false">Email</button>
          <button class="tab" data-type="phone" role="tab" aria-selected="false">Phone</button>
        </div>
        <label class="field-label" for="qr-input">Content</label>
        <input id="qr-input" class="input" type="text" placeholder="https://example.com">
        <div class="grid-2">
          <div><label class="field-label" for="qr-size">Size (px)</label>
            <select id="qr-size" class="select"><option>200</option><option selected>300</option><option>400</option><option>600</option></select>
          </div>
          <div><label class="field-label" for="qr-ecc">Error correction</label>
            <select id="qr-ecc" class="select"><option value="L">Low (L)</option><option value="M" selected>Medium (M)</option><option value="Q">Quartile (Q)</option><option value="H">High (H)</option></select>
          </div>
        </div>
        <div class="toolbar">
          <button class="btn btn-primary" id="qr-run" type="button">Generate QR code</button>
          <button class="btn btn-ghost" id="qr-reset" type="button">Reset</button>
        </div>
        <div id="qr-error" class="alert alert-error" role="alert" hidden></div>
        <div id="qr-canvas-wrap" class="qr-canvas-wrap"></div>
        <div class="toolbar" id="qr-download-row" hidden>
          <button class="btn btn-ghost" id="qr-download" type="button">Download PNG</button>
        </div>
      </div>`,
    script: `
      (function(){
        let type = 'text';
        document.querySelectorAll('.tab-group .tab').forEach(t => t.addEventListener('click', function(){
          document.querySelectorAll('.tab-group .tab').forEach(x=>{x.classList.remove('active'); x.setAttribute('aria-selected','false');});
          this.classList.add('active'); this.setAttribute('aria-selected','true');
          type = this.dataset.type;
          const input = document.getElementById('qr-input');
          input.placeholder = type === 'email' ? 'name@example.com' : type === 'phone' ? '+1 555 123 4567' : 'https://example.com';
        }));
        document.getElementById('qr-run').addEventListener('click', function(){
          const errBox = document.getElementById('qr-error');
          const wrap = document.getElementById('qr-canvas-wrap');
          const raw = document.getElementById('qr-input').value.trim();
          if (!raw){ errBox.hidden=false; errBox.textContent='Enter some content first.'; wrap.innerHTML=''; document.getElementById('qr-download-row').hidden = true; return; }
          withLoading(this, 'Generating…', function(){
            return new Promise(function(resolve){
              setTimeout(function(){
                if (typeof QRCode === 'undefined'){
                  errBox.hidden = false;
                  errBox.textContent = 'The QR rendering library could not load (this usually means no internet connection). Please check your connection and try again.';
                  resolve(); return;
                }
                errBox.hidden = true;
                let content = raw;
                if (type === 'email') content = 'mailto:' + raw;
                if (type === 'phone') content = 'tel:' + raw;
                wrap.innerHTML = '';
                const size = parseInt(document.getElementById('qr-size').value, 10);
                const ecc = document.getElementById('qr-ecc').value;
                try {
                  new QRCode(wrap, { text: content, width: size, height: size, correctLevel: QRCode.CorrectLevel[ecc] });
                  document.getElementById('qr-download-row').hidden = false;
                } catch(e){
                  errBox.hidden = false; errBox.textContent = 'Could not generate a QR code for that input: ' + e.message;
                }
                resolve();
              }, 150);
            });
          });
        });
        document.getElementById('qr-reset').addEventListener('click', function(){
          document.getElementById('qr-input').value = '';
          document.getElementById('qr-canvas-wrap').innerHTML = '';
          document.getElementById('qr-download-row').hidden = true;
          document.getElementById('qr-error').hidden = true;
        });
        document.getElementById('qr-download').addEventListener('click', function(){
          const canvas = document.querySelector('#qr-canvas-wrap canvas');
          if (!canvas) return;
          const link = document.createElement('a');
          link.download = 'qr-code.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
        });
      })();`,
    howTo: ['Choose URL/Text, Email or Phone.', 'Enter the content.', 'Click Generate QR code, then download the PNG.'],
    faq: [
      { q: 'Does this tool upload my QR code content to a server?', a: 'No — the QR code is drawn directly in your browser using a local rendering library; the content you enter is not sent to any server.' },
      { q: 'Why does it need to load a library?', a: 'Rendering a correct, scannable QR code requires implementing the QR error-correction algorithm precisely, so this tool uses a small, well-established open-source library rather than reinventing that math.' }
    ]
  },
  {
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    category: 'misc-tools',
    description: 'Generate placeholder Lorem Ipsum text by paragraphs, sentences or words for use in mockups and designs.',
    keywords: ['lorem ipsum generator', 'placeholder text generator', 'dummy text generator'],
    related: ['word-counter', 'text-to-slug', 'random-string-generator'],
    html: `
      <div class="tool-panel">
        <div class="grid-3">
          <div><label class="field-label" for="li-unit">Generate</label>
            <select id="li-unit" class="select"><option value="paragraphs">Paragraphs</option><option value="sentences">Sentences</option><option value="words">Words</option></select>
          </div>
          <div><label class="field-label" for="li-count">Amount</label><input id="li-count" class="input" type="number" value="3" min="1" max="100"></div>
          <div><label class="field-label" for="li-startclassic">Start with</label>
            <select id="li-startclassic" class="select"><option value="yes">"Lorem ipsum dolor sit amet…"</option><option value="no">Random start</option></select>
          </div>
        </div>
        <div class="toolbar"><button class="btn btn-primary" id="li-run" type="button">Generate</button></div>
        <label class="field-label" for="li-output">Result</label>
        <textarea id="li-output" class="textarea" rows="10" readonly></textarea>
        <div class="toolbar"><button class="btn btn-ghost" id="li-copy" type="button">Copy result</button></div>
      </div>`,
    script: `
      (function(){
        const words = ('lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum').split(' ');
        function randWord(){ return words[Math.floor(Math.random()*words.length)]; }
        function sentence(minW, maxW){
          const len = minW + Math.floor(Math.random()*(maxW-minW));
          let arr = [];
          for (let i=0;i<len;i++) arr.push(randWord());
          arr[0] = arr[0].charAt(0).toUpperCase() + arr[0].slice(1);
          return arr.join(' ') + '.';
        }
        function paragraph(){
          const numSentences = 3 + Math.floor(Math.random()*4);
          let arr = [];
          for (let i=0;i<numSentences;i++) arr.push(sentence(6,16));
          return arr.join(' ');
        }
        document.getElementById('li-run').addEventListener('click', function(){
          const unit = document.getElementById('li-unit').value;
          const count = Math.min(100, Math.max(1, parseInt(document.getElementById('li-count').value,10) || 1));
          const classic = document.getElementById('li-startclassic').value === 'yes';
          let result = '';
          if (unit === 'paragraphs'){
            const paras = [];
            for (let i=0;i<count;i++) paras.push(paragraph());
            if (classic) paras[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + paras[0].split('. ').slice(1).join('. ');
            result = paras.join('\\n\\n');
          } else if (unit === 'sentences'){
            const sents = [];
            for (let i=0;i<count;i++) sents.push(sentence(6,16));
            if (classic) sents[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
            result = sents.join(' ');
          } else {
            let arr = [];
            for (let i=0;i<count;i++) arr.push(randWord());
            if (classic){ const prefix = 'lorem ipsum dolor sit amet'.split(' '); arr = prefix.concat(arr).slice(0,count); }
            arr[0] = arr[0].charAt(0).toUpperCase() + arr[0].slice(1);
            result = arr.join(' ') + '.';
          }
          document.getElementById('li-output').value = result;
        });
        document.getElementById('li-copy').addEventListener('click', function(){ copyToClipboard(document.getElementById('li-output').value, this); });
      })();`,
    howTo: ['Choose paragraphs, sentences or words and an amount.', 'Click Generate.', 'Copy the placeholder text into your design or mockup.'],
    faq: [{ q: 'Is this genuine classical Latin?', a: 'No — Lorem Ipsum is scrambled, non-meaningful pseudo-Latin traditionally used as placeholder text in design, derived loosely from a passage of Cicero.' }]
  },
  {
    slug: 'random-number-generator',
    name: 'Random Number Generator',
    category: 'misc-tools',
    description: 'Generate one or more random numbers within a custom range, with optional duplicate exclusion.',
    keywords: ['random number generator', 'random number between two numbers', 'number picker'],
    related: ['random-string-generator', 'uuid-generator', 'password-generator'],
    html: `
      <div class="tool-panel">
        <div class="grid-3">
          <div><label class="field-label" for="rn-min">Minimum</label><input id="rn-min" class="input" type="number" value="1"></div>
          <div><label class="field-label" for="rn-max">Maximum</label><input id="rn-max" class="input" type="number" value="100"></div>
          <div><label class="field-label" for="rn-qty">How many</label><input id="rn-qty" class="input" type="number" value="1" min="1" max="1000"></div>
        </div>
        <label class="check"><input type="checkbox" id="rn-unique"> No duplicates</label>
        <div class="toolbar">
          <button class="btn btn-primary" id="rn-run" type="button">Generate</button>
          <button class="btn btn-ghost" id="rn-reset" type="button">Reset</button>
        </div>
        <div id="rn-error" class="alert alert-error" role="alert" hidden></div>
        <label class="field-label" for="rn-output">Result</label>
        <textarea id="rn-output" class="textarea" rows="6" readonly></textarea>
        <div class="toolbar"><button class="btn btn-ghost" id="rn-copy" type="button">Copy result</button></div>
      </div>`,
    script: `
      (function(){
        function secureRandomInt(min, max){
          const range = max - min + 1;
          const arr = new Uint32Array(1);
          crypto.getRandomValues(arr);
          return min + (arr[0] % range);
        }
        document.getElementById('rn-run').addEventListener('click', function(){
          const min = parseInt(document.getElementById('rn-min').value, 10);
          const max = parseInt(document.getElementById('rn-max').value, 10);
          const qty = Math.min(1000, Math.max(1, parseInt(document.getElementById('rn-qty').value,10) || 1));
          const unique = document.getElementById('rn-unique').checked;
          const errBox = document.getElementById('rn-error');
          if (isNaN(min) || isNaN(max) || min > max){ errBox.hidden=false; errBox.textContent='Minimum must be less than or equal to maximum.'; return; }
          if (unique && (max-min+1) < qty){ errBox.hidden=false; errBox.textContent='The range is too small to generate ' + qty + ' unique numbers.'; return; }
          errBox.hidden = true;
          let results = [];
          if (unique){
            const pool = [];
            for (let i=min;i<=max;i++) pool.push(i);
            for (let i=0;i<qty;i++){
              const idx = secureRandomInt(0, pool.length-1);
              results.push(pool[idx]);
              pool.splice(idx,1);
            }
          } else {
            for (let i=0;i<qty;i++) results.push(secureRandomInt(min,max));
          }
          document.getElementById('rn-output').value = results.join(', ');
        });
        document.getElementById('rn-reset').addEventListener('click', function(){
          document.getElementById('rn-min').value='1'; document.getElementById('rn-max').value='100'; document.getElementById('rn-qty').value='1';
          document.getElementById('rn-unique').checked=false;
          document.getElementById('rn-output').value=''; document.getElementById('rn-error').hidden=true;
        });
        document.getElementById('rn-copy').addEventListener('click', function(){ copyToClipboard(document.getElementById('rn-output').value, this); });
      })();`,
    howTo: ['Set a minimum and maximum value and how many numbers you want.', 'Optionally exclude duplicates.', 'Click Generate.'],
    faq: [{ q: 'Is this fair/unbiased?', a: 'Numbers are drawn using the Web Crypto API’s secure random values with a rejection-free modulo approach suitable for typical ranges used in everyday random-number tasks.' }]
  },
  {
    slug: 'color-converter',
    name: 'Color Converter & Picker',
    category: 'misc-tools',
    description: 'Convert colors between HEX, RGB and HSL, or pick a color visually with a live preview.',
    keywords: ['color converter', 'hex to rgb', 'rgb to hsl', 'color picker online'],
    related: ['qr-code-generator', 'text-to-slug', 'lorem-ipsum-generator'],
    html: `
      <div class="tool-panel">
        <div class="color-picker-row">
          <input type="color" id="col-picker" class="color-swatch-input" value="#4f46e5">
          <div id="col-preview" class="color-preview" style="background:#4f46e5"></div>
        </div>
        <div class="grid-3">
          <div><label class="field-label" for="col-hex">HEX</label><input id="col-hex" class="input code" type="text" value="#4f46e5"></div>
          <div><label class="field-label" for="col-rgb">RGB</label><input id="col-rgb" class="input code" type="text" value="rgb(79, 70, 229)"></div>
          <div><label class="field-label" for="col-hsl">HSL</label><input id="col-hsl" class="input code" type="text" value="hsl(243, 75%, 59%)"></div>
        </div>
        <div id="col-error" class="alert alert-error" role="alert" hidden></div>
        <p class="hint">Edit any field (HEX, RGB or HSL) or use the color picker — the other fields update automatically.</p>
      </div>`,
    script: `
      (function(){
        const picker = document.getElementById('col-picker');
        const hexInput = document.getElementById('col-hex');
        const rgbInput = document.getElementById('col-rgb');
        const hslInput = document.getElementById('col-hsl');
        const preview = document.getElementById('col-preview');
        const errBox = document.getElementById('col-error');
        function hexToRgb(hex){
          const m = hex.replace('#','').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
          if (!m) return null;
          return [parseInt(m[1],16), parseInt(m[2],16), parseInt(m[3],16)];
        }
        function rgbToHex(r,g,b){ return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join(''); }
        function rgbToHsl(r,g,b){
          r/=255; g/=255; b/=255;
          const max=Math.max(r,g,b), min=Math.min(r,g,b);
          let h,s,l=(max+min)/2;
          if (max===min){ h=s=0; } else {
            const d = max-min;
            s = l>0.5 ? d/(2-max-min) : d/(max+min);
            switch(max){
              case r: h=(g-b)/d+(g<b?6:0); break;
              case g: h=(b-r)/d+2; break;
              default: h=(r-g)/d+4;
            }
            h/=6;
          }
          return [Math.round(h*360), Math.round(s*100), Math.round(l*100)];
        }
        function hslToRgb(h,s,l){
          h/=360; s/=100; l/=100;
          let r,g,b;
          if (s===0){ r=g=b=l; } else {
            const hue2rgb = (p,q,t) => { if(t<0)t+=1; if(t>1)t-=1; if(t<1/6)return p+(q-p)*6*t; if(t<1/2)return q; if(t<2/3)return p+(q-p)*(2/3-t)*6; return p; };
            const q = l<0.5 ? l*(1+s) : l+s-l*s;
            const p = 2*l-q;
            r = hue2rgb(p,q,h+1/3); g = hue2rgb(p,q,h); b = hue2rgb(p,q,h-1/3);
          }
          return [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
        }
        function applyRgb(r,g,b,skip){
          errBox.hidden = true;
          const hex = rgbToHex(r,g,b);
          const [h,s,l] = rgbToHsl(r,g,b);
          if (skip !== 'hex') hexInput.value = hex;
          if (skip !== 'rgb') rgbInput.value = 'rgb(' + r + ', ' + g + ', ' + b + ')';
          if (skip !== 'hsl') hslInput.value = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
          if (skip !== 'picker') picker.value = hex;
          preview.style.background = hex;
        }
        picker.addEventListener('input', function(){
          const rgb = hexToRgb(this.value);
          if (rgb) applyRgb(rgb[0], rgb[1], rgb[2], 'picker');
        });
        hexInput.addEventListener('input', function(){
          const rgb = hexToRgb(this.value);
          if (!rgb){ errBox.hidden=false; errBox.textContent='Enter a valid hex color like #4f46e5.'; return; }
          applyRgb(rgb[0], rgb[1], rgb[2], 'hex');
        });
        rgbInput.addEventListener('input', function(){
          const m = this.value.match(/(\\d+)[,\\s]+(\\d+)[,\\s]+(\\d+)/);
          if (!m){ errBox.hidden=false; errBox.textContent='Enter a valid RGB value like rgb(79, 70, 229).'; return; }
          const [r,g,b] = [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
          if ([r,g,b].some(v => v<0||v>255)){ errBox.hidden=false; errBox.textContent='RGB values must be between 0 and 255.'; return; }
          applyRgb(r,g,b,'rgb');
        });
        hslInput.addEventListener('input', function(){
          const m = this.value.match(/(\\d+)[,\\s]+(\\d+)%[,\\s]+(\\d+)%/);
          if (!m){ errBox.hidden=false; errBox.textContent='Enter a valid HSL value like hsl(243, 75%, 59%).'; return; }
          const [rgb] = [hslToRgb(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]))];
          applyRgb(rgb[0], rgb[1], rgb[2], 'hsl');
        });
      })();`,
    howTo: ['Use the color swatch to pick a color visually, or type directly into the HEX, RGB or HSL field.', 'All formats sync automatically.', 'Copy whichever format you need.'],
    faq: [{ q: 'Which color formats are supported?', a: 'HEX (#rrggbb), RGB (rgb(r, g, b)) and HSL (hsl(h, s%, l%)) — the three most common formats used in CSS and design tools.' }]
  },
  {
    slug: 'text-to-slug',
    name: 'Text to Slug Generator',
    category: 'misc-tools',
    description: 'Convert any text into a clean, URL-friendly slug for blog posts, product pages or file names.',
    keywords: ['text to slug', 'slug generator', 'url slug converter', 'seo friendly url generator'],
    related: ['case-converter', 'meta-tag-generator', 'lorem-ipsum-generator'],
    html: `
      <div class="tool-panel">
        <label class="field-label" for="slug-input">Your text</label>
        <input id="slug-input" class="input" type="text" placeholder="10 Best Free Online Tools for 2026!">
        <div class="grid-2">
          <div><label class="field-label" for="slug-separator">Separator</label>
            <select id="slug-separator" class="select"><option value="-">Hyphen (-)</option><option value="_">Underscore (_)</option></select>
          </div>
          <div><label class="field-label" for="slug-case">Case</label>
            <select id="slug-case" class="select"><option value="lower">lowercase</option><option value="keep">Keep original case</option></select>
          </div>
        </div>
        <label class="field-label" for="slug-output">Slug</label>
        <input id="slug-output" class="input code" type="text" readonly>
        <div class="toolbar"><button class="btn btn-ghost" id="slug-copy" type="button">Copy slug</button></div>
      </div>`,
    script: `
      (function(){
        function slugify(text, sep, caseMode){
          let s = text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
          if (caseMode === 'lower') s = s.toLowerCase();
          s = s.replace(/[^a-zA-Z0-9]+/g, sep).replace(new RegExp('^\\\\' + sep + '+|\\\\' + sep + '+$','g'), '');
          return s;
        }
        function update(){
          const text = document.getElementById('slug-input').value;
          const sep = document.getElementById('slug-separator').value;
          const caseMode = document.getElementById('slug-case').value;
          document.getElementById('slug-output').value = text ? slugify(text, sep, caseMode) : '';
        }
        ['slug-input','slug-separator','slug-case'].forEach(id => document.getElementById(id).addEventListener('input', update));
        document.getElementById('slug-copy').addEventListener('click', function(){ copyToClipboard(document.getElementById('slug-output').value, this); });
      })();`,
    howTo: ['Type or paste your text.', 'Choose a separator and case option.', 'The URL-friendly slug updates instantly — copy it for use in a URL.'],
    faq: [{ q: 'How are accented characters handled?', a: 'Accented characters are normalized to their closest plain-ASCII equivalent (e.g. é → e) before slugifying, which keeps URLs clean and widely compatible.' }]
  }
];
