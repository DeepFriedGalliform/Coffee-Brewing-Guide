// Offline use: the service worker caches the app and its libraries
const { test, expect } = require('@playwright/test');

test.use({ serviceWorkers: 'allow' });

test('after one visit the app works offline, chart and font included', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  expect(await page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);

  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#setupScreen')).toBeVisible();
  expect(await page.evaluate(() => typeof Chart)).toBe('function');
  expect(await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('700 12px Inter'); })).toBe(true);
});
