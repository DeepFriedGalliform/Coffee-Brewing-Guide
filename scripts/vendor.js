// Copies the third-party files the app serves itself into vendor/, so it works offline from the first visit:
// Chart.js, the Inter font, and Tesseract.js (on-device text recognition for Scan bag, loaded only when you scan).
// Run after changing any of their versions in package.json:
//   npm install && npm run vendor
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = {
  'node_modules/chart.js/dist/chart.umd.min.js': 'vendor/chart.umd.min.js',
  'node_modules/chart.js/LICENSE.md': 'vendor/chart.js-LICENSE.md',
  'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2': 'vendor/inter-latin-wght-normal.woff2',
  'node_modules/@fontsource-variable/inter/LICENSE': 'vendor/inter-LICENSE.txt',
  // Tesseract.js: the main script, its worker, the LSTM-only engine builds (the worker picks the one the device
  // supports: relaxed SIMD, SIMD or plain), and the compact English model
  'node_modules/tesseract.js/dist/tesseract.min.js': 'vendor/tesseract/tesseract.min.js',
  'node_modules/tesseract.js/dist/worker.min.js': 'vendor/tesseract/worker.min.js',
  'node_modules/tesseract.js/LICENSE.md': 'vendor/tesseract/LICENSE.md',
  'node_modules/tesseract.js-core/tesseract-core-lstm.wasm.js': 'vendor/tesseract/tesseract-core-lstm.wasm.js',
  'node_modules/tesseract.js-core/tesseract-core-simd-lstm.wasm.js': 'vendor/tesseract/tesseract-core-simd-lstm.wasm.js',
  'node_modules/tesseract.js-core/tesseract-core-relaxedsimd-lstm.wasm.js': 'vendor/tesseract/tesseract-core-relaxedsimd-lstm.wasm.js',
  'node_modules/@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz': 'vendor/tesseract/eng.traineddata.gz'
};

for (const [from, to] of Object.entries(files)) {
  fs.mkdirSync(path.dirname(path.join(root, to)), { recursive: true });
  fs.copyFileSync(path.join(root, from), path.join(root, to));
  console.log(`${from} -> ${to}`);
}
