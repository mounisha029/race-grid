
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

describe('Lighthouse Performance Tests', () => {
  let chrome: any;

  beforeAll(async () => {
    chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  });

  afterAll(async () => {
    await chrome.kill();
  });

  test('should meet performance benchmarks for home page', async () => {
    const options = {
      logLevel: 'info' as const,
      output: 'json' as const,
      onlyCategories: ['performance'],
      port: chrome.port,
    };

    const runnerResult = await lighthouse('http://localhost:8080', options);
    const performanceScore = runnerResult?.lhr.categories.performance.score;

    expect(performanceScore).toBeGreaterThan(0.8); // 80+ performance score
  }, 30000);

  test('should meet accessibility standards', async () => {
    const options = {
      logLevel: 'info' as const,
      output: 'json' as const,
      onlyCategories: ['accessibility'],
      port: chrome.port,
    };

    const runnerResult = await lighthouse('http://localhost:8080', options);
    const accessibilityScore = runnerResult?.lhr.categories.accessibility.score;

    expect(accessibilityScore).toBeGreaterThan(0.9); // 90+ accessibility score
  }, 30000);
});
