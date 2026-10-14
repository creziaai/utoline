module.exports = [
  {
    slug: 'date-difference-calculator',
    name: 'Date Difference Calculator',
    category: 'datetime-tools',
    description: 'Calculate the exact number of days, weeks, months and years between two dates.',
    keywords: ['date difference calculator', 'days between dates', 'date calculator'],
    related: ['age-calculator', 'add-subtract-days', 'countdown-calculator'],
    html: `
      <div class="tool-panel">
        <div class="grid-2">
          <div><label class="field-label" for="dd-start">Start date</label><input id="dd-start" class="input" type="date"></div>
          <div><label class="field-label" for="dd-end">End date</label><input id="dd-end" class="input" type="date"></div>
        </div>
        <div class="toolbar">
          <button class="btn btn-primary" id="dd-run" type="button">Calculate difference</button>
          <button class="btn btn-ghost" id="dd-reset" type="button">Reset</button>
        </div>
        <div id="dd-error" class="alert alert-error" role="alert" hidden></div>
        <div class="stats-grid" id="dd-result" hidden>
          <div class="stat"><span class="stat-value" id="dd-days">—</span><span class="stat-label">Total days</span></div>
          <div class="stat"><span class="stat-value" id="dd-weeks">—</span><span class="stat-label">Weeks</span></div>
          <div class="stat"><span class="stat-value" id="dd-ymd">—</span><span class="stat-label">Years, months, days</span></div>
        </div>
      </div>`,
    script: `
      (function(){
        document.getElementById('dd-run').addEventListener('click', function(){
          const s = document.getElementById('dd-start').value;
          const e = document.getElementById('dd-end').value;
          const errBox = document.getElementById('dd-error');
          if (!s || !e){ errBox.hidden=false; errBox.textContent='Choose both a start and end date.'; document.getElementById('dd-result').hidden=true; return; }
          let start = new Date(s+'T00:00:00'), end = new Date(e+'T00:00:00');
          if (end < start) [start, end] = [end, start];
          errBox.hidden = true;
          const totalDays = Math.round((end-start)/86400000);
          let years = end.getFullYear()-start.getFullYear();
          let months = end.getMonth()-start.getMonth();
          let days = end.getDate()-start.getDate();
          if (days < 0){ months--; days += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); }
          if (months < 0){ years--; months += 12; }
          document.getElementById('dd-days').textContent = totalDays.toLocaleString();
          document.getElementById('dd-weeks').textContent = (totalDays/7).toFixed(1);
          document.getElementById('dd-ymd').textContent = years+'y '+months+'m '+days+'d';
          document.getElementById('dd-result').hidden = false;
        });
        document.getElementById('dd-reset').addEventListener('click', function(){
          document.getElementById('dd-start').value=''; document.getElementById('dd-end').value='';
          document.getElementById('dd-result').hidden = true; document.getElementById('dd-error').hidden = true;
        });
      })();`,
    howTo: ['Choose a start date and an end date.', 'Click Calculate difference.', 'See the gap expressed in days, weeks, and years/months/days.'],
    faq: [{ q: 'What if I enter the end date before the start date?', a: 'The tool automatically swaps them so the result is always a positive duration.' }]
  },
  {
    slug: 'add-subtract-days',
    name: 'Add / Subtract Days from Date',
    category: 'datetime-tools',
    description: 'Add or subtract a number of days, weeks or months from a date to find the resulting date.',
    keywords: ['add days to date', 'subtract days from date', 'date calculator add'],
    related: ['date-difference-calculator', 'countdown-calculator', 'age-calculator'],
    html: `
      <div class="tool-panel">
        <div class="grid-2">
          <div><label class="field-label" for="asd-date">Start date</label><input id="asd-date" class="input" type="date"></div>
          <div><label class="field-label" for="asd-amount">Amount</label><input id="asd-amount" class="input" type="number" placeholder="30"></div>
        </div>
        <div class="toolbar toolbar-wrap">
          <label class="check"><input type="radio" name="asd-unit" value="days" checked> Days</label>
          <label class="check"><input type="radio" name="asd-unit" value="weeks"> Weeks</label>
          <label class="check"><input type="radio" name="asd-unit" value="months"> Months</label>
          <label class="check"><input type="radio" name="asd-op" value="add" checked style="display:none"></label>
        </div>
        <div class="toolbar">
          <button class="btn btn-primary" id="asd-add" type="button">Add</button>
          <button class="btn btn-primary" id="asd-subtract" type="button">Subtract</button>
          <button class="btn btn-ghost" id="asd-reset" type="button">Reset</button>
        </div>
        <div id="asd-error" class="alert alert-error" role="alert" hidden></div>
        <div class="result-box" id="asd-result" hidden></div>
      </div>`,
    script: `
      (function(){
        function run(sign){
          const dateVal = document.getElementById('asd-date').value;
          const amount = parseFloat(document.getElementById('asd-amount').value);
          const unit = document.querySelector('input[name=asd-unit]:checked').value;
          const errBox = document.getElementById('asd-error');
          if (!dateVal || isNaN(amount)){ errBox.hidden=false; errBox.textContent='Choose a date and enter an amount.'; document.getElementById('asd-result').hidden=true; return; }
          errBox.hidden = true;
          const d = new Date(dateVal+'T00:00:00');
          const n = sign * amount;
          if (unit === 'days') d.setDate(d.getDate()+n);
          else if (unit === 'weeks') d.setDate(d.getDate()+n*7);
          else d.setMonth(d.getMonth()+n);
          const box = document.getElementById('asd-result');
          box.hidden = false;
          box.innerHTML = '<strong>Result: ' + d.toLocaleDateString(undefined, {weekday:'long', year:'numeric', month:'long', day:'numeric'}) + '</strong>';
        }
        document.getElementById('asd-add').addEventListener('click', () => run(1));
        document.getElementById('asd-subtract').addEventListener('click', () => run(-1));
        document.getElementById('asd-reset').addEventListener('click', function(){
          document.getElementById('asd-date').value=''; document.getElementById('asd-amount').value='';
          document.getElementById('asd-result').hidden = true; document.getElementById('asd-error').hidden = true;
        });
      })();`,
    howTo: ['Choose a starting date and an amount.', 'Choose the unit (days, weeks or months).', 'Click Add or Subtract to see the resulting date.'],
    faq: [{ q: 'How are months handled near month-end dates?', a: 'Adding or subtracting months uses JavaScript’s native date rollover — if the resulting day doesn’t exist in the target month, the date rolls into the following month, matching typical calendar-arithmetic behavior.' }]
  },
  {
    slug: 'countdown-calculator',
    name: 'Countdown Calculator',
    category: 'datetime-tools',
    description: 'See exactly how much time is left until any future date and time, updated live.',
    keywords: ['countdown calculator', 'days until date', 'time until countdown'],
    related: ['date-difference-calculator', 'age-calculator', 'timezone-converter'],
    html: `
      <div class="tool-panel">
        <label class="field-label" for="cd-target">Target date &amp; time</label>
        <input id="cd-target" class="input" type="datetime-local">
        <div class="toolbar">
          <button class="btn btn-primary" id="cd-run" type="button">Start countdown</button>
          <button class="btn btn-ghost" id="cd-reset" type="button">Reset</button>
        </div>
        <div id="cd-error" class="alert alert-error" role="alert" hidden></div>
        <div class="stats-grid" id="cd-result" hidden aria-live="polite">
          <div class="stat"><span class="stat-value" id="cd-days">—</span><span class="stat-label">Days</span></div>
          <div class="stat"><span class="stat-value" id="cd-hours">—</span><span class="stat-label">Hours</span></div>
          <div class="stat"><span class="stat-value" id="cd-mins">—</span><span class="stat-label">Minutes</span></div>
          <div class="stat"><span class="stat-value" id="cd-secs">—</span><span class="stat-label">Seconds</span></div>
        </div>
      </div>`,
    script: `
      (function(){
        let timer = null;
        function tick(target){
          const now = new Date();
          const diff = target - now;
          const resBox = document.getElementById('cd-result');
          const errBox = document.getElementById('cd-error');
          if (diff <= 0){
            clearInterval(timer);
            errBox.hidden = false; errBox.textContent = 'That moment has already arrived.';
            resBox.hidden = true;
            return;
          }
          errBox.hidden = true;
          resBox.hidden = false;
          document.getElementById('cd-days').textContent = Math.floor(diff/86400000);
          document.getElementById('cd-hours').textContent = Math.floor((diff/3600000)%24);
          document.getElementById('cd-mins').textContent = Math.floor((diff/60000)%60);
          document.getElementById('cd-secs').textContent = Math.floor((diff/1000)%60);
        }
        document.getElementById('cd-run').addEventListener('click', function(){
          const val = document.getElementById('cd-target').value;
          const errBox = document.getElementById('cd-error');
          if (!val){ errBox.hidden=false; errBox.textContent='Choose a target date and time.'; return; }
          const target = new Date(val);
          if (timer) clearInterval(timer);
          tick(target);
          timer = setInterval(() => tick(target), 1000);
        });
        document.getElementById('cd-reset').addEventListener('click', function(){
          if (timer) clearInterval(timer);
          document.getElementById('cd-target').value = '';
          document.getElementById('cd-result').hidden = true; document.getElementById('cd-error').hidden = true;
        });
      })();`,
    howTo: ['Pick a target date and time.', 'Click Start countdown.', 'The days/hours/minutes/seconds remaining update live every second.'],
    faq: [{ q: 'Does the countdown keep running if I leave the tab?', a: 'It updates using your browser’s JavaScript timer, so it will pause if the tab is fully suspended by the browser, but resumes correctly when you return.' }]
  },
  {
    slug: 'timezone-converter',
    name: 'Time Zone Converter',
    category: 'datetime-tools',
    description: 'Convert a date and time from your local time zone to any other major time zone.',
    keywords: ['timezone converter', 'time zone conversion', 'convert time between timezones'],
    related: ['timestamp-converter', 'countdown-calculator', 'date-difference-calculator'],
    html: `
      <div class="tool-panel">
        <label class="field-label" for="tz-datetime">Date &amp; time (your local time)</label>
        <input id="tz-datetime" class="input" type="datetime-local">
        <label class="field-label" for="tz-target">Convert to time zone</label>
        <select id="tz-target" class="select"></select>
        <div class="toolbar">
          <button class="btn btn-primary" id="tz-run" type="button">Convert</button>
          <button class="btn btn-ghost" id="tz-now" type="button">Use current time</button>
        </div>
        <div id="tz-error" class="alert alert-error" role="alert" hidden></div>
        <div class="result-box" id="tz-result" hidden></div>
      </div>`,
    script: `
      (function(){
        const zones = ['UTC','America/New_York','America/Chicago','America/Denver','America/Los_Angeles','America/Sao_Paulo','Europe/London','Europe/Paris','Europe/Berlin','Europe/Moscow','Africa/Cairo','Asia/Dubai','Asia/Kolkata','Asia/Dhaka','Asia/Bangkok','Asia/Shanghai','Asia/Tokyo','Asia/Seoul','Australia/Sydney','Pacific/Auckland'];
        const sel = document.getElementById('tz-target');
        zones.forEach(z => { const o = document.createElement('option'); o.value = z; o.textContent = z.replace('_',' '); sel.appendChild(o); });
        document.getElementById('tz-now').addEventListener('click', function(){
          const now = new Date();
          const iso = new Date(now.getTime() - now.getTimezoneOffset()*60000).toISOString().slice(0,16);
          document.getElementById('tz-datetime').value = iso;
        });
        document.getElementById('tz-run').addEventListener('click', function(){
          const val = document.getElementById('tz-datetime').value;
          const errBox = document.getElementById('tz-error');
          if (!val){ errBox.hidden=false; errBox.textContent='Choose a date and time first.'; return; }
          errBox.hidden = true;
          const d = new Date(val);
          const zone = sel.value;
          const formatted = new Intl.DateTimeFormat(undefined, { dateStyle:'full', timeStyle:'long', timeZone: zone }).format(d);
          const box = document.getElementById('tz-result');
          box.hidden = false;
          box.innerHTML = '<strong>' + zone.replace('_',' ') + ':</strong><br>' + formatted;
        });
      })();`,
    howTo: ['Enter a date and time in your local time zone (or click Use current time).', 'Choose the target time zone.', 'Click Convert to see the equivalent local time there.'],
    faq: [{ q: 'Does this handle daylight saving time automatically?', a: 'Yes. Conversions use the Intl.DateTimeFormat API with IANA time zone data, which accounts for daylight saving rules automatically.' }]
  }
];
