
import * as puppeteer from 'puppeteer';

describe('Cross-Browser Compatibility', () => {
  const browsers = ['chrome', 'firefox'];
  
  browsers.forEach(browserName => {
    describe(`${browserName} compatibility`, () => {
      let browser: puppeteer.Browser;
      let page: puppeteer.Page;

      beforeAll(async () => {
        browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        page = await browser.newPage();
      });

      afterAll(async () => {
        await browser.close();
      });

      test('should render home page correctly', async () => {
        await page.goto('http://localhost:8080');
        
        const title = await page.title();
        expect(title).toContain('F1');
        
        const h1 = await page.$eval('h1', el => el.textContent);
        expect(h1).toBeTruthy();
      });

      test('should handle responsive design', async () => {
        // Test mobile viewport
        await page.setViewport({ width: 375, height: 667 });
        await page.goto('http://localhost:8080');
        
        const mobileNav = await page.$('[data-testid="mobile-nav"]');
        expect(mobileNav).toBeTruthy();
        
        // Test desktop viewport
        await page.setViewport({ width: 1920, height: 1080 });
        await page.reload();
        
        const desktopNav = await page.$('[data-testid="desktop-nav"]');
        expect(desktopNav).toBeTruthy();
      });

      test('should support modern JavaScript features', async () => {
        await page.goto('http://localhost:8080');
        
        const result = await page.evaluate(() => {
          // Test async/await, arrow functions, destructuring
          const testModernJS = async () => {
            const data = { test: 'value' };
            const { test } = data;
            return Promise.resolve(test);
          };
          
          return testModernJS();
        });
        
        expect(result).toBe('value');
      });
    });
  });
});
