import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
await page.goto('http://localhost:5174');
await page.waitForTimeout(1500);

// Click Settings tab in bottom nav
const settingsBtn = page.locator('button:has(span:text("Settings"))');
await settingsBtn.click();
await page.waitForTimeout(500);

await page.screenshot({ path: 'scratch/screenshot-settings.png', fullPage: true });
await browser.close();
console.log('Screenshot saved to scratch/screenshot-settings.png');
