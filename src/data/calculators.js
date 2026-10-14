module.exports = [
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'calculators',
    description: 'Calculate X% of Y, percentage increase or decrease, and percentage difference between two numbers.',
    keywords: ['percentage calculator', 'percent of number', 'percentage increase calculator'],
    related: ['discount-calculator', 'percentage-change-calculator', 'average-calculator'],
    html: `
      <div class="tool-panel">
        <div class="tab-group" role="tablist">
          <button class="tab active" data-mode="of" role="tab" aria-selected="true">X% of Y</button>
          <button class="tab" data-mode="incdec" role="tab" aria-selected="false">Increase / Decrease</button>
          <button class="tab" data-mode="diff" role="tab" aria-selected="false">Difference</button>
        </div>
        <div class="calc-mode" data-panel="of">
          <div class="grid-2">
            <div><label class="field-label" for="pc-x">Percentage (X%)</label><input id="pc-x" class="input" type="number" placeholder="20"></div>
            <div><label class="field-label" for="pc-y">Of number (Y)</label><input id="pc-y" class="input" type="number" placeholder="150"></div>
          </div>
        </div>
        <div class="calc-mode" data-panel="incdec" hidden>
          <div class="grid-2">
            <div><label class="field-label" for="pc-old">Original value</label><input id="pc-old" class="input" type="number" placeholder="80"></div>
            <div><label class="field-label" for="pc-new">New value</label><input id="pc-new" class="input" type="number" placeholder="100"></div>
          </div>
        </div>
        <div class="calc-mode" data-panel="diff" hidden>
          <div class="grid-2">
            <div><label class="field-label" for="pc-a">Value A</label><input id="pc-a" class="input" type="number" placeholder="40"></div>
            <div><label class="field-label" for="pc-b">Value B</label><input id="pc-b" class="input" type="number" placeholder="60"></div>
          </div>
        </div>
        <div class="toolbar">
          <button class="btn btn-primary" id="pc-run" type="button">Calculate</button>
          <button class="btn btn-ghost" id="pc-reset" type="button">Reset</button>
        </div>
        <div id="pc-error" class="alert alert-error" role="alert" hidden></div>
        <div class="result-box" id="pc-result" hidden></div>
      </div>`,
    script: `
      (function(){
        let mode = 'of';
        document.querySelectorAll('.tab-group .tab').forEach(t => t.addEventListener('click', function(){
          document.querySelectorAll('.tab-group .tab').forEach(x=>{x.classList.remove('active'); x.setAttribute('aria-selected','false');});
          this.classList.add('active'); this.setAttribute('aria-selected','true');
          mode = this.dataset.mode;
          document.querySelectorAll('.calc-mode').forEach(p => p.hidden = p.dataset.panel !== mode);
          document.getElementById('pc-result').hidden = true;
        }));
        function num(id){ return parseFloat(document.getElementById(id).value); }
        document.getElementById('pc-run').addEventListener('click', function(){
          const errBox = document.getElementById('pc-error');
          const resBox = document.getElementById('pc-result');
          errBox.hidden = true;
          let html = '';
          if (mode === 'of'){
            const x = num('pc-x'), y = num('pc-y');
            if (isNaN(x) || isNaN(y)){ errBox.hidden=false; errBox.textContent='Enter both values.'; return; }
            html = '<strong>' + x + '% of ' + y + ' = ' + (x/100*y).toLocaleString(undefined,{maximumFractionDigits:4}) + '</strong>';
          } else if (mode === 'incdec'){
            const o = num('pc-old'), n = num('pc-new');
            if (isNaN(o) || isNaN(n) || o === 0){ errBox.hidden=false; errBox.textContent='Enter both values (original cannot be 0).'; return; }
            const change = ((n-o)/Math.abs(o))*100;
            html = '<strong>' + (change >= 0 ? 'Increase' : 'Decrease') + ' of ' + Math.abs(change).toFixed(2) + '%</strong>';
          } else {
            const a = num('pc-a'), b = num('pc-b');
            if (isNaN(a) || isNaN(b) || (a===0 && b===0)){ errBox.hidden=false; errBox.textContent='Enter both values.'; return; }
            const diff = Math.abs(a-b) / ((a+b)/2) * 100;
            html = '<strong>Percentage difference: ' + diff.toFixed(2) + '%</strong>';
          }
          resBox.innerHTML = html;
          resBox.hidden = false;
        });
        document.getElementById('pc-reset').addEventListener('click', function(){
          document.querySelectorAll('.tool-panel input').forEach(i => i.value='');
          document.getElementById('pc-result').hidden = true;
          document.getElementById('pc-error').hidden = true;
        });
      })();`,
    howTo: ['Choose the calculation type.', 'Enter the required numbers.', 'Click Calculate to see the result and a plain-English explanation.'],
    faq: [
      { q: 'What is the formula for X% of Y?', a: 'X% of Y is calculated as (X ÷ 100) × Y.' },
      { q: 'How is percentage difference different from percentage change?', a: 'Percentage change compares a new value to an original (directional), while percentage difference compares two values relative to their average (non-directional).' }
    ]
  },
  {
    slug: 'discount-calculator',
    name: 'Discount Calculator',
    category: 'calculators',
    description: 'Work out the discount amount and final price from an original price and discount percentage.',
    keywords: ['discount calculator', 'sale price calculator', 'percent off calculator'],
    related: ['percentage-calculator', 'gst-calculator', 'tip-calculator'],
    html: `
      <div class="tool-panel">
        <div class="grid-2">
          <div><label class="field-label" for="dc-price">Original price</label><input id="dc-price" class="input" type="number" placeholder="1200"></div>
          <div><label class="field-label" for="dc-discount">Discount (%)</label><input id="dc-discount" class="input" type="number" placeholder="25"></div>
        </div>
        <div class="toolbar">
          <button class="btn btn-primary" id="dc-run" type="button">Calculate</button>
          <button class="btn btn-ghost" id="dc-reset" type="button">Reset</button>
        </div>
        <div id="dc-error" class="alert alert-error" role="alert" hidden></div>
        <div class="stats-grid" id="dc-result" hidden>
          <div class="stat"><span class="stat-value" id="dc-amount">—</span><span class="stat-label">You save</span></div>
          <div class="stat"><span class="stat-value" id="dc-final">—</span><span class="stat-label">Final price</span></div>
        </div>
      </div>`,
    script: `
      (function(){
        document.getElementById('dc-run').addEventListener('click', function(){
          const price = parseFloat(document.getElementById('dc-price').value);
          const discount = parseFloat(document.getElementById('dc-discount').value);
          const errBox = document.getElementById('dc-error');
          if (isNaN(price) || isNaN(discount) || price < 0 || discount < 0){
            errBox.hidden=false; errBox.textContent='Enter a valid price and discount percentage.'; document.getElementById('dc-result').hidden=true; return;
          }
          errBox.hidden = true;
          const amount = price * (discount/100);
          document.getElementById('dc-amount').textContent = amount.toLocaleString(undefined,{maximumFractionDigits:2});
          document.getElementById('dc-final').textContent = (price - amount).toLocaleString(undefined,{maximumFractionDigits:2});
          document.getElementById('dc-result').hidden = false;
        });
        document.getElementById('dc-reset').addEventListener('click', function(){
          document.getElementById('dc-price').value=''; document.getElementById('dc-discount').value='';
          document.getElementById('dc-result').hidden = true; document.getElementById('dc-error').hidden = true;
        });
      })();`,
    howTo: ['Enter the original price.', 'Enter the discount percentage.', 'Click Calculate to see how much you save and the final price.'],
    faq: [{ q: 'Formula used?', a: 'Discount amount = price × (discount% ÷ 100). Final price = price − discount amount.' }]
  },
  {
    slug: 'gst-calculator',
    name: 'GST / Sales Tax Calculator',
    category: 'calculators',
    description: 'Calculate GST or sales tax both ways: add tax to a base price, or extract the base price from a tax-inclusive amount, at any rate.',
    keywords: ['gst calculator', 'sales tax calculator', 'tax inclusive calculator', 'add gst calculator'],
    related: ['discount-calculator', 'percentage-calculator', 'tip-calculator'],
    html: `
      <div class="tool-panel">
        <p class="hint">This calculator works with any percentage tax rate — enter the rate that applies where you are; it doesn’t assume a specific country.</p>
        <div class="tab-group" role="tablist">
          <button class="tab active" data-mode="add" role="tab" aria-selected="true">Add tax to base price</button>
          <button class="tab" data-mode="remove" role="tab" aria-selected="false">Extract base price from total</button>
        </div>
        <div class="grid-2">
          <div><label class="field-label" for="gst-amount" id="gst-amount-label">Base price (excl. tax)</label><input id="gst-amount" class="input" type="number" placeholder="1000"></div>
          <div><label class="field-label" for="gst-rate">Tax rate (%)</label><input id="gst-rate" class="input" type="number" placeholder="18"></div>
        </div>
        <div class="toolbar">
          <button class="btn btn-primary" id="gst-run" type="button">Calculate</button>
          <button class="btn btn-ghost" id="gst-reset" type="button">Reset</button>
        </div>
        <div id="gst-error" class="alert alert-error" role="alert" hidden></div>
        <div class="stats-grid" id="gst-result" hidden>
          <div class="stat"><span class="stat-value" id="gst-base">—</span><span class="stat-label">Base price</span></div>
          <div class="stat"><span class="stat-value" id="gst-tax">—</span><span class="stat-label">Tax amount</span></div>
          <div class="stat"><span class="stat-value" id="gst-total">—</span><span class="stat-label">Total (incl. tax)</span></div>
        </div>
      </div>`,
    script: `
      (function(){
        let mode = 'add';
        document.querySelectorAll('.tab-group .tab').forEach(t => t.addEventListener('click', function(){
          document.querySelectorAll('.tab-group .tab').forEach(x=>{x.classList.remove('active'); x.setAttribute('aria-selected','false');});
          this.classList.add('active'); this.setAttribute('aria-selected','true');
          mode = this.dataset.mode;
          document.getElementById('gst-amount-label').textContent = mode === 'add' ? 'Base price (excl. tax)' : 'Total price (incl. tax)';
          document.getElementById('gst-result').hidden = true;
        }));
        document.getElementById('gst-run').addEventListener('click', function(){
          const amount = parseFloat(document.getElementById('gst-amount').value);
          const rate = parseFloat(document.getElementById('gst-rate').value);
          const errBox = document.getElementById('gst-error');
          if (isNaN(amount) || isNaN(rate) || amount < 0 || rate < 0){
            errBox.hidden=false; errBox.textContent='Enter a valid amount and tax rate.'; document.getElementById('gst-result').hidden=true; return;
          }
          errBox.hidden = true;
          let base, tax, total;
          if (mode === 'add'){ base = amount; tax = amount * rate/100; total = base + tax; }
          else { total = amount; base = amount / (1 + rate/100); tax = total - base; }
          document.getElementById('gst-base').textContent = base.toLocaleString(undefined,{maximumFractionDigits:2});
          document.getElementById('gst-tax').textContent = tax.toLocaleString(undefined,{maximumFractionDigits:2});
          document.getElementById('gst-total').textContent = total.toLocaleString(undefined,{maximumFractionDigits:2});
          document.getElementById('gst-result').hidden = false;
        });
        document.getElementById('gst-reset').addEventListener('click', function(){
          document.getElementById('gst-amount').value=''; document.getElementById('gst-rate').value='';
          document.getElementById('gst-result').hidden = true; document.getElementById('gst-error').hidden = true;
        });
      })();`,
    howTo: ['Choose whether you’re adding tax to a base price or extracting the base price from a tax-inclusive total.', 'Enter the amount and the tax rate.', 'Click Calculate to see the base price, tax amount and total.'],
    faq: [{ q: 'Does this use a fixed tax rate?', a: 'No — you enter whatever percentage applies in your situation, so this works for GST, VAT or general sales tax in any country.' }]
  },
  {
    slug: 'emi-calculator',
    name: 'EMI / Loan Calculator',
    category: 'calculators',
    description: 'Calculate your monthly loan installment (EMI), total interest and total payment from principal, rate and tenure.',
    keywords: ['emi calculator', 'loan calculator', 'monthly installment calculator'],
    related: ['percentage-calculator', 'discount-calculator', 'average-calculator'],
    html: `
      <div class="tool-panel">
        <div class="grid-3">
          <div><label class="field-label" for="emi-principal">Loan amount</label><input id="emi-principal" class="input" type="number" placeholder="500000"></div>
          <div><label class="field-label" for="emi-rate">Annual interest rate (%)</label><input id="emi-rate" class="input" type="number" placeholder="9.5"></div>
          <div><label class="field-label" for="emi-tenure">Tenure (years)</label><input id="emi-tenure" class="input" type="number" placeholder="5"></div>
        </div>
        <div class="toolbar">
          <button class="btn btn-primary" id="emi-run" type="button">Calculate</button>
          <button class="btn btn-ghost" id="emi-reset" type="button">Reset</button>
        </div>
        <div id="emi-error" class="alert alert-error" role="alert" hidden></div>
        <div class="stats-grid" id="emi-result" hidden>
          <div class="stat"><span class="stat-value" id="emi-monthly">—</span><span class="stat-label">Monthly EMI</span></div>
          <div class="stat"><span class="stat-value" id="emi-interest">—</span><span class="stat-label">Total interest</span></div>
          <div class="stat"><span class="stat-value" id="emi-total">—</span><span class="stat-label">Total payment</span></div>
        </div>
        <p class="hint" id="emi-note" hidden></p>
      </div>`,
    script: `
      (function(){
        document.getElementById('emi-run').addEventListener('click', function(){
          const p = parseFloat(document.getElementById('emi-principal').value);
          const annualRate = parseFloat(document.getElementById('emi-rate').value);
          const years = parseFloat(document.getElementById('emi-tenure').value);
          const errBox = document.getElementById('emi-error');
          if (isNaN(p) || isNaN(annualRate) || isNaN(years) || p <= 0 || annualRate < 0 || years <= 0){
            errBox.hidden=false; errBox.textContent='Enter a valid loan amount, rate and tenure.'; document.getElementById('emi-result').hidden=true; return;
          }
          errBox.hidden = true;
          const n = Math.round(years * 12);
          const r = annualRate / 12 / 100;
          let emi;
          if (r === 0) emi = p / n;
          else emi = p * r * Math.pow(1+r, n) / (Math.pow(1+r, n) - 1);
          const total = emi * n;
          const interest = total - p;
          document.getElementById('emi-monthly').textContent = emi.toLocaleString(undefined,{maximumFractionDigits:2});
          document.getElementById('emi-interest').textContent = interest.toLocaleString(undefined,{maximumFractionDigits:2});
          document.getElementById('emi-total').textContent = total.toLocaleString(undefined,{maximumFractionDigits:2});
          document.getElementById('emi-result').hidden = false;
          const noteBox = document.getElementById('emi-note');
          noteBox.hidden = false;
          noteBox.textContent = 'Based on ' + n + ' monthly installments at a monthly rate of ' + (r*100).toFixed(4) + '%.';
        });
        document.getElementById('emi-reset').addEventListener('click', function(){
          ['emi-principal','emi-rate','emi-tenure'].forEach(id => document.getElementById(id).value='');
          document.getElementById('emi-result').hidden = true; document.getElementById('emi-error').hidden = true;
          document.getElementById('emi-note').hidden = true;
        });
      })();`,
    howTo: ['Enter the loan amount, annual interest rate and tenure in years.', 'Click Calculate.', 'See your monthly EMI, total interest paid and total repayment.'],
    faq: [{ q: 'What formula is used?', a: 'The standard reducing-balance EMI formula: EMI = P × r × (1+r)ⁿ ÷ ((1+r)ⁿ − 1), where P is principal, r is the monthly interest rate, and n is the number of monthly installments.' }]
  },
  {
    slug: 'age-calculator',
    name: 'Age Calculator',
    category: 'calculators',
    description: 'Calculate exact age in years, months and days between a date of birth and any target date, plus days until next birthday.',
    keywords: ['age calculator', 'calculate age from date of birth', 'how old am i'],
    related: ['date-difference-calculator', 'countdown-calculator', 'add-subtract-days'],
    html: `
      <div class="tool-panel">
        <div class="grid-2">
          <div><label class="field-label" for="age-dob">Date of birth</label><input id="age-dob" class="input" type="date"></div>
          <div><label class="field-label" for="age-target">Calculate age on</label><input id="age-target" class="input" type="date"></div>
        </div>
        <div class="toolbar">
          <button class="btn btn-primary" id="age-run" type="button">Calculate age</button>
          <button class="btn btn-ghost" id="age-today" type="button">Use today’s date</button>
          <button class="btn btn-ghost" id="age-reset" type="button">Reset</button>
        </div>
        <div id="age-error" class="alert alert-error" role="alert" hidden></div>
        <div class="stats-grid" id="age-result" hidden>
          <div class="stat"><span class="stat-value" id="age-ymd">—</span><span class="stat-label">Age</span></div>
          <div class="stat"><span class="stat-value" id="age-days">—</span><span class="stat-label">Total days lived</span></div>
          <div class="stat"><span class="stat-value" id="age-next">—</span><span class="stat-label">Next birthday in</span></div>
        </div>
      </div>`,
    script: `
      (function(){
        document.getElementById('age-today').addEventListener('click', function(){
          document.getElementById('age-target').value = new Date().toISOString().slice(0,10);
        });
        document.getElementById('age-run').addEventListener('click', function(){
          const dobVal = document.getElementById('age-dob').value;
          const targetVal = document.getElementById('age-target').value || new Date().toISOString().slice(0,10);
          const errBox = document.getElementById('age-error');
          if (!dobVal){ errBox.hidden=false; errBox.textContent='Enter a date of birth.'; document.getElementById('age-result').hidden=true; return; }
          const dob = new Date(dobVal + 'T00:00:00');
          const target = new Date(targetVal + 'T00:00:00');
          if (target < dob){ errBox.hidden=false; errBox.textContent='Target date must be on or after the date of birth.'; document.getElementById('age-result').hidden=true; return; }
          errBox.hidden = true;
          let years = target.getFullYear() - dob.getFullYear();
          let months = target.getMonth() - dob.getMonth();
          let days = target.getDate() - dob.getDate();
          if (days < 0){ months--; const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0); days += prevMonth.getDate(); }
          if (months < 0){ years--; months += 12; }
          const totalDays = Math.floor((target - dob) / 86400000);
          let nextBday = new Date(target.getFullYear(), dob.getMonth(), dob.getDate());
          if (nextBday < target) nextBday = new Date(target.getFullYear()+1, dob.getMonth(), dob.getDate());
          const daysToNext = Math.ceil((nextBday - target) / 86400000);
          document.getElementById('age-ymd').textContent = years + 'y ' + months + 'm ' + days + 'd';
          document.getElementById('age-days').textContent = totalDays.toLocaleString();
          document.getElementById('age-next').textContent = daysToNext + ' day' + (daysToNext===1?'':'s');
          document.getElementById('age-result').hidden = false;
        });
        document.getElementById('age-reset').addEventListener('click', function(){
          document.getElementById('age-dob').value=''; document.getElementById('age-target').value='';
          document.getElementById('age-result').hidden = true; document.getElementById('age-error').hidden = true;
        });
      })();`,
    howTo: ['Enter your date of birth.', 'Optionally set a target date (defaults to today).', 'Click Calculate age to see your exact age and countdown to your next birthday.'],
    faq: [{ q: 'Does this account for leap years?', a: 'Yes. The calculation uses native JavaScript Date arithmetic, which correctly accounts for leap years and varying month lengths.' }]
  },
  {
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    category: 'calculators',
    description: 'Calculate Body Mass Index from height and weight in metric or imperial units, with the standard BMI category.',
    keywords: ['bmi calculator', 'body mass index calculator', 'bmi metric imperial'],
    related: ['age-calculator', 'percentage-calculator', 'average-calculator'],
    html: `
      <div class="tool-panel">
        <div class="tab-group" role="tablist">
          <button class="tab active" data-unit="metric" role="tab" aria-selected="true">Metric (cm / kg)</button>
          <button class="tab" data-unit="imperial" role="tab" aria-selected="false">Imperial (ft-in / lb)</button>
        </div>
        <div class="calc-mode" data-panel="metric">
          <div class="grid-2">
            <div><label class="field-label" for="bmi-height-cm">Height (cm)</label><input id="bmi-height-cm" class="input" type="number" placeholder="170"></div>
            <div><label class="field-label" for="bmi-weight-kg">Weight (kg)</label><input id="bmi-weight-kg" class="input" type="number" placeholder="65"></div>
          </div>
        </div>
        <div class="calc-mode" data-panel="imperial" hidden>
          <div class="grid-3">
            <div><label class="field-label" for="bmi-height-ft">Height (ft)</label><input id="bmi-height-ft" class="input" type="number" placeholder="5"></div>
            <div><label class="field-label" for="bmi-height-in">Height (in)</label><input id="bmi-height-in" class="input" type="number" placeholder="7"></div>
            <div><label class="field-label" for="bmi-weight-lb">Weight (lb)</label><input id="bmi-weight-lb" class="input" type="number" placeholder="145"></div>
          </div>
        </div>
        <div class="toolbar">
          <button class="btn btn-primary" id="bmi-run" type="button">Calculate BMI</button>
          <button class="btn btn-ghost" id="bmi-reset" type="button">Reset</button>
        </div>
        <div id="bmi-error" class="alert alert-error" role="alert" hidden></div>
        <div class="stats-grid" id="bmi-result" hidden>
          <div class="stat"><span class="stat-value" id="bmi-value">—</span><span class="stat-label">BMI</span></div>
          <div class="stat"><span class="stat-value" id="bmi-category">—</span><span class="stat-label">Category</span></div>
        </div>
        <p class="hint">BMI is a general screening measure, not a diagnosis. It does not account for muscle mass, bone density, age or sex, and isn’t a substitute for professional medical advice.</p>
      </div>`,
    script: `
      (function(){
        let unit = 'metric';
        document.querySelectorAll('.tab-group .tab').forEach(t => t.addEventListener('click', function(){
          document.querySelectorAll('.tab-group .tab').forEach(x=>{x.classList.remove('active'); x.setAttribute('aria-selected','false');});
          this.classList.add('active'); this.setAttribute('aria-selected','true');
          unit = this.dataset.unit;
          document.querySelectorAll('.calc-mode').forEach(p => p.hidden = p.dataset.panel !== unit);
          document.getElementById('bmi-result').hidden = true;
        }));
        function category(bmi){
          if (bmi < 18.5) return 'Underweight';
          if (bmi < 25) return 'Normal weight';
          if (bmi < 30) return 'Overweight';
          return 'Obese';
        }
        document.getElementById('bmi-run').addEventListener('click', function(){
          const errBox = document.getElementById('bmi-error');
          let bmi;
          if (unit === 'metric'){
            const h = parseFloat(document.getElementById('bmi-height-cm').value) / 100;
            const w = parseFloat(document.getElementById('bmi-weight-kg').value);
            if (!h || !w || h<=0 || w<=0){ errBox.hidden=false; errBox.textContent='Enter a valid height and weight.'; document.getElementById('bmi-result').hidden=true; return; }
            bmi = w / (h*h);
          } else {
            const ft = parseFloat(document.getElementById('bmi-height-ft').value) || 0;
            const inch = parseFloat(document.getElementById('bmi-height-in').value) || 0;
            const totalIn = ft*12 + inch;
            const w = parseFloat(document.getElementById('bmi-weight-lb').value);
            if (!totalIn || !w || totalIn<=0 || w<=0){ errBox.hidden=false; errBox.textContent='Enter a valid height and weight.'; document.getElementById('bmi-result').hidden=true; return; }
            bmi = 703 * w / (totalIn*totalIn);
          }
          errBox.hidden = true;
          document.getElementById('bmi-value').textContent = bmi.toFixed(1);
          document.getElementById('bmi-category').textContent = category(bmi);
          document.getElementById('bmi-result').hidden = false;
        });
        document.getElementById('bmi-reset').addEventListener('click', function(){
          document.querySelectorAll('.tool-panel input').forEach(i => i.value='');
          document.getElementById('bmi-result').hidden = true; document.getElementById('bmi-error').hidden = true;
        });
      })();`,
    howTo: ['Choose metric or imperial units.', 'Enter your height and weight.', 'Click Calculate BMI to see your BMI value and category.'],
    faq: [{ q: 'Is BMI accurate for everyone?', a: 'BMI is a population-level screening tool and can be less accurate for athletes, older adults, pregnant people and children. Consult a healthcare professional for a full assessment.' }]
  },
  {
    slug: 'tip-calculator',
    name: 'Tip Calculator',
    category: 'calculators',
    description: 'Calculate the tip amount, total bill, and per-person split for any bill amount, tip percentage and group size.',
    keywords: ['tip calculator', 'bill splitter', 'gratuity calculator'],
    related: ['discount-calculator', 'percentage-calculator', 'average-calculator'],
    html: `
      <div class="tool-panel">
        <div class="grid-3">
          <div><label class="field-label" for="tip-bill">Bill amount</label><input id="tip-bill" class="input" type="number" placeholder="86.50"></div>
          <div><label class="field-label" for="tip-percent">Tip (%)</label><input id="tip-percent" class="input" type="number" placeholder="15"></div>
          <div><label class="field-label" for="tip-people">Number of people</label><input id="tip-people" class="input" type="number" placeholder="1" min="1" value="1"></div>
        </div>
        <div class="toolbar">
          <button class="btn btn-primary" id="tip-run" type="button">Calculate</button>
          <button class="btn btn-ghost" id="tip-reset" type="button">Reset</button>
        </div>
        <div id="tip-error" class="alert alert-error" role="alert" hidden></div>
        <div class="stats-grid" id="tip-result" hidden>
          <div class="stat"><span class="stat-value" id="tip-amount">—</span><span class="stat-label">Tip amount</span></div>
          <div class="stat"><span class="stat-value" id="tip-total">—</span><span class="stat-label">Total bill</span></div>
          <div class="stat"><span class="stat-value" id="tip-each">—</span><span class="stat-label">Per person</span></div>
        </div>
      </div>`,
    script: `
      (function(){
        document.getElementById('tip-run').addEventListener('click', function(){
          const bill = parseFloat(document.getElementById('tip-bill').value);
          const pct = parseFloat(document.getElementById('tip-percent').value);
          const people = Math.max(1, parseInt(document.getElementById('tip-people').value, 10) || 1);
          const errBox = document.getElementById('tip-error');
          if (isNaN(bill) || isNaN(pct) || bill < 0 || pct < 0){
            errBox.hidden=false; errBox.textContent='Enter a valid bill amount and tip percentage.'; document.getElementById('tip-result').hidden=true; return;
          }
          errBox.hidden = true;
          const tip = bill * pct/100;
          const total = bill + tip;
          document.getElementById('tip-amount').textContent = tip.toLocaleString(undefined,{maximumFractionDigits:2});
          document.getElementById('tip-total').textContent = total.toLocaleString(undefined,{maximumFractionDigits:2});
          document.getElementById('tip-each').textContent = (total/people).toLocaleString(undefined,{maximumFractionDigits:2});
          document.getElementById('tip-result').hidden = false;
        });
        document.getElementById('tip-reset').addEventListener('click', function(){
          document.getElementById('tip-bill').value=''; document.getElementById('tip-percent').value=''; document.getElementById('tip-people').value='1';
          document.getElementById('tip-result').hidden = true; document.getElementById('tip-error').hidden = true;
        });
      })();`,
    howTo: ['Enter the bill amount and desired tip percentage.', 'Enter how many people are splitting the bill.', 'Click Calculate for the tip, total, and per-person amount.'],
    faq: [{ q: 'Does this split the tip evenly regardless of what each person ordered?', a: 'Yes, this calculates an even split across the number of people entered. For itemized splitting you’d need to divide individual items separately.' }]
  }
];
