/* ===== utoline shared client JS ===== */

/* Theme handling */
(function(){
  const stored = localStorage.getItem('utoline-theme');
  const theme = stored || 'system';
  applyTheme(theme);
  function applyTheme(t){
    if (t === 'system'){
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', t);
    }
  }
  window.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    function currentEffective(){
      const attr = document.documentElement.getAttribute('data-theme');
      if (attr) return attr;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    function updateIcon(){ btn.textContent = currentEffective() === 'dark' ? '☀️' : '🌙'; }
    updateIcon();
    btn.addEventListener('click', function(){
      const next = currentEffective() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('utoline-theme', next);
      updateIcon();
    });
  });
})();

/* Mobile nav */
window.addEventListener('DOMContentLoaded', function(){
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('mobile-nav');
  const close = document.getElementById('mobile-nav-close');
  if (toggle && nav){
    toggle.addEventListener('click', () => { nav.classList.add('open'); });
  }
  if (close && nav){
    close.addEventListener('click', () => nav.classList.remove('open'));
  }
  if (nav){
    nav.addEventListener('click', function(e){ if (e.target === nav) nav.classList.remove('open'); });
  }
});

/* ===== Loading-state helper — used by every tool with a perceptible delay
   (PDF processing, image encoding, hashing, QR rendering) so the user always
   sees that something is happening, never a silent wait. ===== */
function withLoading(btn, label, fn){
  if (!btn) return fn();
  const original = btn.innerHTML;
  btn.disabled = true;
  btn.classList.add('is-loading');
  btn.innerHTML = '<span class="spinner" aria-hidden="true"></span>' + (label || 'Processing…');
  const restore = () => { btn.disabled = false; btn.classList.remove('is-loading'); btn.innerHTML = original; };
  let result;
  try { result = fn(); }
  catch(e){ restore(); throw e; }
  if (result && typeof result.then === 'function'){ return result.finally(restore); }
  restore();
  return result;
}

/* Copy to clipboard helper (used by all tools) */
function copyToClipboard(text, btn){
  if (!text){ return; }
  const done = () => {
    if (btn){
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = original; btn.classList.remove('copied'); }, 1500);
    }
    trackEvent('copy_result', {});
  };
  if (navigator.clipboard && window.isSecureContext){
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}
function fallbackCopy(text, done){
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); done(); } catch(e){ /* no-op */ }
  document.body.removeChild(ta);
}

/* Download helper for generated text content */
function downloadText(text, filename){
  if (!text){ return; }
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  trackEvent('download_result', { filename });
}

/* ===== Analytics (GA4) — loads only if a Measurement ID is configured ===== */
function trackEvent(name, params){
  if (window.gtag) { window.gtag('event', name, params || {}); }
}
window.addEventListener('DOMContentLoaded', function(){
  const gaId = window.utoline_CONFIG && window.utoline_CONFIG.gaId;
  if (!gaId) return;
  const s1 = document.createElement('script');
  s1.async = true;
  s1.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaId;
  document.head.appendChild(s1);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', gaId, { anonymize_ip: true });
});

/* ===== AdSense — loads only if explicitly enabled ===== */
window.addEventListener('DOMContentLoaded', function(){
  const cfg = window.utoline_CONFIG || {};
  if (!cfg.adsenseEnabled || !cfg.adsensePublisherId) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + cfg.adsensePublisherId;
  s.crossOrigin = 'anonymous';
  document.head.appendChild(s);
  document.querySelectorAll('.adsbygoogle').forEach(function(){
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e){}
  });
});

