module.exports = [
  {
    slug: 'pdf-merge',
    name: 'PDF Merge',
    category: 'pdf-tools',
    description: 'Combine multiple PDF files into a single document, in the order you choose, directly in your browser.',
    keywords: ['merge pdf', 'combine pdf files', 'pdf merger online'],
    related: ['pdf-split', 'pdf-rotate'],
    usesExternalLib: 'pdf-lib',
    html: `
      <div class="tool-panel">
        <p class="hint">Files are combined locally in your browser using the open-source pdf-lib library — nothing is uploaded to a server.</p>
        <div class="dropzone" id="pm-drop" tabindex="0" role="button" aria-label="Upload PDF files">
          <input type="file" id="pm-file" accept="application/pdf" multiple class="visually-hidden">
          <p>Drag &amp; drop PDF files here, or <span class="link-text">browse files</span></p>
        </div>
        <div id="pm-error" class="alert alert-error" role="alert" hidden></div>
        <ul id="pm-list" class="file-list"></ul>
        <div class="toolbar">
          <button class="btn btn-primary" id="pm-run" type="button">Merge PDFs</button>
          <button class="btn btn-ghost" id="pm-reset" type="button">Reset</button>
        </div>
        <div class="toolbar" id="pm-download-row" hidden><button class="btn btn-ghost" id="pm-download" type="button">Download merged.pdf</button></div>
      </div>`,
    script: `
      (function(){
        let files = [];
        const drop = document.getElementById('pm-drop');
        const fileInput = document.getElementById('pm-file');
        const errBox = document.getElementById('pm-error');
        const list = document.getElementById('pm-list');
        drop.addEventListener('click', () => fileInput.click());
        ['dragover','dragenter'].forEach(evt => drop.addEventListener(evt, e => { e.preventDefault(); drop.classList.add('dragover'); }));
        ['dragleave','drop'].forEach(evt => drop.addEventListener(evt, e => { e.preventDefault(); drop.classList.remove('dragover'); }));
        drop.addEventListener('drop', e => { addFiles(e.dataTransfer.files); });
        fileInput.addEventListener('change', e => { addFiles(e.target.files); });
        function addFiles(fileList){
          errBox.hidden = true;
          for (const f of fileList){
            if (f.type !== 'application/pdf'){ errBox.hidden=false; errBox.textContent='Only PDF files are supported.'; continue; }
            files.push(f);
          }
          renderList();
        }
        function renderList(){
          // Build nodes with textContent so user-supplied filenames cannot inject markup.
          list.replaceChildren();
          files.forEach((file, index) => {
            const item = document.createElement('li');
            const name = document.createElement('span');
            name.textContent = (index + 1) + '. ' + file.name;
            item.appendChild(name);
            const controls = document.createElement('span');
            controls.className = 'toolbar';
            const up = document.createElement('button');
            up.type = 'button'; up.className = 'btn btn-ghost'; up.textContent = 'Move up';
            up.setAttribute('aria-label', 'Move ' + file.name + ' up'); up.disabled = index === 0;
            up.addEventListener('click', () => { [files[index - 1], files[index]] = [files[index], files[index - 1]]; renderList(); });
            const down = document.createElement('button');
            down.type = 'button'; down.className = 'btn btn-ghost'; down.textContent = 'Move down';
            down.setAttribute('aria-label', 'Move ' + file.name + ' down'); down.disabled = index === files.length - 1;
            down.addEventListener('click', () => { [files[index], files[index + 1]] = [files[index + 1], files[index]]; renderList(); });
            const remove = document.createElement('button');
            remove.type = 'button'; remove.className = 'btn-remove'; remove.textContent = 'Remove';
            remove.addEventListener('click', () => { files.splice(index, 1); renderList(); });
            controls.append(up, down, remove); item.appendChild(controls); list.appendChild(item);
          });
        }
        document.getElementById('pm-run').addEventListener('click', function(){
          errBox.hidden = true;
          if (files.length < 2){ errBox.hidden=false; errBox.textContent='Add at least two PDF files to merge.'; return; }
          if (typeof PDFLib === 'undefined'){ errBox.hidden=false; errBox.textContent='The PDF engine could not load (check your internet connection) and try again.'; return; }
          withLoading(this, 'Merging…', async function(){
            try {
              const merged = await PDFLib.PDFDocument.create();
              for (const f of files){
                const bytes = await f.arrayBuffer();
                const src = await PDFLib.PDFDocument.load(bytes);
                const pages = await merged.copyPages(src, src.getPageIndices());
                pages.forEach(p => merged.addPage(p));
              }
              const outBytes = await merged.save();
              const blob = new Blob([outBytes], { type: 'application/pdf' });
              const downloadRow = document.getElementById('pm-download-row');
              if (downloadRow.dataset.url) URL.revokeObjectURL(downloadRow.dataset.url);
              downloadRow.dataset.url = URL.createObjectURL(blob);
              document.getElementById('pm-download-row').hidden = false;
              document.getElementById('pm-run').dispatchEvent(new CustomEvent('utoline:operation', { bubbles: true, detail: { state: 'success', message: 'PDF merge completed successfully. Your merged PDF is ready to download.', result: 'Merged PDF file: merged.pdf', conclusion: 'Conclusion: The PDF output was created in your browser. Use the download button above to save the actual file.' } }));
            } catch(e){
              errBox.hidden = false; errBox.textContent = 'Could not merge these files — make sure each one is a valid, unencrypted PDF.';
              document.getElementById('pm-run').dispatchEvent(new CustomEvent('utoline:operation', { bubbles: true, detail: { state: 'error', message: 'Could not merge these files. Check that each PDF is valid and not encrypted.' } }));
            }
          });
        });
        document.getElementById('pm-download').addEventListener('click', function(){
          const url = document.getElementById('pm-download-row').dataset.url;
          if (!url) return;
          const a = document.createElement('a'); a.href = url; a.download = 'merged.pdf'; a.click();
        });
        document.getElementById('pm-reset').addEventListener('click', function(){
          files = []; fileInput.value=''; renderList(); const row = document.getElementById('pm-download-row'); if (row.dataset.url) URL.revokeObjectURL(row.dataset.url); delete row.dataset.url; row.hidden = true;
        });
      })();`,
    howTo: ['Add two or more PDF files.', 'Files are merged in the order shown. To change the order, remove files and add them again in the desired order.', 'Click Merge PDFs and download the combined file.'],
    faq: [{ q: 'Is there a file size or page limit?', a: 'Merging happens in your browser’s memory, so very large PDFs or a large number of files may be limited by your device’s available memory rather than by this tool.' },
      { q: 'Does this work with password-protected PDFs?', a: 'No — encrypted or password-protected PDFs need to be unlocked first before they can be merged.' }]
  },
  {
    slug: 'pdf-split',
    name: 'PDF Split & Page Extractor',
    category: 'pdf-tools',
    description: 'Extract specific pages or page ranges from a PDF into a new document, directly in your browser.',
    keywords: ['split pdf', 'extract pages from pdf', 'pdf page extractor'],
    related: ['pdf-merge', 'pdf-rotate'],
    usesExternalLib: 'pdf-lib',
    html: `
      <div class="tool-panel">
        <p class="hint">Your PDF is processed locally using the open-source pdf-lib library — it is never uploaded anywhere.</p>
        <div class="dropzone" id="ps-drop" tabindex="0" role="button" aria-label="Upload PDF file">
          <input type="file" id="ps-file" accept="application/pdf" class="visually-hidden">
          <p>Drag &amp; drop a PDF here, or <span class="link-text">browse files</span></p>
        </div>
        <div id="ps-error" class="alert alert-error" role="alert" hidden></div>
        <div id="ps-controls" hidden>
          <p class="hint" id="ps-pagecount"></p>
          <label class="field-label" for="ps-range">Pages to extract (e.g. 1-3, 5, 8-10)</label>
          <input id="ps-range" class="input" type="text" placeholder="1-3, 5">
          <div class="toolbar">
            <button class="btn btn-primary" id="ps-run" type="button">Extract pages</button>
            <button class="btn btn-ghost" id="ps-reset" type="button">Reset</button>
          </div>
          <div class="toolbar" id="ps-download-row" hidden><button class="btn btn-ghost" id="ps-download" type="button">Download extracted.pdf</button></div>
        </div>
      </div>`,
    script: `
      (function(){
        let srcBytes = null, pageCount = 0;
        const drop = document.getElementById('ps-drop');
        const fileInput = document.getElementById('ps-file');
        const errBox = document.getElementById('ps-error');
        drop.addEventListener('click', () => fileInput.click());
        ['dragover','dragenter'].forEach(evt => drop.addEventListener(evt, e => { e.preventDefault(); drop.classList.add('dragover'); }));
        ['dragleave','drop'].forEach(evt => drop.addEventListener(evt, e => { e.preventDefault(); drop.classList.remove('dragover'); }));
        drop.addEventListener('drop', e => { if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]); });
        fileInput.addEventListener('change', e => { if (e.target.files[0]) loadFile(e.target.files[0]); });
        async function loadFile(file){
          errBox.hidden = true;
          if (file.type !== 'application/pdf'){ errBox.hidden=false; errBox.textContent='Please choose a PDF file.'; return; }
          if (typeof PDFLib === 'undefined'){ errBox.hidden=false; errBox.textContent='The PDF engine could not load (check your internet connection) and try again.'; return; }
          document.getElementById('ps-controls').hidden = true;
          document.getElementById('ps-pagecount').innerHTML = '<span class="progress-status"><span class="spinner" aria-hidden="true"></span>Reading file…</span>';
          document.getElementById('ps-controls').hidden = false;
          try {
            srcBytes = await file.arrayBuffer();
            const doc = await PDFLib.PDFDocument.load(srcBytes);
            pageCount = doc.getPageCount();
            document.getElementById('ps-pagecount').textContent = 'This PDF has ' + pageCount + ' page' + (pageCount===1?'':'s') + '.';
            document.getElementById('ps-controls').hidden = false;
            document.getElementById('ps-download-row').hidden = true;
          } catch(e){
            errBox.hidden = false; errBox.textContent = 'This doesn’t look like a valid, unencrypted PDF.';
            document.getElementById('ps-controls').hidden = true;
          }
        }
        function parseRanges(str, max){
          const parts = str.split(',').map(s=>s.trim()).filter(Boolean);
          const indices = new Set();
          for (const part of parts){
            const m = part.match(/^(\\d+)(?:-(\\d+))?$/);
            if (!m) return null;
            const start = parseInt(m[1],10), end = m[2] ? parseInt(m[2],10) : start;
            if (start < 1 || end > max || start > end) return null;
            for (let i=start;i<=end;i++) indices.add(i-1);
          }
          return [...indices].sort((a,b)=>a-b);
        }
        document.getElementById('ps-run').addEventListener('click', function(){
          errBox.hidden = true;
          const range = document.getElementById('ps-range').value.trim();
          if (!range){ errBox.hidden=false; errBox.textContent='Enter which pages to extract, e.g. 1-3, 5.'; return; }
          const indices = parseRanges(range, pageCount);
          if (!indices || !indices.length){ errBox.hidden=false; errBox.textContent='Enter valid page numbers within 1–' + pageCount + '.'; return; }
          withLoading(this, 'Extracting…', async function(){
            try {
              const src = await PDFLib.PDFDocument.load(srcBytes);
              const out = await PDFLib.PDFDocument.create();
              const pages = await out.copyPages(src, indices);
              pages.forEach(p => out.addPage(p));
              const outBytes = await out.save();
              const blob = new Blob([outBytes], { type: 'application/pdf' });
              document.getElementById('ps-download-row').dataset.url = URL.createObjectURL(blob);
              document.getElementById('ps-download-row').hidden = false;
              document.getElementById('ps-run').dispatchEvent(new CustomEvent('utoline:operation', { bubbles: true, detail: { state: 'success', message: 'PDF page extraction completed successfully. Your extracted PDF is ready to download.', result: 'Extracted PDF file: extracted.pdf', conclusion: 'Conclusion: The PDF output was created in your browser. Use the download button above to save the actual file.' } }));
            } catch(e){
              errBox.hidden = false; errBox.textContent = 'Could not extract those pages from this file.';
              document.getElementById('ps-run').dispatchEvent(new CustomEvent('utoline:operation', { bubbles: true, detail: { state: 'error', message: 'Could not extract those pages from this file. Check the page range and PDF validity.' } }));
            }
          });
        });
        document.getElementById('ps-download').addEventListener('click', function(){
          const url = document.getElementById('ps-download-row').dataset.url;
          if (!url) return;
          const a = document.createElement('a'); a.href = url; a.download = 'extracted.pdf'; a.click();
        });
        document.getElementById('ps-reset').addEventListener('click', function(){
          srcBytes = null; fileInput.value='';
          document.getElementById('ps-controls').hidden = true;
        });
      })();`,
    howTo: ['Upload a PDF.', 'Enter the page numbers or ranges you want, e.g. "1-3, 5, 8-10".', 'Click Extract pages and download the result as a new PDF.'],
    faq: [{ q: 'Can I extract pages out of order?', a: 'Extracted pages are always output in ascending page-number order, regardless of the order you list ranges in.' }]
  },
  {
    slug: 'pdf-rotate',
    name: 'PDF Rotate',
    category: 'pdf-tools',
    description: 'Rotate all or selected pages of a PDF by 90, 180 or 270 degrees, directly in your browser.',
    keywords: ['rotate pdf', 'pdf rotate pages online', 'fix pdf orientation'],
    related: ['pdf-merge', 'pdf-split'],
    usesExternalLib: 'pdf-lib',
    html: `
      <div class="tool-panel">
        <p class="hint">Your PDF is processed locally using the open-source pdf-lib library — it is never uploaded anywhere.</p>
        <div class="dropzone" id="pr-drop" tabindex="0" role="button" aria-label="Upload PDF file">
          <input type="file" id="pr-file" accept="application/pdf" class="visually-hidden">
          <p>Drag &amp; drop a PDF here, or <span class="link-text">browse files</span></p>
        </div>
        <div id="pr-error" class="alert alert-error" role="alert" hidden></div>
        <div id="pr-controls" hidden>
          <p class="hint" id="pr-pagecount"></p>
          <div class="grid-2">
            <div><label class="field-label" for="pr-pages">Pages (blank = all)</label><input id="pr-pages" class="input" type="text" placeholder="e.g. 1-3, 5"></div>
            <div><label class="field-label" for="pr-angle">Rotate by</label>
              <select id="pr-angle" class="select"><option value="90">90° clockwise</option><option value="180">180°</option><option value="270">270° clockwise (90° counter-clockwise)</option></select>
            </div>
          </div>
          <div class="toolbar">
            <button class="btn btn-primary" id="pr-run" type="button">Rotate PDF</button>
            <button class="btn btn-ghost" id="pr-reset" type="button">Reset</button>
          </div>
          <div class="toolbar" id="pr-download-row" hidden><button class="btn btn-ghost" id="pr-download" type="button">Download rotated.pdf</button></div>
        </div>
      </div>`,
    script: `
      (function(){
        let srcBytes = null, pageCount = 0;
        const drop = document.getElementById('pr-drop');
        const fileInput = document.getElementById('pr-file');
        const errBox = document.getElementById('pr-error');
        drop.addEventListener('click', () => fileInput.click());
        ['dragover','dragenter'].forEach(evt => drop.addEventListener(evt, e => { e.preventDefault(); drop.classList.add('dragover'); }));
        ['dragleave','drop'].forEach(evt => drop.addEventListener(evt, e => { e.preventDefault(); drop.classList.remove('dragover'); }));
        drop.addEventListener('drop', e => { if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]); });
        fileInput.addEventListener('change', e => { if (e.target.files[0]) loadFile(e.target.files[0]); });
        async function loadFile(file){
          errBox.hidden = true;
          if (file.type !== 'application/pdf'){ errBox.hidden=false; errBox.textContent='Please choose a PDF file.'; return; }
          if (typeof PDFLib === 'undefined'){ errBox.hidden=false; errBox.textContent='The PDF engine could not load (check your internet connection) and try again.'; return; }
          document.getElementById('pr-controls').hidden = false;
          document.getElementById('pr-pagecount').innerHTML = '<span class="progress-status"><span class="spinner" aria-hidden="true"></span>Reading file…</span>';
          try {
            srcBytes = await file.arrayBuffer();
            const doc = await PDFLib.PDFDocument.load(srcBytes);
            pageCount = doc.getPageCount();
            document.getElementById('pr-pagecount').textContent = 'This PDF has ' + pageCount + ' page' + (pageCount===1?'':'s') + '.';
            document.getElementById('pr-controls').hidden = false;
            document.getElementById('pr-download-row').hidden = true;
          } catch(e){
            errBox.hidden = false; errBox.textContent = 'This doesn’t look like a valid, unencrypted PDF.';
            document.getElementById('pr-controls').hidden = true;
          }
        }
        function parseRanges(str, max){
          if (!str.trim()) return [...Array(max).keys()];
          const parts = str.split(',').map(s=>s.trim()).filter(Boolean);
          const indices = new Set();
          for (const part of parts){
            const m = part.match(/^(\\d+)(?:-(\\d+))?$/);
            if (!m) return null;
            const start = parseInt(m[1],10), end = m[2] ? parseInt(m[2],10) : start;
            if (start < 1 || end > max || start > end) return null;
            for (let i=start;i<=end;i++) indices.add(i-1);
          }
          return [...indices];
        }
        document.getElementById('pr-run').addEventListener('click', function(){
          errBox.hidden = true;
          const pagesStr = document.getElementById('pr-pages').value.trim();
          const angle = parseInt(document.getElementById('pr-angle').value, 10);
          const indices = parseRanges(pagesStr, pageCount);
          if (!indices || !indices.length){ errBox.hidden=false; errBox.textContent='Enter valid page numbers within 1–' + pageCount + ', or leave blank for all pages.'; return; }
          withLoading(this, 'Rotating…', async function(){
            try {
              const doc = await PDFLib.PDFDocument.load(srcBytes);
              const pages = doc.getPages();
              indices.forEach(i => {
                const page = pages[i];
                const current = page.getRotation().angle;
                page.setRotation(PDFLib.degrees((current + angle) % 360));
              });
              const outBytes = await doc.save();
              const blob = new Blob([outBytes], { type: 'application/pdf' });
              document.getElementById('pr-download-row').dataset.url = URL.createObjectURL(blob);
              document.getElementById('pr-download-row').hidden = false;
              document.getElementById('pr-run').dispatchEvent(new CustomEvent('utoline:operation', { bubbles: true, detail: { state: 'success', message: 'PDF rotation completed successfully. Your rotated PDF is ready to download.', result: 'Rotated PDF file: rotated.pdf', conclusion: 'Conclusion: The PDF output was created in your browser. Use the download button above to save the actual file.' } }));
            } catch(e){
              errBox.hidden = false; errBox.textContent = 'Could not rotate this file.';
              document.getElementById('pr-run').dispatchEvent(new CustomEvent('utoline:operation', { bubbles: true, detail: { state: 'error', message: 'Could not rotate these pages. Check that the PDF is valid and not encrypted.' } }));
            }
          });
        });
        document.getElementById('pr-download').addEventListener('click', function(){
          const url = document.getElementById('pr-download-row').dataset.url;
          if (!url) return;
          const a = document.createElement('a'); a.href = url; a.download = 'rotated.pdf'; a.click();
        });
        document.getElementById('pr-reset').addEventListener('click', function(){
          srcBytes = null; fileInput.value=''; document.getElementById('pr-controls').hidden = true;
        });
      })();`,
    howTo: ['Upload a PDF.', 'Optionally list specific pages (blank rotates all pages).', 'Choose a rotation angle, click Rotate PDF, then download the result.'],
    faq: [{ q: 'Can I rotate different pages by different amounts in one pass?', a: 'Not in a single run — apply one rotation angle to a set of pages, then upload the result again to rotate other pages differently if needed.' }]
  }
];
