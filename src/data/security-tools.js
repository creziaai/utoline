module.exports = [
  {
    slug: 'password-generator',
    name: 'Password Generator',
    category: 'security-tools',
    description: 'Generate strong, random passwords using your browser’s cryptographically secure random number generator. Nothing is stored or transmitted.',
    keywords: ['password generator', 'strong password generator', 'random password generator'],
    related: ['password-strength-checker', 'random-string-generator', 'hash-generator'],
    html: `
      <div class="tool-panel">
        <p class="hint">Passwords are generated locally in your browser and are never sent anywhere or stored.</p>
        <label class="field-label" for="pw-length">Length: <span id="pw-length-value">16</span></label>
        <input id="pw-length" type="range" min="6" max="64" value="16" class="range">
        <div class="toolbar toolbar-wrap">
          <label class="check"><input type="checkbox" id="pw-upper" checked> Uppercase (A-Z)</label>
          <label class="check"><input type="checkbox" id="pw-lower" checked> Lowercase (a-z)</label>
          <label class="check"><input type="checkbox" id="pw-numbers" checked> Numbers (0-9)</label>
          <label class="check"><input type="checkbox" id="pw-symbols" checked> Symbols (!@#$…)</label>
          <label class="check"><input type="checkbox" id="pw-ambiguous"> Exclude ambiguous characters (l, 1, I, O, 0)</label>
        </div>
        <div class="toolbar">
          <button class="btn btn-primary" id="pw-run" type="button">Generate password</button>
        </div>
        <div id="pw-error" class="alert alert-error" role="alert" hidden></div>
        <label class="field-label" for="pw-output">Generated password</label>
        <input id="pw-output" class="input code" type="text" readonly aria-label="Generated password">
        <div class="toolbar"><button class="btn btn-ghost" id="pw-copy" type="button">Copy password</button></div>
      </div>`,
    script: `
      (function(){
        const lengthInput = document.getElementById('pw-length');
        const lengthValue = document.getElementById('pw-length-value');
        lengthInput.addEventListener('input', () => lengthValue.textContent = lengthInput.value);
        function secureRandomInt(max){
          const arr = new Uint32Array(1);
          crypto.getRandomValues(arr);
          return arr[0] % max;
        }
        document.getElementById('pw-run').addEventListener('click', function(){
          const len = parseInt(lengthInput.value, 10);
          const useUpper = document.getElementById('pw-upper').checked;
          const useLower = document.getElementById('pw-lower').checked;
          const useNumbers = document.getElementById('pw-numbers').checked;
          const useSymbols = document.getElementById('pw-symbols').checked;
          const excludeAmbiguous = document.getElementById('pw-ambiguous').checked;
          const errBox = document.getElementById('pw-error');
          let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lower = 'abcdefghijklmnopqrstuvwxyz', numbers = '0123456789', symbols = '!@#$%^&*()-_=+[]{};:,.<>?';
          if (excludeAmbiguous){ upper = upper.replace(/[IO]/g,''); lower = lower.replace(/[l]/g,''); numbers = numbers.replace(/[01]/g,''); }
          let pool = '';
          if (useUpper) pool += upper;
          if (useLower) pool += lower;
          if (useNumbers) pool += numbers;
          if (useSymbols) pool += symbols;
          if (!pool){ errBox.hidden=false; errBox.textContent='Select at least one character type.'; return; }
          errBox.hidden = true;
          let pw = '';
          for (let i=0;i<len;i++) pw += pool[secureRandomInt(pool.length)];
          document.getElementById('pw-output').value = pw;
        });
        document.getElementById('pw-copy').addEventListener('click', function(){ copyToClipboard(document.getElementById('pw-output').value, this); });
      })();`,
    howTo: ['Choose a length and character types.', 'Click Generate password.', 'Copy it directly — it is never saved or sent anywhere.'],
    faq: [
      { q: 'Is this random number generator secure?', a: 'Yes. It uses the Web Crypto API (crypto.getRandomValues), the same cryptographically secure source used for security-sensitive browser operations, not Math.random().' },
      { q: 'Does the site store generated passwords?', a: 'No. Passwords exist only in your browser’s memory while the page is open and are discarded when you navigate away or refresh.' }
    ]
  },
  {
    slug: 'password-strength-checker',
    name: 'Password Strength Checker',
    category: 'security-tools',
    description: 'Check how strong a password is, entirely on your device — the password is never transmitted or stored.',
    keywords: ['password strength checker', 'check password strength online', 'password security test'],
    related: ['password-generator', 'random-string-generator', 'hash-generator'],
    html: `
      <div class="tool-panel">
        <p class="hint"><strong>Privacy note:</strong> your password is analyzed entirely in this browser tab using local JavaScript. It is never sent to a server, logged, or stored.</p>
        <label class="field-label" for="ps-input">Enter a password to check</label>
        <div class="password-row">
          <input id="ps-input" class="input code" type="password" autocomplete="off" aria-label="Password to check">
          <button class="btn btn-ghost" id="ps-toggle" type="button">Show</button>
        </div>
        <div class="strength-meter" aria-live="polite">
          <div class="strength-bar" id="ps-bar"></div>
        </div>
        <p class="strength-label" id="ps-label">Enter a password above</p>
        <ul class="checklist" id="ps-checklist"></ul>
      </div>`,
    script: `
      (function(){
        const input = document.getElementById('ps-input');
        const toggle = document.getElementById('ps-toggle');
        toggle.addEventListener('click', function(){
          const isPw = input.type === 'password';
          input.type = isPw ? 'text' : 'password';
          this.textContent = isPw ? 'Hide' : 'Show';
        });
        const checks = [
          { label: 'At least 8 characters', test: v => v.length >= 8 },
          { label: 'At least 12 characters (recommended)', test: v => v.length >= 12 },
          { label: 'Contains uppercase letter', test: v => /[A-Z]/.test(v) },
          { label: 'Contains lowercase letter', test: v => /[a-z]/.test(v) },
          { label: 'Contains a number', test: v => /[0-9]/.test(v) },
          { label: 'Contains a symbol', test: v => /[^A-Za-z0-9]/.test(v) },
          { label: 'Not a common password', test: v => !['password','123456','123456789','qwerty','111111','12345678','abc123','password1','iloveyou','admin'].includes(v.toLowerCase()) }
        ];
        function update(){
          const v = input.value;
          const list = document.getElementById('ps-checklist');
          const bar = document.getElementById('ps-bar');
          const label = document.getElementById('ps-label');
          if (!v){ list.innerHTML=''; bar.style.width='0%'; bar.className='strength-bar'; label.textContent='Enter a password above'; return; }
          let passed = 0;
          list.innerHTML = checks.map(c => {
            const ok = c.test(v); if (ok) passed++;
            return '<li class="' + (ok ? 'pass' : 'fail') + '">' + (ok ? '✓' : '✕') + ' ' + c.label + '</li>';
          }).join('');
          const pct = Math.round((passed/checks.length)*100);
          bar.style.width = pct + '%';
          let level, cls;
          if (passed <= 2){ level='Weak'; cls='weak'; }
          else if (passed <= 4){ level='Fair'; cls='fair'; }
          else if (passed <= 6){ level='Good'; cls='good'; }
          else { level='Strong'; cls='strong'; }
          bar.className = 'strength-bar ' + cls;
          label.textContent = 'Strength: ' + level;
        }
        input.addEventListener('input', update);
      })();`,
    howTo: ['Type the password you want to check into the box.', 'The strength meter and checklist update instantly.', 'Nothing you type here is ever sent anywhere.'],
    faq: [{ q: 'Should I check my real password on any website?', a: 'Be cautious about entering real passwords on any site. This tool runs the check entirely in your browser with no network request, but as a general rule, prefer changing a password rather than repeatedly testing it online.' }]
  },
  {
    slug: 'random-string-generator',
    name: 'Random String Generator',
    category: 'security-tools',
    description: 'Generate random alphanumeric strings for tokens, test data or unique identifiers.',
    keywords: ['random string generator', 'random token generator', 'random alphanumeric generator'],
    related: ['password-generator', 'uuid-generator', 'hash-generator'],
    html: `
      <div class="tool-panel">
        <label class="field-label" for="rs-length">Length: <span id="rs-length-value">20</span></label>
        <input id="rs-length" type="range" min="1" max="256" value="20" class="range">
        <div class="grid-2">
          <div><label class="field-label" for="rs-qty">Quantity</label><input id="rs-qty" class="input" type="number" value="1" min="1" max="500"></div>
          <div><label class="field-label" for="rs-charset">Character set</label>
            <select id="rs-charset" class="select">
              <option value="alnum">Letters + numbers</option>
              <option value="alpha">Letters only</option>
              <option value="numeric">Numbers only</option>
              <option value="hex">Hexadecimal</option>
              <option value="all">Letters + numbers + symbols</option>
            </select>
          </div>
        </div>
        <div class="toolbar"><button class="btn btn-primary" id="rs-run" type="button">Generate</button></div>
        <label class="field-label" for="rs-output">Result</label>
        <textarea id="rs-output" class="textarea code" rows="8" readonly></textarea>
        <div class="toolbar"><button class="btn btn-ghost" id="rs-copy" type="button">Copy all</button></div>
      </div>`,
    script: `
      (function(){
        const lengthInput = document.getElementById('rs-length');
        document.getElementById('rs-length-value').textContent = lengthInput.value;
        lengthInput.addEventListener('input', () => document.getElementById('rs-length-value').textContent = lengthInput.value);
        function secureRandomInt(max){ const arr = new Uint32Array(1); crypto.getRandomValues(arr); return arr[0] % max; }
        const sets = {
          alnum: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
          alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
          numeric: '0123456789',
          hex: '0123456789abcdef',
          all: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+'
        };
        document.getElementById('rs-run').addEventListener('click', function(){
          const len = parseInt(lengthInput.value, 10);
          const qty = Math.min(500, Math.max(1, parseInt(document.getElementById('rs-qty').value,10) || 1));
          const pool = sets[document.getElementById('rs-charset').value];
          const results = [];
          for (let i=0;i<qty;i++){
            let s = '';
            for (let j=0;j<len;j++) s += pool[secureRandomInt(pool.length)];
            results.push(s);
          }
          document.getElementById('rs-output').value = results.join('\\n');
        });
        document.getElementById('rs-copy').addEventListener('click', function(){ copyToClipboard(document.getElementById('rs-output').value, this); });
      })();`,
    howTo: ['Set the string length, quantity and character set.', 'Click Generate.', 'Copy the results for use as tokens or test data.'],
    faq: [{ q: 'Is this suitable for generating security tokens?', a: 'Yes — it uses the Web Crypto API’s cryptographically secure random number generator, suitable for tokens, though for passwords specifically the Password Generator tool includes symbol and ambiguous-character handling tailored for that use.' }]
  }
];
