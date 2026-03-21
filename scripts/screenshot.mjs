import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
await page.goto('http://localhost:5174');
await page.waitForTimeout(2000);
await page.screenshot({ path: 'scratch/screenshot-ethereal.png', fullPage: true });
await browser.close();
console.log('Screenshot saved to scratch/screenshot-ethereal.png');
