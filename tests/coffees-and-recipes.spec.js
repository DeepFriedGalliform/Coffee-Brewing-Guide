// Your own coffees, your own recipes, and each coffee's usual settings
const { test, expect } = require('@playwright/test');
const { openApp, openFirstCoffee, startBrew } = require('./helpers');

test.beforeEach(({ page }) => {
  page.on('dialog', dialog => dialog.accept());
});

test('add, edit and delete your own coffee', async ({ page }) => {
  const errors = await openApp(page);
  await page.getByRole('button', { name: '+ Coffee' }).click();
  await expect(page.locator('#coffeeEditorTitle')).toHaveText('Add a Coffee');
  await page.getByRole('button', { name: 'Save Coffee' }).click();
  await expect(page.locator('#coffeeEditorError')).toHaveText('Give your coffee a name.');

  await page.locator('#coffeeName').fill('Test <b>Bean</b>');
  await page.locator('#coffeeTemp').fill('94');
  await page.locator('#coffeeGrind').fill('5.6');
  await page.getByRole('button', { name: 'Save Coffee' }).click();
  await expect(page.locator('#typePickerName')).toHaveText('Mine');
  const card = page.locator('#profileCardsContainer > div').first();
  // The name is shown as text, not run as HTML
  await expect(card).toContainText('Test <b>Bean</b>');
  await expect(card).toContainText('94°C');
  await expect(card).toContainText('5.6');

  await page.getByRole('button', { name: /^Edit Test/ }).click();
  await expect(page.locator('#coffeeEditorTitle')).toHaveText('Edit Coffee');
  await page.getByRole('button', { name: 'Delete this coffee' }).click();
  await expect(page.locator('#profileCardsContainer')).toContainText('Add the coffees you buy');
  expect(errors).toEqual([]);
});

test('paste label text fills in the coffee', async ({ page }) => {
  await openApp(page);
  await page.getByRole('button', { name: '+ Coffee' }).click();
  await page.getByRole('button', { name: '📋 Paste label text' }).click();
  await page.locator('#pasteText').fill('Nº 50\nCOLOMBIA\nEL CARMEN\nROASTED:\nMedium/Dark\nTASTES LIKE:\nCaramel\nChocolate\nRed Fruits\nWhole Bean\nSINGLE ORIGIN');
  await page.getByRole('button', { name: 'Fill in from text' }).click();
  await expect(page.locator('#coffeeName')).toHaveValue('Colombia El Carmen');
  await expect(page.locator('#coffeeBase')).toHaveValue('dark_low');
  await expect(page.locator('#coffeeNotes')).toHaveValue('Caramel, Chocolate, Red Fruits. Colombia · Medium-dark roast');
});

test('create, use, edit and delete your own recipe', async ({ page }) => {
  const errors = await openApp(page);
  await page.getByRole('button', { name: '+ Recipe' }).click();
  await expect(page.locator('#recipeEditorBase')).toHaveText('Based on V60');
  await page.locator('#recipeName').fill('Test Recipe');
  await page.locator('#recipeTemp').fill('95');

  // The last pour must reach 100%
  const lastPour = page.locator('#recipeSteps > div').nth(4).locator('[data-field="pct"]');
  await lastPour.fill('90');
  await lastPour.dispatchEvent('change');
  await page.getByRole('button', { name: 'Save Recipe' }).click();
  await expect(page.locator('#recipeEditorError')).toHaveText('The last pour must go to 100% of the water.');
  await lastPour.fill('100');
  await lastPour.dispatchEvent('change');
  await page.getByRole('button', { name: 'Save Recipe' }).click();

  await expect(page.locator('#methodPickerName')).toHaveText('Test Recipe ✎');
  await expect(page.locator('#profileCardsContainer button').first()).toContainText('95°C');
  // Your recipes come after the built-in ones, then the picker wraps to V60
  await page.getByRole('button', { name: 'Next brew method' }).click();
  await expect(page.locator('#methodPickerName')).toHaveText('V60');
  await page.getByRole('button', { name: 'Previous brew method' }).click();

  await page.locator('#methodPickerName').click();
  await expect(page.locator('#recipeEditorTitle')).toHaveText('Edit Recipe');
  await expect(page.locator('#recipeTemp')).toHaveValue('95');
  await page.getByRole('button', { name: 'Delete this recipe' }).click();
  await expect(page.locator('#methodPickerName')).toHaveText('V60');
  expect(errors).toEqual([]);
});

test('copying a ready-made recipe keeps its steps', async ({ page }) => {
  await openApp(page, { bg_method: 'kasuya_46' });
  await page.getByRole('button', { name: '+ Recipe' }).click();
  await expect(page.locator('#recipeEditorBase')).toHaveText('Copied from Kasuya 4:6');
  await expect(page.locator('#recipeSteps > div')).toHaveCount(10);
});

test('each coffee remembers its usual method and brew size', async ({ page }) => {
  await openApp(page);
  await openFirstCoffee(page);
  await startBrew(page);
  await page.locator('#btnCancelBrew').click();
  await page.locator('#btnCancelBrew').click();

  // Change the setup: the coffee's card still shows its usual V60 at 15 g
  await page.getByRole('button', { name: 'Next brew method' }).click();
  await page.locator('#btnCups2').click();
  const card = page.locator('#profileCardsContainer button').first();
  await expect(card).toContainText('Your usual: V60');
  await expect(card).toContainText('15g');

  await card.click();
  await expect(page.locator('#prepUsualBanner')).toContainText('Using your usual for this coffee: V60 · 15g / 250g');
  await page.locator('#btnUseSetup').click();
  await expect(page.locator('#prepUsualBanner')).toBeHidden();
  await expect(page.locator('#prepInstructionWeigh')).toHaveText('Weigh 30.0g coffee beans.');
});
