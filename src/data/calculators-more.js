module.exports = [
  {
    slug: 'percentage-change-calculator',
    name: 'Percentage Change Calculator',
    category: 'calculators',
    description: 'Calculate the percentage increase or decrease between an old value and a new value.',
    keywords: ['percentage change calculator', 'percent increase or decrease'],
    related: ['percentage-calculator', 'average-calculator', 'ratio-calculator'],
    html: `
      <div class="tool-panel">
        <div class="grid-2">
          <div><label class="field-label" for="pch-old">Old value</label><input id="pch-old" class="input" type="number" placeholder="50"></div>
          <div><label class="field-label" for="pch-new">New value</label><input id="pch-new" class="input" type="number" placeholder="65"></div>
        </div>
        <div class="toolbar">
          <button class="btn btn-primary" id="pch-run" type="button">Calculate</button>
          <button class="btn btn-ghost" id="pch-reset" type="button">Reset</button>
        </div>
        <div id="pch-error" class="alert alert-error" role="alert" hidden></div>
        <div class="result-box" id="pch-result" hidden></div>
      </div>`,
    script: `
      (function(){
        document.getElementById('pch-run').addEventListener('click', function(){
          const o = parseFloat(document.getElementById('pch-old').value);
          const n = parseFloat(document.getElementById('pch-new').value);
          const errBox = document.getElementById('pch-error');
          if (isNaN(o) || isNaN(n) || o === 0){ errBox.hidden=false; errBox.textContent='Enter both values (old value cannot be 0).'; document.getElementById('pch-result').hidden=true; return; }
          errBox.hidden = true;
          const change = ((n-o)/Math.abs(o))*100;
          const box = document.getElementById('pch-result');
          box.hidden = false;
          box.innerHTML = '<strong>' + (change>=0 ? 'Increase' : 'Decrease') + ' of ' + Math.abs(change).toFixed(2) + '%</strong>';
        });
        document.getElementById('pch-reset').addEventListener('click', function(){
          document.getElementById('pch-old').value=''; document.getElementById('pch-new').value='';
          document.getElementById('pch-result').hidden = true; document.getElementById('pch-error').hidden = true;
        });
      })();`,
    howTo: ['Enter the old and new values.', 'Click Calculate.', 'Result shows whether it’s an increase or decrease, and by how much.'],
    faq: [{ q: 'Formula?', a: 'Percentage change = ((new − old) ÷ |old|) × 100.' }]
  },
  {
    slug: 'average-calculator',
    name: 'Average Calculator',
    category: 'calculators',
    description: 'Calculate the mean, median, mode and range of a list of numbers.',
    keywords: ['average calculator', 'mean median mode calculator'],
    related: ['percentage-calculator', 'ratio-calculator', 'percentage-change-calculator'],
    html: `
      <div class="tool-panel">
        <label class="field-label" for="avg-input">Numbers (comma or line separated)</label>
        <textarea id="avg-input" class="textarea" rows="5" placeholder="4, 8, 15, 16, 23, 42"></textarea>
        <div class="toolbar">
          <button class="btn btn-primary" id="avg-run" type="button">Calculate</button>
          <button class="btn btn-ghost" id="avg-reset" type="button">Reset</button>
        </div>
        <div id="avg-error" class="alert alert-error" role="alert" hidden></div>
        <div class="stats-grid" id="avg-result" hidden>
          <div class="stat"><span class="stat-value" id="avg-mean">—</span><span class="stat-label">Mean (average)</span></div>
          <div class="stat"><span class="stat-value" id="avg-median">—</span><span class="stat-label">Median</span></div>
          <div class="stat"><span class="stat-value" id="avg-mode">—</span><span class="stat-label">Mode</span></div>
          <div class="stat"><span class="stat-value" id="avg-range">—</span><span class="stat-label">Range</span></div>
          <div class="stat"><span class="stat-value" id="avg-count">—</span><span class="stat-label">Count</span></div>
          <div class="stat"><span class="stat-value" id="avg-sum">—</span><span class="stat-label">Sum</span></div>
        </div>
      </div>`,
    script: `
      (function(){
        document.getElementById('avg-run').addEventListener('click', function(){
          const raw = document.getElementById('avg-input').value;
          const nums = raw.split(/[\\n,]+/).map(s => s.trim()).filter(Boolean).map(Number);
          const errBox = document.getElementById('avg-error');
          if (!nums.length || nums.some(isNaN)){ errBox.hidden=false; errBox.textContent='Enter a valid list of numbers, separated by commas or new lines.'; document.getElementById('avg-result').hidden=true; return; }
          errBox.hidden = true;
          const sum = nums.reduce((a,b)=>a+b,0);
          const mean = sum / nums.length;
          const sorted = [...nums].sort((a,b)=>a-b);
          const mid = Math.floor(sorted.length/2);
          const median = sorted.length % 2 ? sorted[mid] : (sorted[mid-1]+sorted[mid])/2;
          const freq = {};
          nums.forEach(n => freq[n] = (freq[n]||0)+1);
          const maxFreq = Math.max(...Object.values(freq));
          const modes = Object.keys(freq).filter(k => freq[k] === maxFreq);
          const mode = maxFreq === 1 ? 'No mode' : modes.join(', ');
          const range = Math.max(...nums) - Math.min(...nums);
          document.getElementById('avg-mean').textContent = mean.toLocaleString(undefined,{maximumFractionDigits:4});
          document.getElementById('avg-median').textContent = median.toLocaleString(undefined,{maximumFractionDigits:4});
          document.getElementById('avg-mode').textContent = mode;
          document.getElementById('avg-range').textContent = range.toLocaleString(undefined,{maximumFractionDigits:4});
          document.getElementById('avg-count').textContent = nums.length;
          document.getElementById('avg-sum').textContent = sum.toLocaleString(undefined,{maximumFractionDigits:4});
          document.getElementById('avg-result').hidden = false;
        });
        document.getElementById('avg-reset').addEventListener('click', function(){
          document.getElementById('avg-input').value='';
          document.getElementById('avg-result').hidden = true; document.getElementById('avg-error').hidden = true;
        });
      })();`,
    howTo: ['Enter a list of numbers separated by commas or line breaks.', 'Click Calculate.', 'See the mean, median, mode, range, count and sum.'],
    faq: [{ q: 'What if all numbers appear the same number of times?', a: 'When no value repeats more than any other, there is no meaningful mode, so the tool reports "No mode".' }]
  },
  {
    slug: 'ratio-calculator',
    name: 'Ratio Calculator',
    category: 'calculators',
    description: 'Simplify ratios to their lowest terms, or scale a ratio to match a target value.',
    keywords: ['ratio calculator', 'simplify ratio', 'ratio to fraction'],
    related: ['percentage-calculator', 'average-calculator', 'length-converter'],
    html: `
      <div class="tool-panel">
        <div class="grid-2">
          <div><label class="field-label" for="ratio-a">Value A</label><input id="ratio-a" class="input" type="number" placeholder="16"></div>
          <div><label class="field-label" for="ratio-b">Value B</label><input id="ratio-b" class="input" type="number" placeholder="9"></div>
        </div>
        <div class="toolbar">
          <button class="btn btn-primary" id="ratio-run" type="button">Simplify</button>
          <button class="btn btn-ghost" id="ratio-reset" type="button">Reset</button>
        </div>
        <div id="ratio-error" class="alert alert-error" role="alert" hidden></div>
        <div class="result-box" id="ratio-result" hidden></div>
      </div>`,
    script: `
      (function(){
        function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b, a%b]; } return a || 1; }
        document.getElementById('ratio-run').addEventListener('click', function(){
          const a = parseFloat(document.getElementById('ratio-a').value);
          const b = parseFloat(document.getElementById('ratio-b').value);
          const errBox = document.getElementById('ratio-error');
          if (isNaN(a) || isNaN(b) || a===0 || b===0){ errBox.hidden=false; errBox.textContent='Enter two non-zero numbers.'; document.getElementById('ratio-result').hidden=true; return; }
          errBox.hidden = true;
          let ia = a, ib = b, scale = 1;
          if (!Number.isInteger(a) || !Number.isInteger(b)){
            const decimals = Math.max((String(a).split('.')[1]||'').length, (String(b).split('.')[1]||'').length);
            scale = Math.pow(10, decimals);
            ia = Math.round(a*scale); ib = Math.round(b*scale);
          }
          const g = gcd(ia, ib);
          const box = document.getElementById('ratio-result');
          box.hidden = false;
          box.innerHTML = '<strong>Simplified ratio: ' + (ia/g) + ' : ' + (ib/g) + '</strong><br>Decimal equivalent: ' + (a/b).toFixed(4);
        });
        document.getElementById('ratio-reset').addEventListener('click', function(){
          document.getElementById('ratio-a').value=''; document.getElementById('ratio-b').value='';
          document.getElementById('ratio-result').hidden = true; document.getElementById('ratio-error').hidden = true;
        });
      })();`,
    howTo: ['Enter values A and B.', 'Click Simplify.', 'See the ratio reduced to its lowest whole-number terms.'],
    faq: [{ q: 'Does this work with decimal inputs?', a: 'Yes — decimal values are scaled to whole numbers first, then simplified using the greatest common divisor.' }]
  },
  {
    slug: 'time-duration-calculator',
    name: 'Time Duration Calculator',
    category: 'calculators',
    description: 'Calculate the duration between two times, or add/subtract hours and minutes from a time.',
    keywords: ['time duration calculator', 'hours between two times', 'time difference calculator'],
    related: ['date-difference-calculator', 'age-calculator', 'countdown-calculator'],
    html: `
      <div class="tool-panel">
        <div class="grid-2">
          <div><label class="field-label" for="td-start">Start time</label><input id="td-start" class="input" type="time"></div>
          <div><label class="field-label" for="td-end">End time</label><input id="td-end" class="input" type="time"></div>
        </div>
        <label class="check"><input type="checkbox" id="td-overnight"> End time is on the next day</label>
        <div class="toolbar">
          <button class="btn btn-primary" id="td-run" type="button">Calculate duration</button>
          <button class="btn btn-ghost" id="td-reset" type="button">Reset</button>
        </div>
        <div id="td-error" class="alert alert-error" role="alert" hidden></div>
        <div class="result-box" id="td-result" hidden></div>
      </div>`,
    script: `
      (function(){
        document.getElementById('td-run').addEventListener('click', function(){
          const start = document.getElementById('td-start').value;
          const end = document.getElementById('td-end').value;
          const overnight = document.getElementById('td-overnight').checked;
          const errBox = document.getElementById('td-error');
          if (!start || !end){ errBox.hidden=false; errBox.textContent='Enter both a start and end time.'; document.getElementById('td-result').hidden=true; return; }
          const [sh, sm] = start.split(':').map(Number);
          const [eh, em] = end.split(':').map(Number);
          let startMin = sh*60+sm, endMin = eh*60+em + (overnight ? 1440 : 0);
          if (endMin < startMin){ errBox.hidden=false; errBox.textContent='End time must be after start time (or tick "next day").'; document.getElementById('td-result').hidden=true; return; }
          errBox.hidden = true;
          const diff = endMin - startMin;
          const h = Math.floor(diff/60), m = diff%60;
          const box = document.getElementById('td-result');
          box.hidden = false;
          box.innerHTML = '<strong>Duration: ' + h + ' hour' + (h===1?'':'s') + ' ' + m + ' minute' + (m===1?'':'s') + '</strong> (' + diff + ' minutes total)';
        });
        document.getElementById('td-reset').addEventListener('click', function(){
          document.getElementById('td-start').value=''; document.getElementById('td-end').value=''; document.getElementById('td-overnight').checked=false;
          document.getElementById('td-result').hidden = true; document.getElementById('td-error').hidden = true;
        });
      })();`,
    howTo: ['Enter a start and end time.', 'Tick the box if the end time falls on the next day.', 'Click Calculate duration.'],
    faq: [{ q: 'Can I calculate a shift that crosses midnight?', a: 'Yes — tick "End time is on the next day" and the calculator will add 24 hours before computing the difference.' }]
  }
];
