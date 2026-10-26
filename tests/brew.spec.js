// Brewing: the timer, controls, completion advice and resuming
const { test, expect } = require('@playwright/test');
const { openApp, openFirstCoffee, startBrew, goToLastStep } = require('./helpers');

test('a full V60 brew: steps, pause, Done and the completion advice', async ({ page }) => {
  const errors = await openApp(page);
  await openFirstCoffee(page);
  await expect(page.locator('#prepInstructionBoil')).toHaveText('Boil at least 250ml water to 96°C.');
  await startBrew(page);
  await expect(page.locator('#stepTitleHeader')).toHaveText(/active pour/i);

  await page.locator('#btnPause').click();
  await expect(page.locator('#btnPause')).toHaveText('Resume');
  await page.locator('#btnPause').click();
  await expect(page.locator('#btnPause')).toHaveText('Pause');

  await page.getByRole('button', { name: 'Skip' }).click();
  await expect(page.locator('#stepTitleHeader')).toHaveText(/bloom rest/i);

  await goToLastStep(page);
  await page.locator('#btnPause').click();
  await expect(page.locator('#summaryScreen')).toBeVisible();
  await expect(page.locator('#drawdownTitle')).toContainText('Drawdown');
  await expect(page.locator('#drawdownAdvice')).toContainText('faster than the recipe');
  expect(errors).toEqual([]);
});

test('"Use … next time" saves the grind advice for that coffee', async ({ page }) => {
  await openApp(page);
  await openFirstCoffee(page);
  await startBrew(page);
  const before = await page.evaluate(() => getGrindSetting(selectedCoffeeKey));
  // A drawdown a minute too slow: the advice is to go coarser
  await page.evaluate(() => finishBrew(activeSteps[activeSteps.length - 1].time + 60));
  const save = page.locator('#grindSaveRow button');
  await expect(save).toHaveText(/^Use .* next time$/);
  await save.click();
  await expect(page.locator('#grindSaveRow')).toContainText('Saved');
  const after = await page.evaluate(() => getGrindSetting(selectedCoffeeKey));
  expect(after).toBeGreaterThan(before);

  await page.getByRole('button', { name: 'Brew Another Cup' }).click();
  await openFirstCoffee(page);
  await expect(page.locator('#prepGrindNote')).toContainText('coarser');
  await page.locator('#prepGrindNote').getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('#prepGrindNote')).toBeHidden();
});

test('Cancel Brew needs a second tap', async ({ page }) => {
  await openApp(page);
  await openFirstCoffee(page);
  await startBrew(page);
  await page.locator('#btnCancelBrew').click();
  await expect(page.locator('#cancelBrewLabel')).toHaveText('Tap again to end brew');
  await page.locator('#btnCancelBrew').click();
  await expect(page.locator('#setupScreen')).toBeVisible();
});

test('a brew carries on after the app is closed and reopened', async ({ page }) => {
  await openApp(page);
  await openFirstCoffee(page);
  await startBrew(page);
  await page.evaluate(() => seekTo(20));
  await page.reload();
  await expect(page.locator('#resumeScreen')).toBeVisible();
  await expect(page.locator('#resumeDetails')).toContainText('V60');
  await page.getByRole('button', { name: 'Resume Brew' }).click();
  await expect(page.locator('#brewScreen')).toBeVisible();
  expect(await page.evaluate(() => getElapsedSeconds())).toBeGreaterThanOrEqual(20);

  await page.locator('#btnCancelBrew').click();
  await page.locator('#btnCancelBrew').click();
  await page.reload();
  await expect(page.locator('#setupScreen')).toBeVisible();
});
