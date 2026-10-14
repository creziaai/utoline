module.exports = [
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    category: 'image-tools',
    description: 'Compress JPG, PNG and WebP images in your browser to reduce file size, with a live before/after comparison. Images never leave your device.',
    keywords: ['image compressor', 'compress jpg online', 'reduce image file size', 'compress png'],
    related: ['image-resizer', 'image-format-converter', 'image-cropper'],
    html: `
      <div class="tool-panel">
        <p class="hint">Your image is processed entirely in your browser using the Canvas API — it is never uploaded to a server.</p>
        <div class="dropzone" id="ic-drop" tabindex="0" role="button" aria-label="Upload image">
          <input type="file" id="ic-file" accept="image/jpeg,image/png,image/webp" class="visually-hidden">
          <p>Drag &amp; drop an image here, or <span class="link-text">browse files</span></p>
          <p class="hint">JPG, PNG or WebP</p>
        </div>
        <div id="ic-error" class="alert alert-error" role="alert" hidden></div>
        <div id="ic-controls" hidden>
          <label class="field-label" for="ic-quality">Quality: <span id="ic-quality-value">80</span>%</label>
          <input id="ic-quality" type="range" min="10" max="100" value="80" class="range">
          <div class="toolbar">
            <button class="btn btn-primary" id="ic-run" type="button">Compress image</button>
            <button class="btn btn-ghost" id="ic-reset" type="button">Reset</button>
          </div>
          <div class="compare-grid">
            <div class="compare-col"><p class="field-label">Original</p><img id="ic-before-img" class="preview-img" alt="Original image"><p class="hint" id="ic-before-size"></p></div>
            <div class="compare-col"><p class="field-label">Compressed</p><canvas id="ic-canvas" class="preview-img"></canvas><p class="hint" id="ic-after-size"></p></div>
          </div>
          <p class="stat-value" id="ic-reduction"></p>
          <div class="toolbar" id="ic-download-row" hidden>
            <button class="btn btn-ghost" id="ic-download" type="button">Download compressed image</button>
          </div>
        </div>
      </div>`,
    script: `
      (function(){
        let img = null, originalSize = 0, originalType = 'image/jpeg';
        const drop = document.getElementById('ic-drop');
        const fileInput = document.getElementById('ic-file');
        const errBox = document.getElementById('ic-error');
        drop.addEventListener('click', () => fileInput.click());
        drop.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') fileInput.click(); });
        ['dragover','dragenter'].forEach(evt => drop.addEventListener(evt, e => { e.preventDefault(); drop.classList.add('dragover'); }));
        ['dragleave','drop'].forEach(evt => drop.addEventListener(evt, e => { e.preventDefault(); drop.classList.remove('dragover'); }));
        drop.addEventListener('drop', e => { if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]); });
        fileInput.addEventListener('change', e => { if (e.target.files[0]) loadFile(e.target.files[0]); });
        function loadFile(file){
          errBox.hidden = true;
          if (!/^image\\/(jpeg|png|webp)$/.test(file.type)){ errBox.hidden=false; errBox.textContent='Please choose a JPG, PNG or WebP image.'; return; }
          originalSize = file.size;
          originalType = file.type;
          const reader = new FileReader();
          reader.onload = function(e){
            img = new Image();
            img.onload = function(){
              document.getElementById('ic-before-img').src = e.target.result;
              document.getElementById('ic-before-size').textContent = formatBytes(originalSize) + ' — ' + img.width + '×' + img.height;
              document.getElementById('ic-controls').hidden = false;
              document.getElementById('ic-download-row').hidden = true;
              document.getElementById('ic-reduction').textContent = '';
            };
            img.onerror = function(){ errBox.hidden=false; errBox.textContent='This image could not be read. Please try another file.'; };
            img.src = e.target.result;
          };
          reader.onerror = function(){ errBox.hidden=false; errBox.textContent='Please choose a file first.'; };
          reader.readAsDataURL(file);
        }
        function formatBytes(b){
          if (b < 1024) return b + ' B';
          if (b < 1048576) return (b/1024).toFixed(1) + ' KB';
          return (b/1048576).toFixed(2) + ' MB';
        }
        const qSlider = document.getElementById('ic-quality');
        qSlider.addEventListener('input', () => document.getElementById('ic-quality-value').textContent = qSlider.value);
        document.getElementById('ic-run').addEventListener('click', function(){
          if (!img){ errBox.hidden=false; errBox.textContent='Please choose a file first.'; return; }
          errBox.hidden = true;
          withLoading(this, 'Compressing…', function(){
            return new Promise(function(resolve){
              const canvas = document.getElementById('ic-canvas');
              canvas.width = img.width; canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              const quality = parseInt(qSlider.value, 10) / 100;
              const outType = originalType === 'image/png' ? 'image/png' : originalType;
              canvas.toBlob(function(blob){
                if (!blob){ errBox.hidden=false; errBox.textContent='This format could not be compressed by your browser.'; resolve(); return; }
                document.getElementById('ic-after-size').textContent = formatBytes(blob.size) + ' — ' + canvas.width + '×' + canvas.height;
                const reduction = originalSize > 0 ? ((1 - blob.size/originalSize) * 100) : 0;
                document.getElementById('ic-reduction').textContent = reduction > 0
                  ? ('Reduced by ' + reduction.toFixed(1) + '%')
                  : 'This file didn’t get smaller at this quality/format — try a lower quality.';
                canvas.dataset.blobUrl = URL.createObjectURL(blob);
                document.getElementById('ic-download-row').hidden = false;
                resolve();
              }, outType, outType === 'image/png' ? undefined : quality);
            });
          });
        });
        document.getElementById('ic-download').addEventListener('click', function(){
          const canvas = document.getElementById('ic-canvas');
          const url = canvas.dataset.blobUrl;
          if (!url) return;
          const ext = originalType === 'image/png' ? 'png' : (originalType === 'image/webp' ? 'webp' : 'jpg');
          const a = document.createElement('a');
          a.href = url; a.download = 'compressed.' + ext; a.click();
        });
        document.getElementById('ic-reset').addEventListener('click', function(){
          img = null; fileInput.value = '';
          document.getElementById('ic-controls').hidden = true;
          document.getElementById('ic-before-img').src = '';
          const canvas = document.getElementById('ic-canvas');
          canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
        });
      })();`,
    howTo: ['Drag and drop an image, or click to browse.', 'Adjust the quality slider.', 'Click Compress image, compare before/after size, then download.'],
    faq: [
      { q: 'Does PNG compression work the same way as JPG?', a: 'PNG is lossless, so the quality slider mainly affects JPG and WebP output; for PNG, file size reduction comes mainly from re-encoding rather than a lossy quality setting, so gains can be smaller.' },
      { q: 'Is my image uploaded anywhere?', a: 'No. Compression happens locally using your browser’s built-in Canvas API — the image never leaves your device.' }
    ]
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    category: 'image-tools',
    description: 'Resize images to exact dimensions or common presets, with optional aspect-ratio lock, entirely in your browser.',
    keywords: ['image resizer', 'resize image online', 'resize photo dimensions'],
    related: ['image-compressor', 'image-format-converter', 'image-cropper'],
    html: `
      <div class="tool-panel">
        <div class="dropzone" id="ir-drop" tabindex="0" role="button" aria-label="Upload image">
          <input type="file" id="ir-file" accept="image/jpeg,image/png,image/webp" class="visually-hidden">
          <p>Drag &amp; drop an image here, or <span class="link-text">browse files</span></p>
        </div>
        <div id="ir-error" class="alert alert-error" role="alert" hidden></div>
        <div id="ir-controls" hidden>
          <div class="grid-3">
            <div><label class="field-label" for="ir-width">Width (px)</label><input id="ir-width" class="input" type="number"></div>
            <div><label class="field-label" for="ir-height">Height (px)</label><input id="ir-height" class="input" type="number"></div>
            <div><label class="field-label" for="ir-preset">Preset</label>
              <select id="ir-preset" class="select">
                <option value="">Custom</option>
                <option value="1920x1080">1920 × 1080</option>
                <option value="1280x720">1280 × 720</option>
                <option value="800x600">800 × 600</option>
                <option value="512x512">512 × 512</option>
                <option value="1080x1080">1080 × 1080 (square)</option>
              </select>
            </div>
          </div>
          <label class="check"><input type="checkbox" id="ir-lock" checked> Lock aspect ratio</label>
          <label class="field-label" for="ir-quality">Output quality (JPG/WebP): <span id="ir-quality-value">90</span>%</label>
          <input id="ir-quality" type="range" min="10" max="100" value="90" class="range">
          <div class="toolbar">
            <button class="btn btn-primary" id="ir-run" type="button">Resize image</button>
            <button class="btn btn-ghost" id="ir-reset" type="button">Reset</button>
          </div>
          <canvas id="ir-canvas" class="preview-img"></canvas>
          <div class="toolbar" id="ir-download-row" hidden><button class="btn btn-ghost" id="ir-download" type="button">Download resized image</button></div>
        </div>
      </div>`,
    script: `
      (function(){
        let img = null, ratio = 1, originalType = 'image/jpeg';
        const drop = document.getElementById('ir-drop');
        const fileInput = document.getElementById('ir-file');
        const errBox = document.getElementById('ir-error');
        drop.addEventListener('click', () => fileInput.click());
        drop.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') fileInput.click(); });
        ['dragover','dragenter'].forEach(evt => drop.addEventListener(evt, e => { e.preventDefault(); drop.classList.add('dragover'); }));
        ['dragleave','drop'].forEach(evt => drop.addEventListener(evt, e => { e.preventDefault(); drop.classList.remove('dragover'); }));
        drop.addEventListener('drop', e => { if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]); });
        fileInput.addEventListener('change', e => { if (e.target.files[0]) loadFile(e.target.files[0]); });
        function loadFile(file){
          errBox.hidden = true;
          if (!/^image\\/(jpeg|png|webp)$/.test(file.type)){ errBox.hidden=false; errBox.textContent='Please choose a JPG, PNG or WebP image.'; return; }
          originalType = file.type;
          const reader = new FileReader();
          reader.onload = function(e){
            img = new Image();
            img.onload = function(){
              ratio = img.width / img.height;
              document.getElementById('ir-width').value = img.width;
              document.getElementById('ir-height').value = img.height;
              document.getElementById('ir-controls').hidden = false;
              document.getElementById('ir-download-row').hidden = true;
            };
            img.onerror = function(){ errBox.hidden=false; errBox.textContent='This image could not be read.'; };
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
        const widthInput = document.getElementById('ir-width');
        const heightInput = document.getElementById('ir-height');
        widthInput.addEventListener('input', function(){
          if (document.getElementById('ir-lock').checked && ratio) heightInput.value = Math.round(this.value / ratio);
        });
        heightInput.addEventListener('input', function(){
          if (document.getElementById('ir-lock').checked && ratio) widthInput.value = Math.round(this.value * ratio);
        });
        document.getElementById('ir-preset').addEventListener('change', function(){
          if (!this.value) return;
          const [w,h] = this.value.split('x').map(Number);
          widthInput.value = w; heightInput.value = h;
        });
        const qSlider = document.getElementById('ir-quality');
        qSlider.addEventListener('input', () => document.getElementById('ir-quality-value').textContent = qSlider.value);
        document.getElementById('ir-run').addEventListener('click', function(){
          if (!img){ errBox.hidden=false; errBox.textContent='Please choose a file first.'; return; }
          const w = parseInt(widthInput.value,10), h = parseInt(heightInput.value,10);
          if (!w || !h || w<=0 || h<=0){ errBox.hidden=false; errBox.textContent='Enter a valid width and height.'; return; }
          errBox.hidden = true;
          withLoading(this, 'Resizing…', function(){
            return new Promise(function(resolve){
              const canvas = document.getElementById('ir-canvas');
              canvas.width = w; canvas.height = h;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, w, h);
              const quality = parseInt(qSlider.value,10)/100;
              canvas.toBlob(function(blob){
                canvas.dataset.blobUrl = URL.createObjectURL(blob);
                document.getElementById('ir-download-row').hidden = false;
                resolve();
              }, originalType, quality);
            });
          });
        });
        document.getElementById('ir-download').addEventListener('click', function(){
          const canvas = document.getElementById('ir-canvas');
          const url = canvas.dataset.blobUrl;
          if (!url) return;
          const ext = originalType === 'image/png' ? 'png' : (originalType === 'image/webp' ? 'webp' : 'jpg');
          const a = document.createElement('a'); a.href = url; a.download = 'resized.' + ext; a.click();
        });
        document.getElementById('ir-reset').addEventListener('click', function(){
          img = null; fileInput.value='';
          document.getElementById('ir-controls').hidden = true;
          const canvas = document.getElementById('ir-canvas');
          canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
        });
      })();`,
    howTo: ['Upload an image.', 'Enter exact dimensions or pick a preset, with aspect ratio locked or unlocked.', 'Click Resize image and download the result.'],
    faq: [{ q: 'Does resizing reduce file size too?', a: 'Usually yes, since fewer pixels generally means a smaller file, but for precise size control use the Image Compressor after resizing.' }]
  },
  {
    slug: 'image-cropper',
    name: 'Image Cropper',
    category: 'image-tools',
    description: 'Crop images to a free-form selection or common aspect ratios like square, 4:3 and 16:9, directly in your browser.',
    keywords: ['image cropper', 'crop photo online', 'crop image to square'],
    related: ['image-resizer', 'image-compressor', 'image-format-converter'],
    html: `
      <div class="tool-panel">
        <div class="dropzone" id="crop-drop" tabindex="0" role="button" aria-label="Upload image">
          <input type="file" id="crop-file" accept="image/jpeg,image/png,image/webp" class="visually-hidden">
          <p>Drag &amp; drop an image here, or <span class="link-text">browse files</span></p>
        </div>
        <div id="crop-error" class="alert alert-error" role="alert" hidden></div>
        <div id="crop-controls" hidden>
          <div class="toolbar toolbar-wrap">
            <button class="btn btn-ghost" data-ratio="free" type="button">Free</button>
            <button class="btn btn-ghost" data-ratio="1:1" type="button">Square 1:1</button>
            <button class="btn btn-ghost" data-ratio="4:3" type="button">4:3</button>
            <button class="btn btn-ghost" data-ratio="16:9" type="button">16:9</button>
          </div>
          <div class="crop-stage" id="crop-stage">
            <img id="crop-img" alt="Image to crop">
            <div class="crop-box" id="crop-box" hidden>
              <div class="crop-handle" data-handle="se"></div>
            </div>
          </div>
          <p class="hint">Click and drag on the image to draw a crop area, then drag inside it to move, or drag the corner handle to resize.</p>
          <div class="toolbar">
            <button class="btn btn-primary" id="crop-run" type="button">Crop image</button>
            <button class="btn btn-ghost" id="crop-reset" type="button">Reset</button>
          </div>
          <canvas id="crop-canvas" class="preview-img" hidden></canvas>
          <div class="toolbar" id="crop-download-row" hidden><button class="btn btn-ghost" id="crop-download" type="button">Download cropped image</button></div>
        </div>
      </div>`,
    script: `
      (function(){
        let img = null, originalType = 'image/jpeg', ratio = null;
        let box = { x: 40, y: 40, w: 150, h: 150 };
        let dragging = null, dragStart = null;
        const drop = document.getElementById('crop-drop');
        const fileInput = document.getElementById('crop-file');
        const errBox = document.getElementById('crop-error');
        const stage = document.getElementById('crop-stage');
        const imgEl = document.getElementById('crop-img');
        const boxEl = document.getElementById('crop-box');
        drop.addEventListener('click', () => fileInput.click());
        drop.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') fileInput.click(); });
        ['dragover','dragenter'].forEach(evt => drop.addEventListener(evt, e => { e.preventDefault(); drop.classList.add('dragover'); }));
        ['dragleave','drop'].forEach(evt => drop.addEventListener(evt, e => { e.preventDefault(); drop.classList.remove('dragover'); }));
        drop.addEventListener('drop', e => { if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]); });
        fileInput.addEventListener('change', e => { if (e.target.files[0]) loadFile(e.target.files[0]); });
        function loadFile(file){
          errBox.hidden = true;
          if (!/^image\\/(jpeg|png|webp)$/.test(file.type)){ errBox.hidden=false; errBox.textContent='Please choose a JPG, PNG or WebP image.'; return; }
          originalType = file.type;
          const reader = new FileReader();
          reader.onload = function(e){
            img = new Image();
            img.onload = function(){
              imgEl.src = e.target.result;
              document.getElementById('crop-controls').hidden = false;
              document.getElementById('crop-download-row').hidden = true;
              document.getElementById('crop-canvas').hidden = true;
              setTimeout(() => {
                box = { x: stage.clientWidth*0.2, y: stage.clientHeight*0.2, w: stage.clientWidth*0.6, h: stage.clientHeight*0.6 };
                boxEl.hidden = false;
                renderBox();
              }, 50);
            };
            img.onerror = function(){ errBox.hidden=false; errBox.textContent='This image could not be read.'; };
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
        function renderBox(){
          boxEl.style.left = box.x + 'px';
          boxEl.style.top = box.y + 'px';
          boxEl.style.width = box.w + 'px';
          boxEl.style.height = box.h + 'px';
        }
        document.querySelectorAll('[data-ratio]').forEach(btn => btn.addEventListener('click', function(){
          const val = this.dataset.ratio;
          ratio = val === 'free' ? null : val.split(':').map(Number).reduce((a,b)=>a/b) ;
          if (ratio) box.h = box.w / ratio;
          renderBox();
        }));
        stage.addEventListener('mousedown', function(e){
          const rect = stage.getBoundingClientRect();
          const x = e.clientX - rect.left, y = e.clientY - rect.top;
          if (e.target.dataset && e.target.dataset.handle){
            dragging = 'resize'; dragStart = { mouseX: x, mouseY: y, boxX: box.x, boxY: box.y, boxW: box.w, boxH: box.h }; return;
          }
          if (x > box.x && x < box.x+box.w && y > box.y && y < box.y+box.h){
            dragging = 'move'; dragStart = { mouseX: x, mouseY: y, boxX: box.x, boxY: box.y, boxW: box.w, boxH: box.h };
          } else {
            dragging = 'create'; dragStart = { mouseX: x, mouseY: y };
            box = { x, y, w: 1, h: 1 }; boxEl.hidden = false;
          }
        });
        window.addEventListener('mousemove', function(e){
          if (!dragging || !img) return;
          const rect = stage.getBoundingClientRect();
          const x = Math.max(0, Math.min(stage.clientWidth, e.clientX - rect.left));
          const y = Math.max(0, Math.min(stage.clientHeight, e.clientY - rect.top));
          if (dragging === 'create'){
            box.w = Math.max(10, x - dragStart.mouseX);
            box.h = ratio ? box.w / ratio : Math.max(10, y - dragStart.mouseY);
          } else if (dragging === 'move'){
            box.x = Math.max(0, Math.min(stage.clientWidth-box.w, dragStart.boxX + (x-dragStart.mouseX)));
            box.y = Math.max(0, Math.min(stage.clientHeight-box.h, dragStart.boxY + (y-dragStart.mouseY)));
          } else if (dragging === 'resize'){
            box.w = Math.max(10, dragStart.boxW + (x-dragStart.mouseX));
            box.h = ratio ? box.w/ratio : Math.max(10, dragStart.boxH + (y-dragStart.mouseY));
          }
          renderBox();
        });
        window.addEventListener('mouseup', function(){ dragging = null; });
        document.getElementById('crop-run').addEventListener('click', function(){
          if (!img){ errBox.hidden=false; errBox.textContent='Please choose a file first.'; return; }
          errBox.hidden = true;
          withLoading(this, 'Cropping…', function(){
            return new Promise(function(resolve){
              const scaleX = img.naturalWidth / imgEl.clientWidth;
              const scaleY = img.naturalHeight / imgEl.clientHeight;
              const sx = box.x * scaleX, sy = box.y * scaleY, sw = box.w * scaleX, sh = box.h * scaleY;
              const canvas = document.getElementById('crop-canvas');
              canvas.width = Math.round(sw); canvas.height = Math.round(sh);
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
              canvas.hidden = false;
              canvas.toBlob(function(blob){
                canvas.dataset.blobUrl = URL.createObjectURL(blob);
                document.getElementById('crop-download-row').hidden = false;
                resolve();
              }, originalType);
            });
          });
        });
        document.getElementById('crop-download').addEventListener('click', function(){
          const canvas = document.getElementById('crop-canvas');
          const url = canvas.dataset.blobUrl;
          if (!url) return;
          const ext = originalType === 'image/png' ? 'png' : (originalType === 'image/webp' ? 'webp' : 'jpg');
          const a = document.createElement('a'); a.href = url; a.download = 'cropped.' + ext; a.click();
        });
        document.getElementById('crop-reset').addEventListener('click', function(){
          img = null; fileInput.value='';
          document.getElementById('crop-controls').hidden = true;
        });
      })();`,
    howTo: ['Upload an image.', 'Choose a fixed aspect ratio, or Free for any shape.', 'Drag on the image to draw a crop box, adjust it, then click Crop image and download.'],
    faq: [{ q: 'Can I crop to an exact pixel size?', a: 'This tool crops by visually dragging a selection. For an exact final pixel size, crop first, then use the Image Resizer on the result.' }]
  },
  {
    slug: 'image-format-converter',
    name: 'Image Format Converter',
    category: 'image-tools',
    description: 'Convert images between JPG, PNG and WebP formats directly in your browser, based on what your browser can actually encode.',
    keywords: ['image format converter', 'jpg to png', 'png to jpg', 'convert to webp'],
    related: ['image-compressor', 'image-resizer', 'image-cropper'],
    html: `
      <div class="tool-panel">
        <div class="dropzone" id="fc-drop" tabindex="0" role="button" aria-label="Upload image">
          <input type="file" id="fc-file" accept="image/jpeg,image/png,image/webp" class="visually-hidden">
          <p>Drag &amp; drop an image here, or <span class="link-text">browse files</span></p>
        </div>
        <div id="fc-error" class="alert alert-error" role="alert" hidden></div>
        <div id="fc-controls" hidden>
          <label class="field-label" for="fc-format">Convert to</label>
          <select id="fc-format" class="select">
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </select>
          <label class="field-label" for="fc-quality">Quality (JPG/WebP): <span id="fc-quality-value">90</span>%</label>
          <input id="fc-quality" type="range" min="10" max="100" value="90" class="range">
          <div class="toolbar">
            <button class="btn btn-primary" id="fc-run" type="button">Convert</button>
            <button class="btn btn-ghost" id="fc-reset" type="button">Reset</button>
          </div>
          <canvas id="fc-canvas" class="preview-img" hidden></canvas>
          <div class="toolbar" id="fc-download-row" hidden><button class="btn btn-ghost" id="fc-download" type="button">Download converted image</button></div>
        </div>
      </div>`,
    script: `
      (function(){
        let img = null;
        const drop = document.getElementById('fc-drop');
        const fileInput = document.getElementById('fc-file');
        const errBox = document.getElementById('fc-error');
        drop.addEventListener('click', () => fileInput.click());
        drop.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') fileInput.click(); });
        ['dragover','dragenter'].forEach(evt => drop.addEventListener(evt, e => { e.preventDefault(); drop.classList.add('dragover'); }));
        ['dragleave','drop'].forEach(evt => drop.addEventListener(evt, e => { e.preventDefault(); drop.classList.remove('dragover'); }));
        drop.addEventListener('drop', e => { if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]); });
        fileInput.addEventListener('change', e => { if (e.target.files[0]) loadFile(e.target.files[0]); });
        function loadFile(file){
          errBox.hidden = true;
          if (!/^image\\/(jpeg|png|webp)$/.test(file.type)){ errBox.hidden=false; errBox.textContent='Please choose a JPG, PNG or WebP image.'; return; }
          const reader = new FileReader();
          reader.onload = function(e){
            img = new Image();
            img.onload = function(){ document.getElementById('fc-controls').hidden = false; document.getElementById('fc-download-row').hidden = true; };
            img.onerror = function(){ errBox.hidden=false; errBox.textContent='This image could not be read.'; };
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
        const qSlider = document.getElementById('fc-quality');
        qSlider.addEventListener('input', () => document.getElementById('fc-quality-value').textContent = qSlider.value);
        document.getElementById('fc-run').addEventListener('click', function(){
          if (!img){ errBox.hidden=false; errBox.textContent='Please choose a file first.'; return; }
          withLoading(this, 'Converting…', function(){
            return new Promise(function(resolve){
              const format = document.getElementById('fc-format').value;
              const canvas = document.getElementById('fc-canvas');
              canvas.width = img.width; canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              if (format === 'image/jpeg'){ ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,canvas.width,canvas.height); }
              ctx.drawImage(img, 0, 0);
              canvas.hidden = false;
              const quality = parseInt(qSlider.value,10)/100;
              canvas.toBlob(function(blob){
                if (!blob){ errBox.hidden=false; errBox.textContent='Your browser can’t encode this format.'; resolve(); return; }
                errBox.hidden = true;
                canvas.dataset.blobUrl = URL.createObjectURL(blob);
                canvas.dataset.format = format;
                document.getElementById('fc-download-row').hidden = false;
                resolve();
              }, format, format === 'image/png' ? undefined : quality);
            });
          });
        });
        document.getElementById('fc-download').addEventListener('click', function(){
          const canvas = document.getElementById('fc-canvas');
          const url = canvas.dataset.blobUrl;
          if (!url) return;
          const ext = { 'image/jpeg':'jpg', 'image/png':'png', 'image/webp':'webp' }[canvas.dataset.format];
          const a = document.createElement('a'); a.href = url; a.download = 'converted.' + ext; a.click();
        });
        document.getElementById('fc-reset').addEventListener('click', function(){
          img = null; fileInput.value=''; document.getElementById('fc-controls').hidden = true;
        });
      })();`,
    howTo: ['Upload a JPG, PNG or WebP image.', 'Choose the target format and quality.', 'Click Convert and download the result.'],
    faq: [{ q: 'Why might WebP conversion fail?', a: 'A small number of older browsers can’t encode WebP via the Canvas API. If that happens, this tool tells you clearly rather than producing a broken file — try a current version of Chrome, Firefox or Edge.' },
      { q: 'Why does converting to JPG add a white background?', a: 'JPG doesn’t support transparency, so any transparent areas in a PNG are filled with white during conversion.' }]
  }
];
