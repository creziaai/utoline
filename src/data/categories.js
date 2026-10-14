// Master category list. slug must be unique and match category field on tools.
// Each category has its own accent color so the site reads as a designed system
// rather than one repeated brand gradient everywhere.
module.exports = [
  { slug: 'text-tools', name: 'Text Tools', short: 'Text', description: 'Count, clean, sort and reshape text instantly in your browser.', icon: 'type', color: '#2563eb' },
  { slug: 'image-tools', name: 'Image Tools', short: 'Image', description: 'Compress, resize, crop and convert images without uploading them anywhere.', icon: 'image', color: '#db2777' },
  { slug: 'pdf-tools', name: 'PDF Tools', short: 'PDF', description: 'Merge, split and rotate PDF files directly in your browser.', icon: 'file-text', color: '#e11d48' },
  { slug: 'developer-tools', name: 'Developer Tools', short: 'Developer', description: 'JSON, encoding, hashing and regex utilities for everyday development.', icon: 'code', color: '#7c3aed' },
  { slug: 'calculators', name: 'Calculators', short: 'Calculators', description: 'Percentage, loan, health and everyday calculators with clear formulas.', icon: 'calculator', color: '#d97706' },
  { slug: 'converter-tools', name: 'Converter Tools', short: 'Converters', description: 'Convert length, weight, temperature and data storage units accurately.', icon: 'repeat', color: '#0891b2' },
  { slug: 'seo-tools', name: 'SEO Tools', short: 'SEO', description: 'Generate meta tags, robots.txt and social preview snippets.', icon: 'search', color: '#16a34a' },
  { slug: 'security-tools', name: 'Security & Privacy Tools', short: 'Security', description: 'Generate strong passwords and check strength, entirely on your device.', icon: 'lock', color: '#0f766e' },
  { slug: 'datetime-tools', name: 'Date & Time Tools', short: 'Date & Time', description: 'Calculate date differences, countdowns and time zones.', icon: 'clock', color: '#4f46e5' },
  { slug: 'misc-tools', name: 'Miscellaneous Tools', short: 'Misc', description: 'QR codes, color conversion, random generators and more.', icon: 'grid', color: '#ea580c' },
];
