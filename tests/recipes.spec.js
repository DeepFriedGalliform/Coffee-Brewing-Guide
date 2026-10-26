// The recipe engine and the ready-made recipes
const { test, expect } = require('@playwright/test');
const { openApp, openFirstCoffee, startBrew, goToLastStep } = require('./helpers');

test('every recipe pours in 5 g steps up to the full water, at every brew size', async ({ page }) => {
  await openApp(page);
  const problems = await page.evaluate(() => {
    const found = [];
    for (const method of Object.keys(RECIPES)) {
      for (let water = WATER_LIMITS.min; water <= WATER_LIMITS.max; water += WATER_STEP) {
        const steps = generateSteps(method, water);
        let previous = 0;
        steps.forEach((s, i) => {
          if (s.water % WATER_STEP !== 0) found.push(`${method} ${water}g step ${i + 1}: ${s.water}g isn't a multiple of ${WATER_STEP}`);
          if (s.water < previous) found.push(`${method} ${water}g step ${i + 1}: the water goes down`);
          if (s.pourTime > 0 && s.water <= previous) found.push(`${method} ${water}g step ${i + 1}: the pour adds nothing`);
          if (!(s.time >= 3)) found.push(`${method} ${water}g step ${i + 1}: ${s.time}s long`);
          previous = s.water;
        });
        const last = steps[steps.length - 1];
        if (last.water !== water) found.push(`${method} ${water}g: ends at ${last.water}g`);
        if (last.phase !== 'drawdown') found.push(`${method}: doesn't end with a drawdown or press`);
      }
    }
    return found;
  });
  expect(problems).toEqual([]);
});

test('every built-in recipe behaves like a known method', async ({ page }) => {
  await openApp(page);
  const unknown = await page.evaluate(() => BUILT_IN_METHODS.filter(m => !RECIPES[m] || !METHOD_FAMILIES.includes(getMethodFamily(m))));
  expect(unknown).toEqual([]);
});

test('the method picker steps through every built-in recipe and wraps around both ways', async ({ page }) => {
  await openApp(page);
  const names = await page.evaluate(() => BUILT_IN_METHODS.map(m => RECIPES[m].name));
  const picker = page.locator('#methodPickerName');
  await expect(picker).toHaveText(names[0]);
  for (const name of [...names.slice(1), names[0]]) {
    await page.getByRole('button', { name: 'Next brew method' }).click();
    await expect(picker).toHaveText(name);
  }
  await page.getByRole('button', { name: 'Previous brew method' }).click();
  await expect(picker).toHaveText(names[names.length - 1]);
});

test('swiping the method picker steps it without counting as a tap', async ({ page }) => {
  await openApp(page);
  const box = await page.locator('#methodPicker').boundingBox();
  await page.mouse.move(box.x + box.width * 0.7, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, { steps: 5 });
  await page.mouse.up();
  await expect(page.locator('#methodPickerName')).toHaveText('Hoffmann V60');
  await expect(page.locator('#setupScreen')).toBeVisible();
});

test('AeroPress has its own prep, capacity warning, plunger and wording', async ({ page }) => {
  const errors = await openApp(page, { bg_method: 'aeropress' });
  await openFirstCoffee(page);
  await expect(page.locator('#prepStep5Title')).toHaveText('Assemble on Your Mug & Add Coffee');
  await expect(page.locator('#prepCapacityNote')).toBeHidden();

  await page.getByRole('button', { name: 'Setup' }).click();
  await page.locator('#btnCups2').click();
  await page.locator('#profileCardsContainer button').first().click();
  await expect(page.locator('#prepCapacityNote')).toContainText('holds about 250g');

  await page.getByRole('button', { name: 'Setup' }).click();
  await page.locator('#btnCups1').click();
  await openFirstCoffee(page);
  await startBrew(page);
  await page.getByRole('button', { name: 'Live ring view' }).click();
  await expect(page.locator('#brewerOutline')).toHaveAttribute('points', '51,10 109,10 109,112 51,112');
  await expect(page.locator('#brewerPlunger')).toBeHidden();

  await goToLastStep(page);
  await expect(page.locator('#brewerPlunger')).toBeVisible();
  await expect(page.locator('#unifiedInstruction')).toContainText('Tap Done when the plunger is all the way down');
  await page.locator('#btnPause').click();
  await expect(page.locator('#summaryScreen')).toBeVisible();
  await expect(page.locator('#drawdownTitle')).toContainText('Press');
  expect(errors).toEqual([]);
});

test('AeroPress Inverted is set up upside down', async ({ page }) => {
  await openApp(page, { bg_method: 'aeropress_inverted' });
  await openFirstCoffee(page);
  await expect(page.locator('#prepStep5Title')).toHaveText('Assemble Upside Down & Add Coffee');
});

test('drippers keep the cone and drawdown wording', async ({ page }) => {
  await openApp(page, { bg_method: 'chemex' });
  await openFirstCoffee(page);
  await expect(page.locator('#prepStep5Title')).toHaveText('Add Grounds & Flatten Bed');
  await startBrew(page);
  await expect(page.locator('#brewerOutline')).toHaveAttribute('points', '22,18 138,18 92,112 68,112');
  await goToLastStep(page);
  await expect(page.locator('#unifiedInstruction')).toContainText('Tap Done when it stops dripping');
  await expect(page.locator('#brewerPlunger')).toBeHidden();
});
