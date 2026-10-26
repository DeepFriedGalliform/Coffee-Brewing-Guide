// Copies the third-party files the app serves itself (Chart.js and the Inter font) into vendor/, so it works offline
// from the first visit.
// Run after changing any of their versions in package.json:
//   npm install && npm run vendor
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = {
  'node_modules/chart.js/dist/chart.umd.min.js': 'vendor/chart.umd.min.js',
  'node_modules/chart.js/LICENSE.md': 'vendor/chart.js-LICENSE.md',
  'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2': 'vendor/inter-latin-wght-normal.woff2',
  'node_modules/@fontsource-variable/inter/LICENSE': 'vendor/inter-LICENSE.txt'
};

for (const [from, to] of Object.entries(files)) {
  fs.mkdirSync(path.dirname(path.join(root, to)), { recursive: true });
  fs.copyFileSync(path.join(root, from), path.join(root, to));
  console.log(`${from} -> ${to}`);
}
