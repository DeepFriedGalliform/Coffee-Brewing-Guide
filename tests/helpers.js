// Shared helpers for the browser tests
const { expect } = require('@playwright/test');

/* Opens the app with empty storage (plus any localStorage values given) and returns the list of page errors */
async function openApp(page, storage = {}) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.evaluate(values => {
    localStorage.clear();
    for (const [key, value] of Object.entries(values)) localStorage.setItem(key, value);
  }, storage);
  await page.reload();
  await expect(page.locator('#setupScreen')).toBeVisible();
  return errors;
}

/* Taps the first coffee card and waits for the checklist */
async function openFirstCoffee(page) {
  await page.locator('#profileCardsContainer button').first().click();
  await expect(page.locator('#prepScreen')).toBeVisible();
}

/* Starts the brew from the checklist, skipping the 5-second countdown */
async function startBrew(page) {
  await page.getByRole('button', { name: 'Start Brew Cycle' }).click();
  await page.getByRole('button', { name: 'Skip Countdown & Start Now' }).click();
  await expect(page.locator('#brewScreen')).toBeVisible();
}

/* Jumps the running brew to the start of its last step (the drawdown or press) */
async function goToLastStep(page) {
  await page.evaluate(() => seekTo(getStepStartTime(activeSteps.length - 1)));
  await expect(page.locator('#btnPause')).toHaveText(/Done/);
}

module.exports = { openApp, openFirstCoffee, startBrew, goToLastStep };
