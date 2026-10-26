// Copies or builds the third-party files the app serves itself into vendor/:
// Chart.js and Inter (so the app works offline from the first visit), and a browser bundle of the Anthropic SDK
// (loaded only when you scan a coffee bag).
// Run after changing any of their versions in package.json:
//   npm install && npm run vendor
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const root = path.join(__dirname, '..');
const files = {
  'node_modules/chart.js/dist/chart.umd.min.js': 'vendor/chart.umd.min.js',
  'node_modules/chart.js/LICENSE.md': 'vendor/chart.js-LICENSE.md',
  'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2': 'vendor/inter-latin-wght-normal.woff2',
  'node_modules/@fontsource-variable/inter/LICENSE': 'vendor/inter-LICENSE.txt',
  'node_modules/@anthropic-ai/sdk/LICENSE': 'vendor/anthropic-sdk-LICENSE.txt'
};

fs.mkdirSync(path.join(root, 'vendor'), { recursive: true });
for (const [from, to] of Object.entries(files)) {
  fs.copyFileSync(path.join(root, from), path.join(root, to));
  console.log(`${from} -> ${to}`);
}

esbuild.buildSync({
  entryPoints: [path.join(__dirname, 'anthropic-entry.js')],
  outfile: path.join(root, 'vendor/anthropic-sdk.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  minify: true,
  legalComments: 'eof'
});
console.log('@anthropic-ai/sdk -> vendor/anthropic-sdk.js');
