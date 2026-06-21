// Optional: render the print-styled /cv route to a real PDF at public/cv.pdf.
//
//   1) npm run build && npm run preview      # serves dist at :4321
//   2) npx playwright install chromium       # one-time
//   3) npm run pdf                            # writes public/cv.pdf
//
// Playwright is intentionally NOT a dependency (keeps `npm install` light and
// avoids a browser download in CI). Until you run this, the "Download CV"
// button falls back to the browser's own print-to-PDF on /cv.

const URL = process.env.CV_URL || 'http://localhost:4321/cv';
const OUT = 'public/cv.pdf';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Playwright not installed. Run:  npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(URL, { waitUntil: 'networkidle' });
await page.emulateMedia({ media: 'print' });
await page.pdf({
  path: OUT,
  format: 'A4',
  printBackground: true,
  margin: { top: '14mm', bottom: '14mm', left: '14mm', right: '14mm' },
});
await browser.close();
console.log(`✓ wrote ${OUT}`);
