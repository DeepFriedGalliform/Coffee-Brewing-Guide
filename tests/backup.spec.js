// Settings backup: export, import and validation
const { test, expect } = require('@playwright/test');
const { openApp } = require('./helpers');

test.beforeEach(({ page }) => {
  page.on('dialog', dialog => dialog.accept());
});

test('a backup restores coffees, recipes, usual settings and preferences', async ({ page }) => {
  await openApp(page, {
    bg_grinder: 'comandante',
    bg_temp_unit: 'F',
    bg_custom_coffees: JSON.stringify([{ id: 'abc', name: 'Kenya', base: 'african_washed', temp: 95, notes: 'Blackcurrant', ode: 5 }]),
    bg_coffee_prefs: JSON.stringify({ mine_abc: { method: 'chemex', dose: 30, water: 500, ratio: 50 / 3, grindOffset: 0.2 } })
  });
  const backup = await page.evaluate(() => buildSettingsBackup());
  expect(Object.keys(backup.settings)).toEqual(expect.arrayContaining(['bg_grinder', 'bg_temp_unit', 'bg_custom_coffees', 'bg_coffee_prefs']));

  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole('button', { name: 'Settings' }).click();
  await Promise.all([page.waitForEvent('load'), page.evaluate(b => importSettingsText(JSON.stringify(b)), backup)]);
  await expect(page.locator('#backupStatus')).toHaveText('Settings imported.');
  const restored = await page.evaluate(() => buildSettingsBackup().settings);
  expect(restored).toEqual(backup.settings);
});

test('the API key from the old scanner is removed and never exported', async ({ page }) => {
  await openApp(page, { bg_api_key: 'sk-ant-old' });
  expect(await page.evaluate(() => localStorage.getItem('bg_api_key'))).toBeNull();
  expect(JSON.stringify(await page.evaluate(() => buildSettingsBackup()))).not.toContain('sk-ant');
});

test('files that are not backups, and invalid values, are rejected', async ({ page }) => {
  await openApp(page);
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.evaluate(() => importSettingsText('not json'));
  await expect(page.locator('#backupStatus')).toHaveText("That isn't a Brew Guide settings backup.");
  await page.evaluate(() => importSettingsText(JSON.stringify({ format: 'coffee-brewing-guide-settings', settings: { bg_dose: 999 } })));
  await expect(page.locator('#backupStatus')).toHaveText("That backup doesn't contain any settings this app can use.");
});
