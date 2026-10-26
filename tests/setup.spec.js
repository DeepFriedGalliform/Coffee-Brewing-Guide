// The setup screen: loading, brew size, pickers, grinder and display settings
const { test, expect } = require('@playwright/test');
const { openApp } = require('./helpers');

test('loads without errors or requests to other sites', async ({ page, baseURL }) => {
  const outside = [];
  page.on('request', request => {
    const url = request.url();
    if (!url.startsWith(baseURL) && !url.startsWith('data:') && !url.startsWith('blob:')) outside.push(url);
  });
  const errors = await openApp(page);
  expect(await page.evaluate(() => typeof Chart)).toBe('function');
  await expect(page.locator('#methodPickerName')).toHaveText('V60');
  await expect(page.locator('#typePickerName')).toHaveText('Standard');
  expect(outside).toEqual([]);
  expect(errors).toEqual([]);
});

test('coffee, water and ratio adjust each other in 5 g steps', async ({ page }) => {
  await openApp(page);
  const dose = page.locator('#doseValue');
  const water = page.locator('#waterValue');
  const ratio = page.locator('#ratioValue');
  await expect(dose).toHaveText('15g');
  await expect(water).toHaveText('250g');

  await page.locator('#btnCups2').click();
  await expect(dose).toHaveText('30g');
  await expect(water).toHaveText('500g');

  await page.getByRole('button', { name: '5 grams more water' }).click();
  await expect(water).toHaveText('505g');
  await expect(ratio).toHaveText('16.8');

  await page.getByRole('button', { name: 'Stronger ratio' }).click();
  await expect(ratio).toHaveText('16.5');
  await expect(water).toHaveText('495g');
});

test('tapping a value lets you type it', async ({ page }) => {
  await openApp(page);
  await page.locator('[data-brew-field="dose"]').click();
  await page.keyboard.press('Control+A');
  await page.keyboard.type('18');
  await page.keyboard.press('Enter');
  await expect(page.locator('#doseValue')).toHaveText('18g');
  await expect(page.locator('#waterValue')).toHaveText('300g');
});

test('the coffee type picker filters the coffees and wraps around', async ({ page }) => {
  await openApp(page);
  const type = page.locator('#typePickerName');
  const firstCard = page.locator('#profileCardsContainer button').first();
  await expect(firstCard).toContainText('Light Roast / High Elevation');
  for (const [name, coffee] of [['Pact', 'Pact Specialty Light'], ['Regional', 'African Washed'], ['Mine', '+ Add a coffee'], ['Standard', 'Light Roast']]) {
    await page.getByRole('button', { name: 'Next coffee type' }).click();
    await expect(type).toHaveText(name);
    await expect(page.locator('#profileCardsContainer')).toContainText(coffee);
  }
});

test('choosing a grinder converts every grind setting', async ({ page }) => {
  await openApp(page);
  const card = page.locator('#profileCardsContainer button').first();
  await expect(card).toContainText('5.1');
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Comandante C40' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  await expect(page.locator('#grinderChipName')).toHaveText('Comandante C40');
  const grind = await page.evaluate(() => getGrindSetting('light_high'));
  expect(Number.isInteger(grind)).toBe(true);
  await expect(card).toContainText(String(grind));
});

test('display options: °F, large text and reduced motion', async ({ page }) => {
  await openApp(page);
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.locator('#btnTempF').click();
  await page.locator('#btnTextLarge').click();
  await page.locator('#btnMotionReduce').click();
  await expect(page.locator('html')).toHaveClass(/text-large/);
  await expect(page.locator('html')).toHaveClass(/reduce-motion/);
  await page.getByRole('button', { name: 'Done' }).click();
  await expect(page.locator('#profileCardsContainer button').first()).toContainText('205°F');
  // No sideways scrolling with large text on a small phone
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
