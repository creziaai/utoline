function unitToolHtml(prefix, units, defaultFrom, defaultTo, placeholder){
  const options = units.map(u => '<option value="'+u.key+'">'+u.label+'</option>').join('');
  return `
    <div class="tool-panel">
      <div class="grid-3 converter-grid">
        <div>
          <label class="field-label" for="${prefix}-value">Value</label>
          <input id="${prefix}-value" class="input" type="number" placeholder="${placeholder}">
        </div>
        <div>
          <label class="field-label" for="${prefix}-from">From</label>
          <select id="${prefix}-from" class="select">${options}</select>
        </div>
        <div>
          <label class="field-label" for="${prefix}-to">To</label>
          <select id="${prefix}-to" class="select">${options}</select>
        </div>
      </div>
      <div class="toolbar">
        <button class="btn btn-ghost" id="${prefix}-swap" type="button">⇄ Swap units</button>
        <button class="btn btn-ghost" id="${prefix}-reset" type="button">Reset</button>
      </div>
      <div id="${prefix}-error" class="alert alert-error" role="alert" hidden></div>
      <div class="result-box" id="${prefix}-result" aria-live="polite"></div>
    </div>`;
}

function unitToolScript(prefix, factorsVar, defaultFrom, defaultTo){
  return `
    (function(){
      const factors = ${factorsVar};
      const value = document.getElementById('${prefix}-value');
      const from = document.getElementById('${prefix}-from');
      const to = document.getElementById('${prefix}-to');
      from.value = '${defaultFrom}';
      to.value = '${defaultTo}';
      function convert(){
        const v = parseFloat(value.value);
        const box = document.getElementById('${prefix}-result');
        const errBox = document.getElementById('${prefix}-error');
        if (isNaN(v)){ box.textContent=''; return; }
        errBox.hidden = true;
        const base = v * factors[from.value];
        const result = base / factors[to.value];
        box.innerHTML = '<strong>' + v + ' ' + from.value + ' = ' + result.toLocaleString(undefined,{maximumFractionDigits:6}) + ' ' + to.value + '</strong>';
      }
      [value, from, to].forEach(el => el.addEventListener('input', convert));
      document.getElementById('${prefix}-swap').addEventListener('click', function(){
        const tmp = from.value; from.value = to.value; to.value = tmp; convert();
      });
      document.getElementById('${prefix}-reset').addEventListener('click', function(){
        value.value=''; document.getElementById('${prefix}-result').textContent='';
      });
      convert();
    })();`;
}

const lengthUnits = [
  { key:'mm', label:'Millimeters (mm)' }, { key:'cm', label:'Centimeters (cm)' }, { key:'m', label:'Meters (m)' },
  { key:'km', label:'Kilometers (km)' }, { key:'in', label:'Inches (in)' }, { key:'ft', label:'Feet (ft)' },
  { key:'yd', label:'Yards (yd)' }, { key:'mi', label:'Miles (mi)' }
];
const lengthFactors = { mm:0.001, cm:0.01, m:1, km:1000, in:0.0254, ft:0.3048, yd:0.9144, mi:1609.344 };

const weightUnits = [
  { key:'mg', label:'Milligrams (mg)' }, { key:'g', label:'Grams (g)' }, { key:'kg', label:'Kilograms (kg)' },
  { key:'oz', label:'Ounces (oz)' }, { key:'lb', label:'Pounds (lb)' }, { key:'st', label:'Stone (st)' }, { key:'t', label:'Metric tons (t)' }
];
const weightFactors = { mg:0.000001, g:0.001, kg:1, oz:0.0283495231, lb:0.45359237, st:6.35029318, t:1000 };

const areaUnits = [
  { key:'sqm', label:'Square meters (m²)' }, { key:'sqkm', label:'Square kilometers (km²)' }, { key:'sqft', label:'Square feet (ft²)' },
  { key:'sqyd', label:'Square yards (yd²)' }, { key:'acre', label:'Acres' }, { key:'hectare', label:'Hectares' }, { key:'sqmi', label:'Square miles (mi²)' }
];
const areaFactors = { sqm:1, sqkm:1000000, sqft:0.09290304, sqyd:0.83612736, acre:4046.8564224, hectare:10000, sqmi:2589988.110336 };

const volumeUnits = [
  { key:'ml', label:'Milliliters (ml)' }, { key:'l', label:'Liters (l)' }, { key:'m3', label:'Cubic meters (m³)' },
  { key:'tsp', label:'Teaspoons (US)' }, { key:'tbsp', label:'Tablespoons (US)' }, { key:'cup', label:'Cups (US)' },
  { key:'gal', label:'Gallons (US)' }, { key:'floz', label:'Fluid ounces (US)' }
];
const volumeFactors = { ml:0.001, l:1, m3:1000, tsp:0.00492892, tbsp:0.0147868, cup:0.236588, gal:3.78541, floz:0.0295735 };

