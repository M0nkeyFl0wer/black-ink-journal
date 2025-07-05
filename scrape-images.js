// scrape-images.js (ES module compatible)
import { chromium } from 'playwright';
import fs from 'fs';

const siteUrl = 'https://benwest.blog';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(siteUrl, { waitUntil: 'networkidle' });

// Extract image URLs from img[src]
const imageUrls = await page.$$eval('img', imgs =>
  imgs.map(img => img.getAttribute('src')).filter(Boolean)
);

// Write to file
fs.writeFileSync('image-urls.txt', imageUrls.join('\n'), 'utf-8');

console.log(`✅ Extracted ${imageUrls.length} image URLs.`);
await browser.close();
