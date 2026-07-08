/**
 * Sitemap Generator
 * =================
 * 
 * Generates sitemap XML files for all pages and countries.
 * Run with Node.js: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.btwvisa.com';

// Static pages
const staticPages = [
  { loc: '/', priority: 1.0, changefreq: 'daily' },
  { loc: '/about/', priority: 0.8, changefreq: 'monthly' },
  { loc: '/contact-us/', priority: 0.7, changefreq: 'monthly' },
  { loc: '/why-choose-us/', priority: 0.8, changefreq: 'monthly' },
  { loc: '/our-services/', priority: 0.9, changefreq: 'weekly' },
  { loc: '/business-visa-assistance/', priority: 0.9, changefreq: 'weekly' },
  { loc: '/corporate-air-ticketing/', priority: 0.8, changefreq: 'weekly' },
  { loc: '/corporate-hotel-booking/', priority: 0.8, changefreq: 'weekly' },
  { loc: '/corporate-holiday-packages/', priority: 0.8, changefreq: 'weekly' },
  { loc: '/ok-to-board/', priority: 0.7, changefreq: 'weekly' },
  { loc: '/passport-index/', priority: 0.7, changefreq: 'weekly' },
  { loc: '/visa-tracking/', priority: 0.7, changefreq: 'weekly' },
  { loc: '/evisa/', priority: 0.8, changefreq: 'weekly' },
  { loc: '/visa-guide/', priority: 0.9, changefreq: 'daily' },
  { loc: '/insights/', priority: 0.7, changefreq: 'weekly' },
  { loc: '/awareness/', priority: 0.7, changefreq: 'weekly' },
  { loc: '/visa-news-updates/', priority: 0.8, changefreq: 'daily' },
];

function generatePagesSitemap() {
  const urls = staticPages.map(page => `
  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;
}

function generateCountriesSitemap() {
  const dataPath = path.join(__dirname, '..', 'data', 'countries.json');
  if (!fs.existsSync(dataPath)) {
    console.warn('Countries data not found. Skipping country sitemap.');
    return null;
  }

  const countries = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const urls = countries.map(c => `
  <url>
    <loc>${BASE_URL}/visa-guide/${c.id}/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;
}

function generateMainSitemapIndex() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-pages.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-countries.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-blog.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;
}

// Main
const rootDir = path.join(__dirname, '..');

// Generate pages sitemap
fs.writeFileSync(path.join(rootDir, 'sitemap-pages.xml'), generatePagesSitemap(), 'utf-8');
console.log('✓ sitemap-pages.xml');

// Generate countries sitemap
const countriesSitemap = generateCountriesSitemap();
if (countriesSitemap) {
  fs.writeFileSync(path.join(rootDir, 'sitemap-countries.xml'), countriesSitemap, 'utf-8');
  console.log('✓ sitemap-countries.xml');
}

// Generate main index
fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), generateMainSitemapIndex(), 'utf-8');
console.log('✓ sitemap.xml');

console.log('\nAll sitemaps generated successfully.');
