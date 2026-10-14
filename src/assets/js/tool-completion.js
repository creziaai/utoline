/* utoline shared completion tracker. Success requires a visible result or output artifact
   produced after the user's action; clicking alone never counts as completion. */
(function () {
  'use strict';
  const panel = document.querySelector('.tool-panel');
  const card = document.querySelector('[data-tool-completion]');
  if (!panel || !card) return;

  const slug = document.body.dataset.toolSlug || '';
  const name = document.querySelector('h1')?.textContent?.trim() || 'Tool';
  const status = card.querySelector('[data-completion-status]');
  const message = card.querySelector('[data-completion-message]');
  const conclusion = card.querySelector('[data-completion-conclusion]');
  const resultBox = card.querySelector('[data-completion-result]');
  const actions = card.querySelector('[data-completion-actions]');
  const mark = card.querySelector('.tool-completion-mark');
  let before = '';
  let activeAction = '';
  let actionStarted = 0;
  let checkTimer = 0;
  let lastResult = '';
  let settled = true;

  const textOf = el => (el?.innerText || el?.textContent || '').replace(/\s+/g, ' ').trim();
  const visible = el => !!el && !el.hidden && el.getAttribute('aria-hidden') !== 'true' && !!el.getClientRects().length;
  const excluded = /^(reset|clear|copy(?: result)?|download(?: result)?|stop|close|cancel|back|return|retest|test again|run again|remove|delete)$/i;

  function outputNodes() {
    return [...panel.querySelectorAll(
      '[id$="-result"],[id*="-result-"],[id$="-output"],[id*="-output-"],output,[role="status"],.result-box,.result-content,.result-card,.highlight-box,.stats-grid,pre,code,img,a[download],.alert-success,.alert-error,[data-result]'
    )].filter(visible);
  }
  function errorText() {
    const nodes = [...panel.querySelectorAll('.alert-error,[role="alert"],.error,.field-error,.invalid-feedback,[aria-invalid="true"]')].filter(visible);
    const found = nodes.map(textOf).find(Boolean);
    if (found) return found;
    const alert = [...panel.querySelectorAll('.alert')].filter(visible).map(textOf).find(t => /invalid|error|failed|unable|must be|enter a valid|required|please select|not supported|permission denied/i.test(t));
    return alert || '';
  }
  function captureOutput() {
    const chunks = [];
    for (const el of outputNodes()) {
      let value = textOf(el);
      if (!value && 'value' in el) value = String(el.value || '').trim();
      if (el.tagName === 'IMG') value = `Preview: ${el.alt || 'generated image'}`;
      if (el.tagName === 'A' && el.hasAttribute('download')) value = `Download ready: ${el.getAttribute('download') || 'generated file'}`;
      if (value && value.length < 12000 && !chunks.includes(value)) chunks.push(value);
      if (chunks.join('\n\n').length > 7000) break;
    }
    // Some tools render their result into a visible container without conventional classes.
    if (!chunks.length) {
      const candidates = [...panel.querySelectorAll('div,p,span,textarea')].filter(visible).filter(el => {
        if (el.closest('button,label,.hint,.tool-actions,.toolbar')) return false;
        if (el.matches('div,p,span') && el.children.length > 8) return false;
        const t = ('value' in el ? String(el.value || '') : textOf(el)).trim();
        return t.length >= 2 && t.length <= 4000 && (el.matches('textarea,[aria-live]') || /result|output|preview|generated|converted|cleaned|total|answer|count|formatted|success/i.test(`${el.id} ${el.className} ${el.getAttribute('aria-label') || ''}`));
      });
      candidates.forEach(el => { const t = ('value' in el ? String(el.value || '') : textOf(el)).trim(); if (t && !chunks.includes(t)) chunks.push(t); });
    }
    return chunks.join('\n\n').slice(0, 8000);
  }
  function artifactExists() {
    const media = [...panel.querySelectorAll('img,a[download]')].some(el => visible(el) && (el.tagName !== 'IMG' || (el.complete && el.naturalWidth > 0)) && (el.tagName !== 'A' || !!el.href));
    const generatedFile = [...panel.querySelectorAll('[data-url]')].some(el => visible(el) && /^blob:|^https?:/.test(el.dataset.url || ''));
    const visibleResult = [...panel.querySelectorAll('[id$="-download-row"]')].some(visible);
    return media || generatedFile || visibleResult;
  }
  function specificMessage() {
    if (/word-counter|character-counter|sentence-counter/.test(slug)) return 'Your text counts have been updated from the current input.';
    if (/clean|remove-duplicate|case-converter|text/.test(slug)) return 'Your text operation finished and the resulting text is displayed below.';
    if (/calculator|countdown|date-difference|age-calculator|converter|timestamp|timezone|unit-converter/.test(slug)) return 'Your calculation or conversion finished. Review the result values below.';
    if (/json/.test(slug)) return 'Your JSON operation finished. The formatted output or validation feedback is shown below.';
    if (/password|uuid|random|lorem|generator|meta-tag|robots-txt|sitemap/.test(slug)) return 'Your generated output is ready to review and use.';
    if (/qr-code/.test(slug)) return 'Your QR code was generated and the preview is shown below.';
    if (/image/.test(slug)) return 'Your image operation finished. Review the preview and download the output if available.';
    if (/pdf/.test(slug)) return 'Your PDF operation finished. Check the output file and download it if available.';
    if (/microphone/.test(slug)) return 'The microphone test has ended. The detected input and final status are shown below.';
    if (/seo|meta|og-/.test(slug)) return 'Your SEO content was generated from the current settings and is displayed below.';
    return `${name} finished and produced a result from your latest action.`;
  }
  function specificConclusion() {
    if (/calculator|countdown|date-difference|age-calculator|converter|timestamp|timezone/.test(slug)) return 'Conclusion: The latest calculation or conversion result is displayed above and ready to use.';
    if (/word-counter|character-counter|sentence-counter/.test(slug)) return 'Conclusion: The counts shown above reflect the text currently entered.';
    if (/clean|remove-duplicate|case-converter|text/.test(slug)) return 'Conclusion: The resulting text is ready to review, copy, or use in your next step.';
    if (/image/.test(slug)) return 'Conclusion: Review the processed image preview and use the available download control to save the output.';
    if (/pdf/.test(slug)) return 'Conclusion: Confirm the resulting PDF is available, then use its download control to save it.';
    if (/microphone/.test(slug)) return 'Conclusion: This status reflects the input detected during the test; it does not imply a successful recording unless input was detected.';
    if (/generator|uuid|password|random|lorem|qr-code|meta-tag|robots-txt|sitemap/.test(slug)) return 'Conclusion: The generated result is shown above. Review it before copying or downloading.';
    if (/json/.test(slug)) return 'Conclusion: Review the formatted JSON above; if validation failed, correct the reported issue before using it.';
    return `Conclusion: ${name} has produced the result shown above. Review it and use the available next action if needed.`;
  }
  function show(state, detail, captured) {
    card.hidden = false;
    card.dataset.state = state;
    if (mark) mark.textContent = state === 'success' ? '✓' : (state === 'error' || state === 'warning') ? '!' : state === 'loading' ? '…' : 'i';
    status.textContent = state === 'success' ? '✓ Operation Completed Successfully' : state === 'warning' ? 'Test Completed — Result Needs Attention' : state === 'error' ? 'Operation Could Not Be Completed' : state === 'loading' ? 'Processing your request…' : 'Ready';
    message.textContent = detail || '';
    resultBox.textContent = (state === 'success' || state === 'warning') ? (captured || '') : '';
    conclusion.textContent = (state === 'success' || state === 'warning') ? specificConclusion() : '';
    actions.hidden = state !== 'success';
    if (state === 'success' || state === 'warning') lastResult = captured || '';
    if ((state === 'success' || state === 'warning') && !captured) resultBox.textContent = 'The tool confirmed that its output is ready. Use the original result or download control in the tool interface above.';
  }
  function clearCompletion() {
    card.hidden = true;
    card.dataset.state = 'ready';
    resultBox.textContent = '';
    conclusion.textContent = '';
    message.textContent = '';
    actions.hidden = true;
    lastResult = '';
  }
  function evaluate() {
    if (settled) return;
    const error = errorText();
    if (error) {
      settled = true;
      show('error', error);
      return;
    }
    const now = captureOutput();
    const changed = now && now !== before;
    if (changed || (artifactExists() && !before)) {
      settled = true;
      show('success', specificMessage(), now || 'An output artifact is available in the tool interface above.');
      return;
    }
    // Wait for real async operations (PDF/image work, microphone permissions, etc.).
    if (Date.now() - actionStarted > 8000) {
      settled = true;
      const latestError = errorText();
      show('error', latestError || 'No new result was detected. Check the inputs and try again. The tool has not been marked as completed.');
      return;
    }
    // Poll for asynchronous completion; the timer never declares success by itself.
    checkTimer = setTimeout(evaluate, 250);
  }
  function scheduleEvaluate() {
    if (settled) return;
    clearTimeout(checkTimer);
    checkTimer = setTimeout(evaluate, 180);
  }

  // Tool handlers can explicitly report outcomes when their real operation settles.
  // This is important for downloads and long-running tools such as microphone testing.
  panel.addEventListener('utoline:operation', function (event) {
    const detail = event.detail || {};
    clearTimeout(checkTimer);
    settled = true;
    if (detail.state === 'success') {
      show('success', detail.message || specificMessage(), detail.result || captureOutput() || 'The tool confirmed its output is ready.');
      if (detail.conclusion) conclusion.textContent = detail.conclusion;
      if (detail.actions === false) actions.hidden = true;
    } else if (detail.state === 'warning') {
      show('warning', detail.message || 'The test ended, but its result needs attention.', detail.result || captureOutput());
      if (detail.conclusion) conclusion.textContent = detail.conclusion;
    } else if (detail.state === 'error') {
      show('error', detail.message || 'The operation failed. No successful result was produced.');
    } else if (detail.state === 'loading') {
      settled = false; actionStarted = Date.now(); before = captureOutput();
      show('loading', detail.message || `${name} is processing your request.`);
    }
  });

  const observer = new MutationObserver(scheduleEvaluate);
  observer.observe(panel, { subtree: true, childList: true, characterData: true, attributes: true });

  panel.addEventListener('click', function (event) {
    const button = event.target.closest('button,input[type="submit"]');
    if (!button || !panel.contains(button)) return;
    const label = textOf(button) || button.value || '';
    // Microphone testing has its own truthful lifecycle and reports completion when stopped.
    if (/microphone/.test(slug)) return;
    if (excluded.test(label) || button.type === 'reset' || button.hasAttribute('data-mode') || button.getAttribute('role') === 'tab') return;
    // Start a new attempt only for likely operation buttons, not arbitrary UI toggles.
    if (/menu|theme|show password|hide password|previous|next|expand|collapse/i.test(label)) return;
    before = captureOutput();
    activeAction = label || 'operation';
    actionStarted = Date.now();
    settled = false;
    clearCompletion();
    show('loading', `${name} is processing your request. Success will be shown only when a result is detected.`);
    scheduleEvaluate();
    clearTimeout(checkTimer);
    checkTimer = setTimeout(evaluate, 300);
  }, true);

  panel.addEventListener('input', function (event) {
    if (!event.target.matches('textarea,input:not([type="file"]),select')) return;
    clearTimeout(checkTimer); settled = true; clearCompletion();
  }, true);
  panel.addEventListener('change', function (event) {
    if (event.target.matches('input[type="file"]')) { clearTimeout(checkTimer); settled = true; clearCompletion(); }
  }, true);
  panel.addEventListener('reset', function () {
    setTimeout(function () { clearCompletion(); settled = true; before = ''; }, 0);
  }, true);

  card.querySelector('[data-completion-copy]')?.addEventListener('click', async function () {
    const text = resultBox.textContent.trim();
    if (!text) { show('error', 'There is no result text available to copy.'); return; }
    try {
      if (typeof copyToClipboard === 'function') copyToClipboard(text, this);
      else if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else throw new Error('Clipboard access is unavailable in this browser context.');
      message.textContent = 'Result copied successfully.';
    } catch (e) { show('error', e.message || 'Copy failed. Select the result text and copy it manually.'); }
  });
  card.querySelector('[data-completion-again]')?.addEventListener('click', function () {
    clearCompletion(); settled = true;
    const first = panel.querySelector('textarea,input:not([type="file"]),select');
    if (first) first.focus();
  });
  clearCompletion();
})();
