<p align="center">
  <img src="icons/icon-192.png" width="96" height="96" alt="Brew Guide logo">
</p>

<h1 align="center">Coffee Brewing Guide</h1>

<p align="center">
  A mobile pour-over timer that walks you through every pour, rest and drawdown,<br>
  and installs on your phone's home screen like an app.
</p>

<p align="center">
  <a href="https://deepfriedgalliform.github.io/Coffee-Brewing-Guide/"><strong>Open the app →</strong></a>
</p>

---

## Features

- **Four brew methods**: Hario V60, Hario Switch (hybrid), Hario Switch (full immersion) and Clever Dripper.
- **Any dose, water and ratio**: 8–40 g of coffee and 100–800 g of water (default 15 g / 250 g, 1:16.7).
  - Water moves in 5 g steps and the ratio follows. The ratio moves in 0.5 steps and the water follows, always landing on a multiple of 5 g. Changing the dose keeps your ratio.
  - Tap a value to type it, or drag sideways on it to scrub. **×1** / **×2** jump to 15 g or 30 g at your current ratio (250 g / 500 g at the default).
  - Every pour target is a multiple of 5 g.
  - Flow rates, stage timings and grind scale with the amount of water.
- **Twelve coffee profiles** in three groups (Standard roasts, Pact, Regional origins), each with its own water temperature, tasting notes and grind setting adjusted for method and batch size.
- **Your own coffees**: under **Mine**, add the coffees you buy. Pick a similar built-in profile as a starting point, then set the name, water temperature, your grind for the current method and brew size, and tasting notes. They're scaled to every method and size like the built-in profiles. Tap the pencil on a card to edit or delete one.
- **Your grinder**: choose Fellow Ode Gen 2, Comandante C40, Baratza Encore, 1Zpresso K-Ultra, Knock Aergrind or Timemore Chestnut C3S Max, and every recipe shows the setting for that grinder. For anything else, add a **custom grinder** by entering its finest and coarsest settings and step size, and recipes are scaled across that range. Tap the gear icon or **change** under the title.
- **Calibrate to your own settings**: in Settings, type the setting you actually use for any of the listed coffees. Every other recipe for that grinder, including other methods and brew sizes, is then scaled from your numbers. Enter one coffee to shift everything, or several to fine-tune; **Reset** clears them.
- **Pre-brew checklist** with kettle temperature, dose and grind for the profile you picked.
- **Live brew timer** with three views:
  - **Ring**: a rotating timeline with the target scale weight, flow rate, an animated dripper and the Switch valve state (open or closed).
  - **Summary**: every stage with a live progress fill.
  - **Chart**: your progress plotted against the target pour profile.
- **Spoken prompts** such as "Close the valve. Steep Pour. Pour to 250 grams.", so you don't need to watch the screen while pouring. Tap the speaker icon next to the timer to turn them off; the choice is remembered.
- **Audio and haptic cues**: a 5-second get-ready countdown, beeps for the last 4 seconds of each stage, a chime and vibration at each stage change, and a fanfare when you finish.
- **Drawdown timing**: during the final drawdown the Pause button becomes **Done**. Tap it when the coffee stops dripping, and the completion screen compares your drawdown with the recipe and tells you whether to grind coarser, finer, or keep the same setting. If the timer runs out first, it keeps counting until you tap Done.
- **Resume after interruptions**: if the app is closed mid-brew (iOS may close Home Screen apps in the background), reopening it offers to resume. The timer keeps counting while the app is closed, and a paused brew stays paused.
- **Pause, Back and Skip** controls, a Cancel button on the countdown, and a tap-twice Cancel Brew so a stray tap can't end your brew. The screen stays awake while brewing.
- **Works fully offline** from the first visit (Chart.js and the Inter font are served with the app), and remembers your last method, dose, ratio, grinder, coffee type and view.
- **Update prompt**: when a new version is published, the app offers a **Reload** (never in the middle of a brew).
- **Display options** in Settings: temperatures in **°C or °F**, **Large** text for reading at arm's length, and **Reduced** motion (a still brew ring and no pulsing or ripples). Motion follows your phone's Reduce Motion setting on **Auto**.
- **Backup and restore**: settings are stored only on your device, in the browser's local storage. In Settings → **Backup**, export them (your own coffees and display options included) to a file (on a phone this opens the share sheet, so you can save to Files or AirDrop it) or copy them as text, then import the file or paste the text to restore them on another phone or after reinstalling. On iPhone, the Home Screen app keeps its own settings, separate from Safari, so this is also how you move settings between the two.

## Install on your phone

1. Open **https://deepfriedgalliform.github.io/Coffee-Brewing-Guide/** on your phone.
2. Add it to your home screen:
   - **iPhone / iPad (Safari):** tap **Share** → **Add to Home Screen**.
   - **Android (Chrome):** tap **⋮** → **Install app** (or **Add to Home screen**).
