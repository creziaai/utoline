(function () {
  var root = document.getElementById('mic');
  if (!root) return;
  var $ = function (id) { return document.getElementById(id); };
  var el = {
    state: $('mic-state'), stateText: $('mic-state-text'), device: $('mic-device'), db: $('mic-db'),
    canvas: $('mic-canvas'), idle: $('mic-idle'), meter: $('mic-meter'), fill: $('mic-fill'),
    peak: $('mic-peak'), peakText: $('mic-peak-text'), msg: $('mic-message'),
    start: $('mic-start'), stop: $('mic-stop'), again: $('mic-again')
  };
  var ctx2d = el.canvas.getContext('2d');
  var MIN_DB = -60;
  var stream = null, audioCtx = null, analyser = null, source = null, buf = null;
  var raf = 0, running = false, starting = false, gen = 0;
  var level = 0, peak = 0, peakHoldUntil = 0, peakDb = -Infinity, heardSound = false, startedAt = 0, hintShown = false;
  var shown = [], scale = 1, bytes = null, useFloat = true;          // smoothed waveform points
  var dpr = 1, w = 0, h = 0;

  function setState(s, text) { el.state.setAttribute('data-state', s); el.stateText.textContent = text; }
  function message(kind, title, body) {
    if (!kind) { el.msg.hidden = true; el.msg.textContent = ''; return; }
    el.msg.className = 'mic-message mic-message-' + kind;
    el.msg.innerHTML = '';
    var b = document.createElement('strong'); b.textContent = title;
    el.msg.appendChild(b);
    if (body) { var p = document.createElement('span'); p.textContent = ' ' + body; el.msg.appendChild(p); }
    el.msg.hidden = false;
  }
  function buttons(mode) {
    el.start.hidden = mode !== 'idle';
    el.stop.hidden = mode !== 'running';
    el.again.hidden = mode !== 'done';
    el.start.disabled = el.again.disabled = false;
  }
  function fmtDb(v) { return isFinite(v) ? String(Math.round(v)).replace('-', '−') : '—'; }

  // ---------- canvas ----------
  function resize() {
    var r = el.canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
    el.canvas.width = w * dpr; el.canvas.height = h * dpr;
    ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawFrame();
  }
  function css(name) { return getComputedStyle(root).getPropertyValue(name).trim(); }
  function drawFrame() {
    ctx2d.clearRect(0, 0, w, h);
    var mid = h / 2;
    // baseline
    ctx2d.strokeStyle = css('--color-border'); ctx2d.lineWidth = 1;
    ctx2d.beginPath(); ctx2d.moveTo(0, mid + .5); ctx2d.lineTo(w, mid + .5); ctx2d.stroke();
    var n = shown.length;
    if (!n) return;
    var amp = h * 0.42;
    ctx2d.lineWidth = 2; ctx2d.lineJoin = 'round'; ctx2d.lineCap = 'round';
    ctx2d.strokeStyle = css('--color-primary');
    ctx2d.beginPath();
    for (var i = 0; i < n; i++) {
      var x = (i / (n - 1)) * w, y = mid - shown[i] * amp;
      if (i === 0) ctx2d.moveTo(x, y); else ctx2d.lineTo(x, y);
    }
    ctx2d.stroke();
  }

  // ---------- analysis loop ----------
  function tick(now) {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    var i;
    if (useFloat) analyser.getFloatTimeDomainData(buf);
    else { analyser.getByteTimeDomainData(bytes); for (i = 0; i < bytes.length; i++) buf[i] = (bytes[i] - 128) / 128; }
    var sum = 0;
    for (i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    var rms = Math.sqrt(sum / buf.length);
    var db = rms > 0 ? 20 * Math.log10(rms) : -Infinity;
    var target = Math.max(0, Math.min(1, (Math.max(db, MIN_DB) - MIN_DB) / -MIN_DB));
    // fast attack, slower release
    level += (target - level) * (target > level ? 0.5 : 0.12);
    if (target >= peak) { peak = target; peakHoldUntil = now + 1200; peakDb = Math.max(peakDb, db); }
    else if (now > peakHoldUntil) peak = Math.max(target, peak - 0.012);

    el.fill.style.transform = 'scaleX(' + level.toFixed(3) + ')';
    el.peak.style.transform = 'translateX(' + (peak * (el.meter.clientWidth - 2)).toFixed(1) + 'px)';
    el.db.textContent = fmtDb(db);
    el.peakText.textContent = 'Peak ' + fmtDb(peakDb) + ' dB';
    if (Math.round(now / 250) !== tick.last) {
      tick.last = Math.round(now / 250);
      el.meter.setAttribute('aria-valuenow', String(Math.round(Math.max(db, MIN_DB))));
      el.meter.setAttribute('aria-valuetext', isFinite(db) && db > -50 ? Math.round(db) + ' decibels' : 'Silent');
    }

    // waveform: downsample and smooth toward the live samples
    var pts = Math.max(48, Math.min(160, Math.round(w / 5)));
    if (shown.length !== pts) { shown = new Array(pts); for (i = 0; i < pts; i++) shown[i] = 0; }
    var step = Math.floor(buf.length / pts), j, k, best, a;
    var framePeak = 0;
    for (i = 0; i < buf.length; i++) { a = Math.abs(buf[i]); if (a > framePeak) framePeak = a; }
    // Auto-gain for display only: quiet voices stay visible, loud ones never clip the box.
    scale += ((framePeak > 0.004 ? Math.min(0.9 / framePeak, 12) : scale) - scale) * (framePeak * 12 > scale ? 0.4 : 0.03);
    scale = Math.max(1, Math.min(12, scale));
    for (i = 0; i < pts; i++) {
      best = 0;
      for (j = 0, k = i * step; j < step; j++, k++) if (Math.abs(buf[k]) > Math.abs(best)) best = buf[k];
      var v = Math.max(-1, Math.min(1, best * scale));
      shown[i] += (v - shown[i]) * 0.6;
    }
    drawFrame();

    if (audioCtx.state === 'suspended' && now - startedAt > 1500) { audioCtx.resume(); }
    // status feedback
    if (db > -50 && !heardSound) {
      heardSound = true; hintShown = false;
      setState('ok', 'Microphone is working');
      message(null);
    } else if (!heardSound && !hintShown && now - startedAt > 4000) {
      hintShown = true;
      message('info', 'No sound detected yet.', 'Try speaking or clapping. If the waveform stays flat, check that the microphone is unmuted and the right input is selected.');
    }
  }

  // ---------- lifecycle ----------
  function release() {
    gen++; // invalidate any in-flight start
    running = false;
    if (raf) cancelAnimationFrame(raf); raf = 0;
    if (stream) { stream.getTracks().forEach(function (t) { t.onended = t.onmute = t.onunmute = null; try { t.stop(); } catch (e) {} }); stream = null; }
    try { if (source) source.disconnect(); } catch (e) {}
    source = analyser = buf = null;
    if (audioCtx) { try { audioCtx.close(); } catch (e) {} audioCtx = null; }
  }
  function resetMeters() {
    level = peak = 0; scale = 1; peakDb = -Infinity; shown = [];
    el.fill.style.transform = 'scaleX(0)'; el.peak.style.transform = 'translateX(0)';
    el.db.textContent = fmtDb(-Infinity); el.peakText.textContent = 'Peak ' + fmtDb(-Infinity) + ' dB';
    el.meter.setAttribute('aria-valuenow', String(MIN_DB)); el.meter.setAttribute('aria-valuetext', 'Silent');
    drawFrame();
  }

  function supportProblem() {
    if (!window.isSecureContext) return { t: 'A secure connection is required.', b: 'Browsers only allow microphone access on HTTPS pages (or localhost). Open this page over HTTPS and try again.' };
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return { t: 'This browser can’t access the microphone.', b: 'Try the latest version of Chrome, Edge, Firefox or Safari. In-app browsers inside social or messaging apps often block it — open this page in your main browser.' };
    if (!(window.AudioContext || window.webkitAudioContext)) return { t: 'Web Audio is not supported.', b: 'Please update your browser or try a different one.' };
    return null;
  }
  function explain(err) {
    var n = err && err.name;
    if (n === 'NotAllowedError' || n === 'SecurityError' || n === 'PermissionDeniedError')
      return { t: 'Microphone access was blocked.', b: 'Allow the microphone for this site using the icon beside the address bar (or in your browser’s site settings), then choose Test Again. On iPhone, also check Settings › Safari › Microphone.' };
    if (n === 'NotFoundError' || n === 'DevicesNotFoundError' || n === 'OverconstrainedError')
      return { t: 'No microphone found.', b: 'Connect or enable a microphone, make sure it is not disabled in your system sound settings, and choose Test Again.' };
    if (n === 'NotReadableError' || n === 'TrackStartError' || n === 'AbortError')
      return { t: 'The microphone could not be started.', b: 'Another app or browser tab may be using it. Close other apps that use audio input and try again.' };
    return { t: 'Something went wrong.', b: 'The microphone could not be opened. Please try again.' };
  }

  function reportCompletion(state, detail) {
    root.dispatchEvent(new CustomEvent('utoline:operation', { bubbles: true, detail: detail }));
  }

  function fail(info, stateText) {
    reportCompletion('error', { state: 'error', message: info.t + ' ' + info.b, conclusion: 'Conclusion: The microphone test could not complete successfully. Review the guidance above and try again.' });
    release();
    resetMeters();
    el.idle.hidden = false;
    el.device.textContent = 'No microphone in use';
    setState('error', stateText);
    message('error', info.t, info.b);
    buttons('done');
  }

  function start() {
    if (running || starting) return;
    message(null);
    var problem = supportProblem();
    if (problem) { fail(problem, 'Not supported'); return; }
    starting = true;
    var my = ++gen;
    resetMeters();
    el.start.disabled = el.again.disabled = true;
    // Must be created/resumed inside the user's tap or iOS Safari keeps it suspended.
    try {
      var Ctx0 = window.AudioContext || window.webkitAudioContext;
      audioCtx = new Ctx0();
      if (audioCtx.resume) audioCtx.resume();
    } catch (e) { audioCtx = null; }
    setState('wait', 'Waiting for permission…');
    el.device.textContent = 'Allow microphone access in the browser prompt';

    // Raw input (no processing) gives an honest picture of the hardware.
    navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }, video: false })
      .then(function (s) {
        starting = false;
        if (my !== gen) { s.getTracks().forEach(function (t) { t.stop(); }); return; } // stopped/left while prompt was open
        stream = s;
        if (!audioCtx) { var Ctx = window.AudioContext || window.webkitAudioContext; audioCtx = new Ctx(); }
        if (audioCtx.state === 'suspended' && audioCtx.resume) audioCtx.resume();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048; analyser.smoothingTimeConstant = 0;
        buf = new Float32Array(analyser.fftSize);
        useFloat = typeof analyser.getFloatTimeDomainData === 'function';
        bytes = useFloat ? null : new Uint8Array(analyser.fftSize);
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser); // intentionally NOT connected to destination: no playback, no feedback
        var track = s.getAudioTracks()[0];
        el.device.textContent = (track && track.label) ? track.label : 'Microphone (name not provided by browser)';
        if (track && !track.label && navigator.mediaDevices.enumerateDevices) {
          var id = track.getSettings && track.getSettings().deviceId;
          navigator.mediaDevices.enumerateDevices().then(function (list) {
            var d = list.filter(function (x) { return x.kind === 'audioinput' && x.label && (!id || x.deviceId === id); })[0];
            if (d && my === gen) el.device.textContent = d.label;
          }).catch(function () {});
        }
        if (track) track.onmute = function () {
          if (running) { setState('error', 'Microphone muted'); message('info', 'Your microphone is muted.', 'Check the hardware mute switch or keyboard key, and your system sound settings.'); }
        };
        if (track) track.onunmute = function () {
          if (running) { heardSound = false; hintShown = false; startedAt = performance.now(); setState('live', 'Listening\u2026'); message(null); }
        };
        if (track) track.onended = function () {
          if (!running) return;
          fail({ t: 'The microphone was disconnected.', b: 'Reconnect it and choose Test Again.' }, 'Disconnected');
        };
        running = true; heardSound = false; hintShown = false; startedAt = performance.now();
        el.idle.hidden = true;
        setState('live', 'Listening…');
        buttons('running');
        raf = requestAnimationFrame(tick);
      })
      .catch(function (err) {
        starting = false;
        if (my !== gen) return;
        var info = explain(err);
        fail(info, err && (err.name === 'NotAllowedError' || err.name === 'SecurityError') ? 'Permission blocked' : (err && err.name === 'NotFoundError') ? 'No microphone' : 'Unable to start');
      });
  }

  function stop() {
    if (!running && !starting) return;
    var finalDb = el.db.textContent || '—';
    var finalPeak = el.peakText.textContent || 'Peak — dB';
    var inputWasDetected = heardSound;
    release(); starting = false;
    resetMeters();
    el.idle.hidden = false;
    el.device.textContent = 'Microphone released';
    setState('idle', 'Test stopped');
    var summary = 'Test stopped. Input detected: ' + (inputWasDetected ? 'yes' : 'no') + '. Last live level: ' + finalDb + ' dB; ' + finalPeak + '. The microphone has been released.';
    message(inputWasDetected ? 'success' : 'info', inputWasDetected ? 'Microphone input detected' : 'Test stopped — no clear sound detected', inputWasDetected ? 'Live input was detected during this test.' : 'No clear sound was detected. Try speaking closer to the microphone and test again.');
    buttons('done');
    reportCompletion(inputWasDetected ? 'success' : 'warning', { state: inputWasDetected ? 'success' : 'warning', message: inputWasDetected ? 'Microphone test complete. Live audio input was detected.' : 'Microphone test stopped, but no clear audio input was detected. The microphone is not confirmed working.', result: summary, conclusion: inputWasDetected ? 'Conclusion: The browser received microphone input during this test. The microphone has now been released.' : 'Conclusion: The test ended without confirming audible input. Speak or clap near the microphone and retest before relying on it.', actions: false });
  }

  el.start.addEventListener('click', start);
  el.stop.addEventListener('click', stop);
  el.again.addEventListener('click', function () { release(); starting = false; start(); });

  // Always hand the microphone back when the page goes away.
  window.addEventListener('pagehide', release);
  window.addEventListener('beforeunload', release);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && running) {
      stop();
      message('info', 'Test paused.', 'The microphone was released because the page moved to the background.');
    }
  });
  if (window.ResizeObserver) new ResizeObserver(resize).observe(el.canvas); else window.addEventListener('resize', resize);
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(drawFrame);
  }
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', function () { setTimeout(drawFrame, 0); });

  var early = supportProblem();
  if (early) { message('error', early.t, early.b); el.start.disabled = true; setState('error', 'Not supported'); el.device.textContent = 'Microphone unavailable'; }
  resize();
})();
