import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
await page.goto('http://localhost:5174');
await page.waitForTimeout(1500);

// Click FAB to open log form
await page.click('button:has(span:text("add"))');
await page.waitForTimeout(500);

await page.screenshot({ path: 'scratch/screenshot-logform.png', fullPage: true });
await browser.close();
console.log('Screenshot saved to scratch/screenshot-logform.png');