/* ===== Live homepage search: real indexed tools, keyboard and empty states ===== */
window.addEventListener('DOMContentLoaded', function(){
  const input = document.getElementById('home-search-input');
  const form = document.getElementById('home-search-form');
  const output = document.getElementById('home-search-results');
  const tools = window.utoline_TOOLS || [];
  if (!input || !form || !output) return;
  let active = -1;
  function escape(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function render(){
    const q = input.value.trim().toLowerCase();
    active = -1;
    if (!q){ output.hidden = true; output.innerHTML = ''; return; }
    const terms = q.split(/\s+/).filter(Boolean);
    const matches = tools.map(t => {
      const haystack = [t.name,t.category,t.categoryName,t.description,...(t.keywords||[])].join(' ').toLowerCase();
      const score = terms.reduce((n,term) => n + (t.name.toLowerCase().includes(term)?5:0) + (t.categoryName.toLowerCase().includes(term)?3:0) + ((t.keywords||[]).some(k=>k.toLowerCase().includes(term))?2:0) + (t.description.toLowerCase().includes(term)?1:0),0);
      return {t,score,complete:terms.every(term=>haystack.includes(term))};
    }).filter(x=>x.complete && x.score>0).sort((a,b)=>b.score-a.score || a.t.name.localeCompare(b.t.name)).slice(0,8);
    output.hidden = false;
    if (!matches.length){ output.innerHTML = '<div class="home-search-empty">No matching tools. Try a tool name or a keyword such as “image”, “JSON” or “percentage”.</div>'; return; }
    output.innerHTML = '<div class="home-search-list" role="listbox" aria-label="Matching tools">' + matches.map(({t},i)=>'<a class="home-search-result" role="option" href="'+escape(t.url)+'" data-index="'+i+'"><span><strong>'+escape(t.name)+'</strong><small>'+escape(t.categoryName)+'</small></span><span aria-hidden="true">↗</span></a>').join('') + '</div>';
  }
  input.addEventListener('input',render);
  input.addEventListener('keydown',function(e){
    const items=[...output.querySelectorAll('.home-search-result')];
    if (!items.length) return;
    if(e.key==='ArrowDown'){e.preventDefault();active=Math.min(items.length-1,active+1);}
    else if(e.key==='ArrowUp'){e.preventDefault();active=Math.max(0,active-1);}
    else if(e.key==='Enter'){if(active>=0){e.preventDefault();window.location.href=items[active].href;}else if(items.length===1){e.preventDefault();window.location.href=items[0].href;}return;}
    else if(e.key==='Escape'){output.hidden=true;return;}
    else return;
    items.forEach((el,i)=>{el.classList.toggle('active',i===active);el.setAttribute('aria-selected',i===active?'true':'false');});
  });
  form.addEventListener('submit',function(e){e.preventDefault();const first=output.querySelector('.home-search-result');if(first)window.location.href=first.href;else if(input.value.trim())render();});
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){input.focus();input.select();}});
});

/* ===== Global tool search (uses window.utoline_TOOLS injected per-page) ===== */
window.addEventListener('DOMContentLoaded', function(){
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const triggers = document.querySelectorAll('[data-search-trigger]');
  const closeBtn = document.getElementById('search-close');
  if (!overlay || !input || !results) return;
  const tools = window.utoline_TOOLS || [];

  function openSearch(event){
    overlay.classList.add('open');
    const homeInput = document.getElementById('home-search-input');
    input.value = event && event.currentTarget && event.currentTarget.closest('#home-search-form') && homeInput ? homeInput.value : '';
    render(input.value);
    setTimeout(() => input.focus(), 30);
    trackEvent('search', {});
  }
  function closeSearch(){ overlay.classList.remove('open'); }
  triggers.forEach(t => t.addEventListener('click', openSearch));
  if (closeBtn) closeBtn.addEventListener('click', closeSearch);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeSearch(); });
  document.addEventListener('keydown', function(e){
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)){ e.preventDefault(); openSearch(); }
    if (e.key === 'Escape') closeSearch();
  });

  function render(query){
    const q = query.trim().toLowerCase();
    let list = tools;
    if (q){
      list = tools.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.keywords || []).some(k => k.toLowerCase().includes(q)) ||
        t.description.toLowerCase().includes(q)
      );
    }
    list = list.slice(0, 20);
    if (!list.length){
      results.innerHTML = '<p class="search-empty">No tools found' + (q ? ' for "' + escapeHtml(q) + '"' : '') + '.</p>';
      return;
    }
    results.innerHTML = list.map((t,i) => (
      '<a href="' + t.url + '" class="search-result' + (i===0 ? ' active' : '') + '" role="option">' +
      '<span class="search-result-name">' + escapeHtml(t.name) + '</span>' +
      '<span class="search-result-meta"> — ' + escapeHtml(t.categoryName) + '</span>' +
      '</a>'
    )).join('');
  }
  function escapeHtml(s){ return s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }
  input.addEventListener('input', () => render(input.value));
  input.addEventListener('keydown', function(e){
    const items = [...results.querySelectorAll('.search-result')];
    if (!items.length) return;
    let idx = items.findIndex(i => i.classList.contains('active'));
    if (e.key === 'ArrowDown'){ e.preventDefault(); idx = Math.min(items.length-1, idx+1); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); idx = Math.max(0, idx-1); }
    else if (e.key === 'Enter'){ if (items[idx]) window.location.href = items[idx].getAttribute('href'); return; }
    else return;
    items.forEach(i => i.classList.remove('active'));
    items[idx].classList.add('active');
    items[idx].scrollIntoView({ block: 'nearest' });
  });
});

/* Scroll reveal — progressive enhancement only; .reveal is visible by default via CSS
   fallback rules, this just adds a subtle fade/slide-in the first time each section
   enters the viewport. Fully inert if IntersectionObserver isn't supported. */
document.documentElement.classList.add('js');
window.addEventListener('DOMContentLoaded', function(){
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length || !('IntersectionObserver' in window)) return;
  targets.forEach(t => t.classList.add('reveal-armed'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){ entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(t => io.observe(t));
});

/* Track tool_view on tool pages */
window.addEventListener('DOMContentLoaded', function(){
  if (document.body.dataset.toolSlug){
    trackEvent('tool_view', { tool: document.body.dataset.toolSlug });
  }
});
