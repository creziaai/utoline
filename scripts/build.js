#!/usr/bin/env node
/**
 * utoline static site generator.
 * Zero npm dependencies — uses only Node's built-in fs/path modules.
 * Run with: node scripts/build.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

// ---------- Config (from environment, with safe defaults) ----------
const CONFIG = {
  siteName: 'Utoline',
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || '').trim().replace(/\/$/, ''),
  gaId: process.env.NEXT_PUBLIC_GA_ID || '',
  adsenseEnabled: process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true',
  adsensePublisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || '',
  adsenseSlotTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP || '',
  adsenseSlotInContent: process.env.NEXT_PUBLIC_ADSENSE_SLOT_INCONTENT || '',
  adsenseSlotSidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || '',
  adsenseSlotBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM || '',
};

// ---------- Load data ----------
const categories = require(path.join(SRC, 'data/categories.js'));
const toolFiles = [
  'text-tools.js', 'developer-tools.js', 'calculators.js', 'calculators-more.js',
  'converter-tools.js', 'datetime-tools.js', 'seo-tools.js', 'security-tools.js',
  'misc-tools.js', 'audio-tools.js', 'image-tools.js', 'pdf-tools.js'
];
let tools = [];
toolFiles.forEach(f => { tools = tools.concat(require(path.join(SRC, 'data', f))); });

// Validate uniqueness of slugs
const seenSlugs = new Set();
tools.forEach(t => {
  if (seenSlugs.has(t.slug)) throw new Error('Duplicate tool slug: ' + t.slug);
  seenSlugs.add(t.slug);
  if (!categories.find(c => c.slug === t.category)) throw new Error('Unknown category "' + t.category + '" on tool ' + t.slug);
});

const guides = require(path.join(SRC, 'data/guides.js'));
const legal = require(path.join(SRC, 'data/legal.js'));

// Enrich tools with computed fields
const catBySlug = Object.fromEntries(categories.map(c => [c.slug, c]));
tools.forEach(t => {
  t.url = '/tools/' + t.slug + '/';
  t.categoryName = catBySlug[t.category].name;
  t.categoryUrl = '/category/' + t.category + '/';
});
const toolsBySlug = Object.fromEntries(tools.map(t => [t.slug, t]));
categories.forEach(c => { c.tools = tools.filter(t => t.category === c.slug); c.url = '/category/' + c.slug + '/'; });

// ---------- Icons (small inline SVGs, original/simple shapes — no third-party IP) ----------
const ICONS = {
  type: '<path d="M4 5h16M9 5v14m-3 0h6M17 5v6"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-4 4-3-3-5 5"/>',
  'file-text': '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6M9 9h2"/>',
  code: '<path d="M8 4L2 12l6 8M16 4l6 8-6 8"/>',
  calculator: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h1M12 11h1M16 11h1M8 15h1M12 15h1M16 15h1M8 19h1M12 19h1M16 19h1"/>',
  repeat: '<path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
};
function icon(name, size){
  return '<svg width="'+(size||20)+'" height="'+(size||20)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONS[name]||ICONS.grid)+'</svg>';
}

// ---------- HTML helpers ----------
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function absUrl(p){ return CONFIG.siteUrl ? CONFIG.siteUrl.replace(/\/$/,'') + p : p; }

function head({ title, description, canonicalPath, structuredData, extraHead, robots = 'index, follow' }){
  const fullTitle = title.includes(CONFIG.siteName) ? title : title + ' | ' + CONFIG.siteName;
  const canonical = absUrl(canonicalPath);
  const jsonLd = (structuredData || []).map(d => '<script type="application/ld+json">'+JSON.stringify(d)+'</script>').join('\n');
  return `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
${CONFIG.siteUrl ? `<link rel="canonical" href="${canonical}">` : '<!-- Canonical omitted until NEXT_PUBLIC_SITE_URL is configured. -->'}
<meta name="robots" content="${esc(robots)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
${CONFIG.siteUrl ? `<meta property="og:url" content="${canonical}">` : ''}
<meta property="og:site_name" content="${esc(CONFIG.siteName)}">
<meta property="og:image" content="${absUrl('/og-image.svg')}">
<meta name="twitter:image" content="${absUrl('/og-image.svg')}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/style.css">
<script src="/assets/js/config.js"></script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7649325847673531" crossorigin="anonymous"></script>
${jsonLd}
${extraHead || ''}`;
}

function headerHtml(){
  const navLinks = [
    ['/tools/', 'Tools'], ['/categories/', 'Categories'], ['/guides/', 'Guides'], ['/about/', 'About'], ['/contact/', 'Contact']
  ];
  return `
<a href="#main-content" class="skip-link">Skip to content</a>
<header class="site-header">
  <div class="container">
    <a href="/" class="logo" aria-label="Utoline home"><img src="/logo.svg" alt="Utoline" width="136" height="34"></a>
    <nav class="main-nav" aria-label="Primary">
      ${navLinks.map(([href,label]) => `<a href="${href}">${label}</a>`).join('\n      ')}
    </nav>
    <div class="header-actions">
      <button class="nav-search-trigger" data-search-trigger type="button" aria-label="Search tools"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg><span>Search tools…</span><kbd>⌘K</kbd></button>
      <button class="icon-btn" id="theme-toggle" type="button" aria-label="Toggle dark mode">🌙</button>
      <button class="icon-btn menu-toggle" id="menu-toggle" type="button" aria-label="Open menu">☰</button>
    </div>
  </div>
</header>
<div class="mobile-nav" id="mobile-nav">
  <div class="mobile-nav-panel">
    <button class="mobile-nav-close" id="mobile-nav-close" aria-label="Close menu">×</button>
    <nav aria-label="Mobile">
      ${navLinks.map(([href,label]) => `<a href="${href}">${label}</a>`).join('\n      ')}
    </nav>
  </div>
</div>
<div class="search-overlay" id="search-overlay" role="dialog" aria-modal="true" aria-label="Search tools">
  <div class="search-panel">
    <div class="search-input-row">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <input id="search-input" type="text" placeholder="Search tools by name, category or keyword…" aria-label="Search tools" autocomplete="off">
      <button class="icon-btn" id="search-close" type="button" aria-label="Close search">×</button>
    </div>
    <div class="search-results" id="search-results" role="listbox"></div>
  </div>
</div>`;
}

function footerHtml(){
  const popular = tools.slice(0, 6);
  return `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-col footer-brand">
        <a href="/" class="logo" aria-label="Utoline home"><img src="/logo.svg" alt="Utoline" width="136" height="34"></a>
        <p>Free, fast and privacy-friendly online tools for text, images, developers, PDFs, calculators and more — no signup required.</p>
      </div>
      <div class="footer-col">
        <h4>Popular Tools</h4>
        ${popular.map(t => `<a href="${t.url}">${esc(t.name)}</a>`).join('\n        ')}
      </div>
      <div class="footer-col">
        <h4>Categories</h4>
        ${categories.slice(0,6).map(c => `<a href="${c.url}">${esc(c.name)}</a>`).join('\n        ')}
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="/about/">About</a>
        <a href="/contact/">Contact</a>
        <a href="/privacy/">Privacy Policy</a>
        <a href="/terms/">Terms of Use</a>
                <a href="/disclaimer/">Disclaimer</a>
        <a href="/cookies/">Cookie Policy</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} ${esc(CONFIG.siteName)}. All tools run in your browser.</span>
    </div>
  </div>
</footer>`;
}

function adSlot(kind){
  // Renders an empty, clearly-labeled container. No ad code is injected unless
  // NEXT_PUBLIC_ADSENSE_ENABLED=true and publisher/slot IDs are configured.
  if (!CONFIG.adsenseEnabled || !CONFIG.adsensePublisherId) return '';
  const slotMap = { top: CONFIG.adsenseSlotTop, incontent: CONFIG.adsenseSlotInContent, sidebar: CONFIG.adsenseSlotSidebar, bottom: CONFIG.adsenseSlotBottom };
  const slot = slotMap[kind];
  if (!slot) return '';
  return `
<div class="ad-slot ad-slot-${kind}">
  <div class="ad-slot-label">Advertisement</div>
  <ins class="adsbygoogle" style="display:block" data-ad-client="${esc(CONFIG.adsensePublisherId)}" data-ad-slot="${esc(slot)}" data-ad-format="auto" data-full-width-responsive="true"></ins>
</div>`;
}

function toolsIndexScript(){
  const minimal = tools.map(t => ({ name: t.name, url: t.url, category: t.category, categoryName: t.categoryName, description: t.description, keywords: t.keywords || [] }));
  return 'window.utoline_TOOLS = ' + JSON.stringify(minimal) + ';';
}

function externalLibTag(tool){
  if (!tool.usesExternalLib) return '';
  if (tool.usesExternalLib === 'pdf-lib') return '<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>';
  if (tool.usesExternalLib === 'qrcode') return '<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>';
  return '';
}

function layout({ title, description, canonicalPath, bodyHtml, structuredData, bodyAttrs, extraHead, extraFooterScripts }){
  return `<!DOCTYPE html>
<html lang="en">
<head>
${head({ title, description, canonicalPath, structuredData, extraHead, robots: canonicalPath === '/404.html' ? 'noindex' : 'index, follow' })}
</head>
<body ${bodyAttrs || ''}>
${headerHtml()}
<main id="main-content">
${bodyHtml}
</main>
${footerHtml()}
<script>${toolsIndexScript()}</script>
<script src="/assets/js/main.js"></script>
${extraFooterScripts || ''}
</body>
</html>`;
}

function faqBlock(faq){
  if (!faq || !faq.length) return '';
  return `
<section class="section faq-section">
  <h2>Frequently asked questions</h2>
  ${faq.map(f => `<details class="faq-item"><summary>${esc(f.q)}</summary><p>${f.a}</p></details>`).join('\n  ')}
</section>`;
}

function faqSchema(faq, url){
  if (!faq || !faq.length) return null;
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g,'') } }))
  };
}

function breadcrumbSchema(items){
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i+1, name: it.name, item: absUrl(it.url) }))
  };
}

function relatedToolsBlock(relatedSlugs, currentSlug){
  const selected = (relatedSlugs || []).map(s => toolsBySlug[s]).filter(t => t && t.slug !== currentSlug);
  const current = toolsBySlug[currentSlug];
  if (current && selected.length < 4) {
    const fallback = tools.filter(t => t.slug !== currentSlug && t.category === current.category && !selected.some(x => x.slug === t.slug));
    selected.push(...fallback);
  }
  if (current && selected.length < 4) {
    const fallback = tools.filter(t => t.slug !== currentSlug && !selected.some(x => x.slug === t.slug));
    selected.push(...fallback);
  }
  const related = selected.slice(0,6);
  if (!related.length) return '';
  return `
<section class="section related-section">
  <h2>Related tools</h2>
  <div class="related-grid">
    ${related.map(t => toolCardHtml(t)).join('\n    ')}
  </div>
</section>`;
}

function toolCardHtml(t){
  const cat = catBySlug[t.category];
  return `<a class="tool-card" href="${t.url}" style="--cat-color:${cat.color}">
    <div class="tool-card-icon">${icon(cat.icon, 20)}</div>
    <h3>${esc(t.name)}</h3>
    <p>${esc(t.description)}</p>
    <span class="tool-card-cat">${esc(t.categoryName)}</span>
  </a>`;
}

function categoryCardHtml(c){
  return `<a class="category-card" href="${c.url}" style="--cat-color:${c.color}">
    <div class="category-card-icon">${icon(c.icon, 24)}</div>
    <h3>${esc(c.name)}</h3>
    <p>${esc(c.description)}</p>
    <span class="count">${c.tools.length} tool${c.tools.length===1?'':'s'}</span>
  </a>`;
}

function breadcrumbHtml(items){
  return `<nav class="breadcrumb" aria-label="Breadcrumb">
    ${items.map((it, i) => i === items.length-1 ? `<span>${esc(it.name)}</span>` : `<a href="${it.url}">${esc(it.name)}</a> / `).join('')}
  </nav>`;
}

// ---------- File writing helpers ----------
function writeFile(relPath, content){
  const full = path.join(DIST, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
}
function copyDir(src, dest){
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })){
    const s = path.join(src, entry.name), d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// ---------- Page builders ----------
const allPages = []; // for sitemap: { url, priority, changefreq }

function registerPage(url, priority, changefreq){
  allPages.push({ url, priority, changefreq });
}

function buildHomepage(){
  const popular = tools.slice(0, 8);
  const recent = tools.slice(-8).reverse();
  const bodyHtml = `
<section class="hero container">
  <span class="hero-badge"><span class="dot"></span> ${tools.length} free tools · no signup · runs in your browser</span>
  <h1>Free Online Tools for Everyday Tasks</h1>
  <p class="lede">Fast, simple and privacy-friendly tools for text, images, developers, PDFs, calculators and more.</p>
  <form class="hero-search" id="home-search-form" role="search" onsubmit="return false;">
    <input type="text" placeholder="Search tools… (e.g. json, word count, resize image)" id="home-search-input" aria-label="Search tools">
    <button class="btn btn-primary" type="button" data-search-trigger>Search</button>
  </form>
  <div id="home-search-results" class="home-search-results" role="region" aria-live="polite" aria-label="Tool search results" hidden></div>
  <div class="hero-cta">
    <a class="btn btn-primary btn-lg" href="/tools/">Explore All Tools</a>
    <a class="btn btn-ghost btn-lg" href="/categories/">Browse by Category</a>
  </div>
  <div class="trust-bar">
    <div class="trust-item"><div class="trust-value">${tools.length}</div><div class="trust-label">Free tools</div></div>
    <div class="trust-item"><div class="trust-value">${categories.length}</div><div class="trust-label">Categories</div></div>
    <div class="trust-item"><div class="trust-value">0</div><div class="trust-label">Signups required</div></div>
    <div class="trust-item"><div class="trust-value">100%</div><div class="trust-label">Free, always</div></div>
  </div>
</section>

${adSlot('top')}

<section class="section container reveal">
  <div class="section-head"><h2>Popular Tools</h2><a href="/tools/">View all tools →</a></div>
  <div class="tool-grid">${popular.map(toolCardHtml).join('\n')}</div>
</section>

<section class="section container reveal">
  <div class="section-head"><h2>Browse by Category</h2><a href="/categories/">View all categories →</a></div>
  <div class="category-grid">${categories.map(categoryCardHtml).join('\n')}</div>
</section>

${adSlot('incontent')}

<section class="section container reveal">
  <h2>Why Use Utoline?</h2>
  <div class="benefit-grid">
    <article class="benefit-card"><span class="benefit-icon" aria-hidden="true">↯</span><h3>Simple, focused workflows</h3><p>Get from input to a clear result without a complicated setup.</p></article>
    <article class="benefit-card"><span class="benefit-icon" aria-hidden="true">▦</span><h3>Useful tools in one place</h3><p>Work with text, images, PDFs, calculations, conversions and developer utilities from one collection.</p></article>
    <article class="benefit-card"><span class="benefit-icon" aria-hidden="true">◎</span><h3>Easy to get started</h3><p>Open a tool and begin straight away. No account is required for the tools currently offered.</p></article>
    <article class="benefit-card"><span class="benefit-icon" aria-hidden="true">↗</span><h3>Clear, practical results</h3><p>Tool pages are designed to keep the main task and its output easy to find.</p></article>
  </div>
</section>

<section class="section container reveal">
  <div class="section-head"><h2>Recently Added Tools</h2></div>
  <div class="tool-grid">${recent.map(toolCardHtml).join('\n')}</div>
</section>

<section class="section container reveal">
  <div class="section-head"><h2>Helpful Guides</h2><a href="/guides/">View all guides →</a></div>
  <div class="guide-grid">${guides.slice(0,4).map(g => `<a class="guide-card" href="/guides/${g.slug}/" style="display:block;"><h3>${esc(g.title)}</h3><p>${esc(g.description)}</p></a>`).join('\n')}</div>
</section>

<section class="section container reveal">
  ${faqBlock([
    { q: 'Are these tools really free?', a: 'Yes — every tool on utoline is free to use, with no account, signup or hidden paywall.' },
    { q: 'Is my data uploaded when I use a tool?', a: 'Most tools process your input entirely in your browser using JavaScript, so it is never uploaded to a server. Tools that work differently say so clearly on their page.' },
    { q: 'Do I need to install anything?', a: 'No. Every tool runs directly in your web browser on desktop or mobile.' }
  ])}
</section>
`;
  const structuredData = [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: CONFIG.siteName, ...(CONFIG.siteUrl ? { url: CONFIG.siteUrl, potentialAction: { '@type': 'SearchAction', target: absUrl('/tools/') + '?q={search_term_string}', 'query-input': 'required name=search_term_string' } } : {}) },
    faqSchema([
      { q: 'Are these tools really free?', a: 'Yes — every tool on utoline is free to use, with no account, signup or hidden paywall.' },
      { q: 'Is my data uploaded when I use a tool?', a: 'Most tools process your input entirely in your browser using JavaScript, so it is never uploaded to a server.' }
    ])
  ];
  writeFile('index.html', layout({
    title: 'utoline — Free Online Tools for Everyday Tasks',
    description: 'Fast, simple and privacy-friendly free online tools for text, images, developers, PDFs, calculators and more. No signup required.',
    canonicalPath: '/',
    bodyHtml, structuredData
  }));
  registerPage('/', '1.0', 'weekly');
}

function buildToolsIndex(){
  const bodyHtml = `
<section class="container tool-page-header">
  ${breadcrumbHtml([{name:'Home',url:'/'},{name:'All Tools',url:'/tools/'}])}
  <h1>All Tools</h1>
  <p class="tool-lede">Browse every free tool on utoline — ${tools.length} tools across ${categories.length} categories.</p>
</section>
<section class="section container">
  <div class="tool-grid">${tools.map(toolCardHtml).join('\n')}</div>
</section>`;
  writeFile('tools/index.html', layout({
    title: 'All Free Online Tools',
    description: 'Browse the full directory of ' + tools.length + ' free online tools for text, images, developers, PDFs, calculators, converters and more.',
    canonicalPath: '/tools/',
    bodyHtml
  }));
  registerPage('/tools/', '0.9', 'weekly');
}

function buildCategoriesIndex(){
  const bodyHtml = `
<section class="container tool-page-header">
  ${breadcrumbHtml([{name:'Home',url:'/'},{name:'Categories',url:'/categories/'}])}
  <h1>Tool Categories</h1>
  <p class="tool-lede">Explore tools grouped by category.</p>
</section>
<section class="section container">
  <div class="category-grid">${categories.map(categoryCardHtml).join('\n')}</div>
</section>`;
  writeFile('categories/index.html', layout({
    title: 'Tool Categories',
    description: 'Browse all utoline tool categories: text, image, PDF, developer, calculators, converters, SEO, security, date & time and more.',
    canonicalPath: '/categories/',
    bodyHtml
  }));
  registerPage('/categories/', '0.8', 'monthly');
}

function buildCategoryPages(){
  categories.forEach(c => {
    const bodyHtml = `
<section class="container tool-page-header" style="--cat-color:${c.color}">
  ${breadcrumbHtml([{name:'Home',url:'/'},{name:'Categories',url:'/categories/'},{name:c.name,url:c.url}])}
  <span class="cat-pill">${icon(c.icon, 14)} ${esc(c.name)}</span>
  <h1>${esc(c.name)}</h1>
  <p class="tool-lede">${esc(c.description)}</p>
</section>
${adSlot('top')}
<section class="section container reveal">
  <div class="tool-grid">${c.tools.map(toolCardHtml).join('\n')}</div>
</section>`;
    const structuredData = [breadcrumbSchema([{name:'Home',url:'/'},{name:'Categories',url:'/categories/'},{name:c.name,url:c.url}])];
    writeFile('category/' + c.slug + '/index.html', layout({
      title: c.name + ' — Free Online Tools',
      description: c.description + ' ' + c.tools.length + ' free tools available, no signup required.',
      canonicalPath: c.url,
      bodyHtml, structuredData
    }));
    registerPage(c.url, '0.8', 'weekly');
  });
}

function buildToolPages(){
  tools.forEach(t => {
    const cat = catBySlug[t.category];
    const breadcrumbItems = [{name:'Home',url:'/'},{name:cat.name,url:cat.url},{name:t.name,url:t.url}];
    const bodyHtml = `
<section class="container tool-page-header" style="--cat-color:${cat.color}">
  ${breadcrumbHtml(breadcrumbItems)}
  <span class="cat-pill">${icon(cat.icon, 14)} ${esc(cat.name)}</span>
  <h1>${esc(t.name)}</h1>
  <p class="tool-lede">${esc(t.description)}</p>
</section>
<section class="container" style="--cat-color:${cat.color}">
  ${t.html}
  <section class="tool-completion" data-tool-completion hidden aria-live="polite" aria-atomic="true" data-state="ready">
    <div class="tool-completion-heading"><span class="tool-completion-mark" aria-hidden="true">✓</span><h2 data-completion-status>Operation Completed Successfully</h2></div>
    <p data-completion-message></p><div class="tool-completion-result" data-completion-result></div><p class="tool-completion-conclusion" data-completion-conclusion></p>
    <div class="toolbar toolbar-wrap" data-completion-actions hidden><button class="btn btn-primary" type="button" data-completion-copy>Copy result</button></div>
  </section>
</section>
${adSlot('incontent')}
<section class="section container prose reveal">
  <h2>How to use ${esc(t.name)}</h2>
  <ol class="howto-list">${(t.howTo||[]).map(step => `<li>${step}</li>`).join('')}</ol>
</section>
${relatedToolsBlock(t.related, t.slug)}
<section class="container reveal">${faqBlock(t.faq)}</section>
`;
    const structuredData = [
      breadcrumbSchema(breadcrumbItems),
      { '@context': 'https://schema.org', '@type': 'WebApplication', name: t.name, description: t.description, url: absUrl(t.url), applicationCategory: 'UtilityApplication', operatingSystem: 'Any (runs in web browser)', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
      faqSchema(t.faq, t.url)
    ].filter(Boolean);
    writeFile('tools/' + t.slug + '/index.html', layout({
      title: t.name + ' — Free Online Tool',
      description: t.description,
      canonicalPath: t.url,
      bodyHtml, structuredData,
      bodyAttrs: `data-tool-slug="${t.slug}" data-tool-category="${t.category}"`,
      extraFooterScripts: (externalLibTag(t) ? externalLibTag(t) + '\n' : '') + '<script>' + t.script + '</script><script src="/assets/js/tool-completion.js"></script>'
    }));
    registerPage(t.url, '0.9', 'monthly');
  });
}

function buildGuidesIndex(){
  const bodyHtml = `
<section class="container tool-page-header">
  ${breadcrumbHtml([{name:'Home',url:'/'},{name:'Guides',url:'/guides/'}])}
  <h1>Guides</h1>
  <p class="tool-lede">Practical, plain-English explainers to go along with our tools.</p>
</section>
<section class="section container">
  <div class="guide-grid">${guides.map(g => `<a class="guide-card" href="/guides/${g.slug}/" style="display:block;"><h3>${esc(g.title)}</h3><p>${esc(g.description)}</p></a>`).join('\n')}</div>
</section>`;
  writeFile('guides/index.html', layout({
    title: 'Guides & How-Tos',
    description: 'Plain-English guides on JSON, image compression, percentages, Unix timestamps, QR codes and more.',
    canonicalPath: '/guides/',
    bodyHtml
  }));
  registerPage('/guides/', '0.7', 'monthly');
}

function buildGuidePages(){
  guides.forEach(g => {
    const breadcrumbItems = [{name:'Home',url:'/'},{name:'Guides',url:'/guides/'},{name:g.title,url:'/guides/'+g.slug+'/'}];
    const relatedTools = (g.related || []).map(s => toolsBySlug[s]).filter(Boolean);
    const bodyHtml = `
<section class="container tool-page-header">
  ${breadcrumbHtml(breadcrumbItems)}
  <h1>${esc(g.title)}</h1>
</section>
<section class="section container prose">${g.body}</section>
${relatedTools.length ? `<section class="section container"><h2>Related tools</h2><div class="related-grid">${relatedTools.map(toolCardHtml).join('')}</div></section>` : ''}`;
    writeFile('guides/' + g.slug + '/index.html', layout({
      title: g.title,
      description: g.description,
      canonicalPath: '/guides/' + g.slug + '/',
      bodyHtml,
      structuredData: [breadcrumbSchema(breadcrumbItems)]
    }));
    registerPage('/guides/' + g.slug + '/', '0.6', 'yearly');
  });
}

function buildStaticPage(slug, content, priority){
  const bodyHtml = `
<section class="container tool-page-header">
  ${breadcrumbHtml([{name:'Home',url:'/'},{name:content.title,url:'/'+slug+'/'}])}
  <h1>${esc(content.title)}</h1>
</section>
<section class="section container prose">${content.body}</section>`;
  writeFile(slug + '/index.html', layout({
    title: content.title,
    description: content.description,
    canonicalPath: '/' + slug + '/',
    bodyHtml
  }));
  registerPage('/' + slug + '/', priority || '0.5', 'yearly');
}

function build404(){
  const bodyHtml = `
<section class="container error-page">
  <div class="code">404</div>
  <h1>Page not found</h1>
  <p>The page you’re looking for doesn’t exist or may have moved.</p>
  <a class="btn btn-primary" href="/">Go to homepage</a>
  <a class="btn btn-ghost" href="/tools/">Browse all tools</a>
</section>`;
  writeFile('404.html', layout({
    title: 'Page Not Found',
    description: 'The page you are looking for could not be found.',
    canonicalPath: '/404.html',
    bodyHtml
  }));
}

function buildSitemap(){
  const today = new Date().toISOString().slice(0,10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${CONFIG.siteUrl ? allPages.map(p => `  <url>\n    <loc>${absUrl(p.url)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`).join('\n') : ''}\n</urlset>`;
  writeFile('sitemap.xml', xml);
}

function buildRobots(){
  const txt = `User-agent: *
Allow: /

Sitemap: ${absUrl('/sitemap.xml')}
`;
  writeFile('robots.txt', txt);
}

function buildFavicon(){
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="#29265f"/><path d="M7 7v11a9 9 0 0 0 18 0V7" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><path d="M12 7v11a4 4 0 0 0 8 0V7" fill="none" stroke="#a9a5ff" stroke-width="1.8" stroke-linecap="round"/></svg>`;
  writeFile('favicon.svg', svg);
  fs.copyFileSync(path.join(SRC, 'assets/logo.svg'), path.join(DIST, 'logo.svg'));
  writeFile('og-image.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#f7f7fc"/><circle cx="1010" cy="80" r="280" fill="#e8e7ff"/><circle cx="1100" cy="600" r="260" fill="#e2f5f1"/><rect x="90" y="130" width="88" height="88" rx="24" fill="#29265f"/><path d="M112 151v29a22 22 0 0 0 44 0v-29" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/><path d="M125 151v29a9 9 0 0 0 18 0v-29" fill="none" stroke="#a9a5ff" stroke-width="4" stroke-linecap="round"/><text x="200" y="195" font-family="Arial,sans-serif" font-size="62" font-weight="700" fill="#17172c">utoline</text><text x="90" y="330" font-family="Arial,sans-serif" font-size="54" font-weight="700" fill="#17172c">Useful Tools. One Online Destination.</text><text x="90" y="398" font-family="Arial,sans-serif" font-size="30" fill="#565a6e">Text · Images · PDFs · Calculators · Developer tools</text><text x="90" y="520" font-family="Arial,sans-serif" font-size="24" fill="#4f46e5">utoline</text></svg>`);
}

function buildConfigJs(){
  const template = fs.readFileSync(path.join(SRC, 'assets/js/config.template.js'), 'utf8');
  const out = template
    .replace('__GA_ID__', CONFIG.gaId)
    .replace('__ADSENSE_ENABLED__', CONFIG.adsenseEnabled ? 'true' : 'false')
    .replace('__ADSENSE_PUBLISHER_ID__', CONFIG.adsensePublisherId)
    .replace('__SITE_URL__', CONFIG.siteUrl);
  writeFile('assets/js/config.js', out);
}

// ---------- Run build ----------
function build(){
  if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true, force: true });
    fs.mkdirSync(DIST, { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'scripts/ads.txt'), path.join(DIST, 'ads.txt'));

  copyDir(path.join(SRC, 'assets/css'), path.join(DIST, 'assets/css'));
  fs.mkdirSync(path.join(DIST, 'assets/js'), { recursive: true });
  fs.copyFileSync(path.join(SRC, 'assets/js/main.js'), path.join(DIST, 'assets/js/main.js'));
  fs.copyFileSync(path.join(SRC, 'assets/js/tool-completion.js'), path.join(DIST, 'assets/js/tool-completion.js'));
  buildConfigJs();
  buildFavicon();

  buildHomepage();
  buildToolsIndex();
  buildCategoriesIndex();
  buildCategoryPages();
  buildToolPages();
  buildGuidesIndex();
  buildGuidePages();
  buildStaticPage('about', legal.about, '0.5');
  buildStaticPage('contact', legal.contact, '0.5');
  buildStaticPage('privacy', legal.privacy, '0.3');
  buildStaticPage('terms', legal.terms, '0.3');
  buildStaticPage('acknowledgements', legal.acknowledgements, '0.2');
  buildStaticPage('disclaimer', legal.disclaimer, '0.3');
  buildStaticPage('cookies', legal.cookies, '0.3');
  build404();
  buildSitemap();
  buildRobots();

  console.log('Build complete.');
  console.log('  Tools:      ' + tools.length);
  console.log('  Categories: ' + categories.length);
  console.log('  Guides:     ' + guides.length);
  console.log('  Pages:      ' + allPages.length + ' (+ 404, robots.txt, sitemap.xml)');
}

build();

