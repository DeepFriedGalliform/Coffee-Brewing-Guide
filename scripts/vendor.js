// Copies the third-party files the app serves itself (so it works offline from the first visit) into vendor/.
// Run after changing the chart.js or @fontsource-variable/inter versions in package.json:
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

fs.mkdirSync(path.join(root, 'vendor'), { recursive: true });
for (const [from, to] of Object.entries(files)) {
  fs.copyFileSync(path.join(root, from), path.join(root, to));
  console.log(`${from} -> ${to}`);
}