const speedUnits = [
  { key:'mps', label:'Meters/second (m/s)' }, { key:'kph', label:'Kilometers/hour (km/h)' },
  { key:'mph', label:'Miles/hour (mph)' }, { key:'knot', label:'Knots' }, { key:'fps', label:'Feet/second (ft/s)' }
];
const speedFactors = { mps:1, kph:0.277778, mph:0.44704, knot:0.514444, fps:0.3048 };

const dataUnits = [
  { key:'bit', label:'Bits' }, { key:'byte', label:'Bytes' }, { key:'kb', label:'Kilobytes (KB, 1000)' }, { key:'kib', label:'Kibibytes (KiB, 1024)' },
  { key:'mb', label:'Megabytes (MB, 1000²)' }, { key:'mib', label:'Mebibytes (MiB, 1024²)' },
  { key:'gb', label:'Gigabytes (GB, 1000³)' }, { key:'gib', label:'Gibibytes (GiB, 1024³)' },
  { key:'tb', label:'Terabytes (TB, 1000⁴)' }, { key:'tib', label:'Tebibytes (TiB, 1024⁴)' }
];
const dataFactors = { bit:0.125, byte:1, kb:1000, kib:1024, mb:1000000, mib:1048576, gb:1000000000, gib:1073741824, tb:1000000000000, tib:1099511627776 };