3. Launch it from the Brew Guide icon. It opens full-screen without browser bars.

## How to use

1. **Setup**: choose your grinder once (gear icon), then pick a brew method, dose, ratio and coffee type, and tap a profile card.
2. **Checklist**: boil, weigh, grind, rinse the filter and prep the brewer, then check the brew summary.
3. **Brew**: tap **Start Brew Cycle**, follow the on-screen (and spoken) instruction for each stage, and pour to the target weight shown.
4. **Drawdown**: tap **Done** as soon as the coffee stops dripping.
5. **Finish**: read the tasting notes and the grind advice for your next brew.

## Hosting on GitHub Pages

The app is a static site with no build step, so GitHub Pages serves it straight from the repo.

1. Go to the repository's **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose branch **`main`** and folder **`/ (root)`**, then **Save**.
4. After a minute or so the site is live at `https://deepfriedgalliform.github.io/Coffee-Brewing-Guide/`.

Every push to `main` redeploys automatically. The empty `.nojekyll` file tells Pages to serve the files as they are, without running Jekyll.

## Project structure

```
index.html             The whole app: markup, custom styles and JavaScript
styles.css             Tailwind CSS built from the classes used in index.html (committed, so Pages needs no build)
src/tailwind.css       Tailwind source for styles.css
tailwind.config.js     Tailwind theme (app colours and shadows)
package.json           Build scripts for styles.css
manifest.webmanifest   Web app manifest (name, colours, icons) for "Add to Home Screen"
sw.js                  Service worker that caches the app for offline use
vendor/                Chart.js and the Inter font (latin subset), with their licences, copied by npm run vendor
scripts/vendor.js      Copies those files from node_modules into vendor/
icons/                 App icon (bean, dripper and cup logo): SVG source plus PNG sizes for each platform
.nojekyll              Tells GitHub Pages to skip Jekyll processing
```

[Chart.js](https://www.chartjs.org/) (MIT) and the [Inter](https://rsms.me/inter/) font (SIL Open Font License) are served from `vendor/`, so nothing loads from a CDN.

## Rebuilding the CSS

`styles.css` contains only the Tailwind classes that `index.html` uses. If you add or change Tailwind classes, rebuild it (needs [Node.js](https://nodejs.org/)):

```sh
npm install
npm run build:css     # or: npm run watch:css while editing
```

Commit the updated `styles.css` together with your `index.html` changes.

## Updating Chart.js or Inter

Change the `chart.js` or `@fontsource-variable/inter` version in `package.json`, then:

```sh
npm install
npm run vendor
```

Commit the updated files in `vendor/`.

## Customising

Everything lives near the top of the `<script>` in `index.html`:

- **Coffee profiles** (`coffeeData`): each entry has a `category` (`standard`, `pact` or `regional`), display `name`, water `temp` in °C, tasting `notes` and base grind `ode`, on the Fellow Ode Gen 2 dial for a 250 g V60. Coffees added in the app are stored the same way and appear under `mine`.
- **Recipes** (`RECIPES`): one entry per brew method, with its `grindOffset` (V60 0, Switch hybrid +0.2, full immersion and Clever +0.5) and its steps. Each step gives:
  - `water`: the cumulative target as a fraction of the total (0.2 = 20%);
  - `time`: `[seconds at 250 g, seconds at 500 g]`. Other sizes are interpolated, and extrapolated a little beyond that range;
  - `pour: true` if the whole step is pouring. The flow rate is then calculated;
  - `phase` (`pour`, `bloom`, `steep` or `drawdown`), the Switch `valve` state, and `desc`, with `{water}`, `{flow}` and `{crust}` filled in.
- **Batch size**: grind gets 1.0 coarser on the Ode per extra 250 g of water (`GRIND_OFFSET_PER_250G`).
- **Dose, water and ratio**: `DOSE_LIMITS`, `WATER_LIMITS`, `WATER_STEP` (5 g) and `RATIO_LIMITS`.
- **Grinders** (`GRINDERS`): each preset converts from the Ode through two reference points, `anchors: [[ode, setting], [ode, setting]]`. Edit those to recalibrate a preset, or add a new grinder the same way. The custom grinder instead maps the Ode's whole 1–11 dial onto the user's finest–coarsest range.

Settings you enter yourself are stored as calibration points for that grinder. Conversions pass through them, with straight lines between them, and follow the grinder's normal slope beyond them.

The preset conversions are approximate starting points. Use the drawdown advice after each brew to dial in.

After changing any file, bump `CACHE_VERSION` in `sw.js` (for example `brew-guide-v8`) so installed copies pick up the update. Open copies then show the update prompt.

## Running locally

Open `index.html` directly in a browser, or serve the folder so the service worker can register:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```