module.exports = [
  {
    slug: 'length-converter',
    name: 'Length Converter',
    category: 'converter-tools',
    description: 'Convert between millimeters, centimeters, meters, kilometers, inches, feet, yards and miles.',
    keywords: ['length converter', 'cm to inches', 'meters to feet', 'unit converter length'],
    related: ['weight-converter', 'area-converter', 'speed-converter'],
    html: unitToolHtml('len', lengthUnits, 'cm', 'in', 'e.g. 100'),
    script: unitToolScript('len', JSON.stringify(lengthFactors), 'cm', 'in'),
    howTo: ['Enter a value and choose the units to convert from and to.', 'The result updates instantly.', 'Use Swap units to reverse the conversion.'],
    faq: [{ q: 'How accurate are these conversions?', a: 'Conversions use precise standard conversion factors (e.g. 1 inch = 2.54 cm exactly) and display up to 6 decimal places.' }]
  },
  {
    slug: 'weight-converter',
    name: 'Weight Converter',
    category: 'converter-tools',
    description: 'Convert between milligrams, grams, kilograms, ounces, pounds, stone and metric tons.',
    keywords: ['weight converter', 'kg to lbs', 'grams to ounces', 'mass converter'],
    related: ['length-converter', 'volume-converter', 'bmi-calculator'],
    html: unitToolHtml('wt', weightUnits, 'kg', 'lb', 'e.g. 70'),
    script: unitToolScript('wt', JSON.stringify(weightFactors), 'kg', 'lb'),
    howTo: ['Enter a value and choose units.', 'The converted result appears instantly.', 'Use Swap units to reverse direction.'],
    faq: [{ q: 'Is stone converted using the UK definition?', a: 'Yes, 1 stone = 14 pounds = 6.35029318 kg, the standard UK unit.' }]
  },
  {
    slug: 'temperature-converter',
    name: 'Temperature Converter',
    category: 'converter-tools',
    description: 'Convert between Celsius, Fahrenheit and Kelvin instantly.',
    keywords: ['temperature converter', 'celsius to fahrenheit', 'fahrenheit to celsius', 'kelvin converter'],
    related: ['length-converter', 'weight-converter', 'bmi-calculator'],
    html: `
      <div class="tool-panel">
        <div class="grid-3 converter-grid">
          <div><label class="field-label" for="temp-value">Value</label><input id="temp-value" class="input" type="number" placeholder="e.g. 100"></div>
          <div><label class="field-label" for="temp-from">From</label>
            <select id="temp-from" class="select"><option value="c">Celsius (°C)</option><option value="f">Fahrenheit (°F)</option><option value="k">Kelvin (K)</option></select>
          </div>
          <div><label class="field-label" for="temp-to">To</label>
            <select id="temp-to" class="select"><option value="c">Celsius (°C)</option><option value="f" selected>Fahrenheit (°F)</option><option value="k">Kelvin (K)</option></select>
          </div>
        </div>
        <div class="toolbar">
          <button class="btn btn-ghost" id="temp-swap" type="button">⇄ Swap units</button>
          <button class="btn btn-ghost" id="temp-reset" type="button">Reset</button>
        </div>
        <div class="result-box" id="temp-result" aria-live="polite"></div>
      </div>`,
    script: `
      (function(){
        function toCelsius(v, unit){ if (unit==='c') return v; if (unit==='f') return (v-32)*5/9; return v-273.15; }
        function fromCelsius(c, unit){ if (unit==='c') return c; if (unit==='f') return c*9/5+32; return c+273.15; }
        const value = document.getElementById('temp-value');
        const from = document.getElementById('temp-from');
        const to = document.getElementById('temp-to');
        function convert(){
          const v = parseFloat(value.value);
          const box = document.getElementById('temp-result');
          if (isNaN(v)){ box.textContent=''; return; }
          const result = fromCelsius(toCelsius(v, from.value), to.value);
          const labels = {c:'°C', f:'°F', k:'K'};
          box.innerHTML = '<strong>' + v + labels[from.value] + ' = ' + result.toLocaleString(undefined,{maximumFractionDigits:4}) + labels[to.value] + '</strong>';
        }
        [value, from, to].forEach(el => el.addEventListener('input', convert));
        document.getElementById('temp-swap').addEventListener('click', function(){ const t=from.value; from.value=to.value; to.value=t; convert(); });
        document.getElementById('temp-reset').addEventListener('click', function(){ value.value=''; document.getElementById('temp-result').textContent=''; });
        convert();
      })();`,
    howTo: ['Enter a temperature value.', 'Choose the units to convert from and to.', 'The result updates instantly as you type.'],
    faq: [{ q: 'What is 0°C in Fahrenheit and Kelvin?', a: '0°C equals 32°F and 273.15 K.' }]
  },
  {
    slug: 'area-converter',
    name: 'Area Converter',
    category: 'converter-tools',
    description: 'Convert between square meters, square feet, acres, hectares and more.',
    keywords: ['area converter', 'square feet to square meters', 'acres to hectares'],
    related: ['length-converter', 'volume-converter', 'weight-converter'],
    html: unitToolHtml('area', areaUnits, 'sqft', 'sqm', 'e.g. 1000'),
    script: unitToolScript('area', JSON.stringify(areaFactors), 'sqft', 'sqm'),
    howTo: ['Enter a value and choose units.', 'The converted area appears instantly.', 'Use Swap units to reverse direction.'],
    faq: [{ q: 'How is an acre defined here?', a: '1 acre = 4,046.8564224 square meters, the international standard definition.' }]
  },
  {
    slug: 'volume-converter',
    name: 'Volume Converter',
    category: 'converter-tools',
    description: 'Convert between milliliters, liters, cubic meters, cups, gallons and more.',
    keywords: ['volume converter', 'liters to gallons', 'ml to cups', 'cubic meters converter'],
    related: ['length-converter', 'area-converter', 'weight-converter'],
    html: unitToolHtml('vol', volumeUnits, 'l', 'gal', 'e.g. 5'),
    script: unitToolScript('vol', JSON.stringify(volumeFactors), 'l', 'gal'),
    howTo: ['Enter a value and choose units.', 'The result updates instantly.', 'Use Swap units to reverse the conversion.'],
    faq: [{ q: 'Are these US or UK measurement units?', a: 'Cups, gallons, teaspoons, tablespoons and fluid ounces use US customary definitions.' }]
  },
  {
    slug: 'speed-converter',
    name: 'Speed Converter',
    category: 'converter-tools',
    description: 'Convert between meters/second, km/h, mph, knots and feet/second.',
    keywords: ['speed converter', 'kph to mph', 'knots to mph', 'mps converter'],
    related: ['length-converter', 'temperature-converter', 'time-duration-calculator'],
    html: unitToolHtml('spd', speedUnits, 'kph', 'mph', 'e.g. 100'),
    script: unitToolScript('spd', JSON.stringify(speedFactors), 'kph', 'mph'),
    howTo: ['Enter a value and choose units.', 'The converted speed appears instantly.', 'Use Swap units to reverse direction.'],
    faq: [{ q: 'How is a knot defined?', a: '1 knot = 1 nautical mile per hour = 0.514444 m/s.' }]
  },
  {
    slug: 'data-storage-converter',
    name: 'Data Storage Converter',
    category: 'converter-tools',
    description: 'Convert between bits, bytes, kilobytes, megabytes, gigabytes and terabytes — with correct decimal (1000) vs binary (1024) distinctions.',
    keywords: ['data storage converter', 'kb to mb', 'gb to mb', 'bytes converter'],
    related: ['length-converter', 'hash-generator', 'timestamp-converter'],
    html: unitToolHtml('data', dataUnits, 'mb', 'gib', 'e.g. 1024'),
    script: unitToolScript('data', JSON.stringify(dataFactors), 'mb', 'gib'),
    howTo: ['Enter a value and choose units.', 'Choose decimal units (KB, MB, GB — powers of 1000) or binary units (KiB, MiB, GiB — powers of 1024) depending on what you need.', 'The result updates instantly.'],
    faq: [
      { q: 'Why do KB and KiB give different results?', a: 'A kilobyte (KB) is 1000 bytes by the SI decimal standard, commonly used for storage marketing, while a kibibyte (KiB) is 1024 bytes, the binary unit operating systems often display file sizes in. This mismatch is why a "500 GB" drive shows as roughly 465 GiB in your OS.' }
    ]
  }
];
