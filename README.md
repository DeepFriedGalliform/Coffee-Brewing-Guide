<p align="center">
  <img src="icons/icon-192.png" width="96" height="96" alt="Coffee bean icon">
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
- **One or two cups**: 15 g / 250 g or 30 g / 500 g, with timings scaled to match.
- **Twelve coffee profiles** in three groups (Standard roasts, Pact, Regional origins), each with its own water temperature, tasting notes and a **Fellow Ode Gen 2** grind setting adjusted for method and batch size.
- **Pre-brew checklist** with kettle temperature, dose and grind for the profile you picked.
- **Live brew timer** with three views:
  - **Ring**: a rotating timeline with the target scale weight, flow rate, an animated dripper and the Switch valve state (open or closed).
  - **Summary**: every stage with a live progress fill.
  - **Chart**: target pour profile against elapsed time.
- **Audio and haptic cues**: a 5-second get-ready countdown, beeps for the last 4 seconds of each stage, a chime and vibration at each stage change, and a fanfare when you finish.
- **Pause, Back and Skip** controls. The screen stays awake while brewing.
- **Works offline** once loaded, and remembers your last method, size, coffee type and view.

## Install on your phone

1. Open **https://deepfriedgalliform.github.io/Coffee-Brewing-Guide/** on your phone.
2. Add it to your home screen:
   - **iPhone / iPad (Safari):** tap **Share** → **Add to Home Screen**.
   - **Android (Chrome):** tap **⋮** → **Install app** (or **Add to Home screen**).
3. Launch it from the coffee-bean icon. It opens full-screen without browser bars.

## How to use

1. **Setup**: pick a brew method, cup size and coffee type, then tap a profile card.
2. **Checklist**: boil, weigh, grind, rinse the filter and prep the brewer, then check the brew summary.
3. **Brew**: tap **Start Brew Cycle**, follow the on-screen instruction for each stage, and pour to the target weight shown.
4. **Finish**: read the tasting notes and the grind advice for your next brew.

## Hosting on GitHub Pages

The app is a static site with no build step, so GitHub Pages serves it straight from the repo.

1. Go to the repository's **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose branch **`main`** and folder **`/ (root)`**, then **Save**.
4. After a minute or so the site is live at `https://deepfriedgalliform.github.io/Coffee-Brewing-Guide/`.

Every push to `main` redeploys automatically. The empty `.nojekyll` file tells Pages to serve the files as they are, without running Jekyll.

## Project structure

```
index.html             The whole app: markup, styles and JavaScript
manifest.webmanifest   Web app manifest (name, colours, icons) for "Add to Home Screen"
sw.js                  Service worker that caches the app for offline use
icons/                 Coffee-bean app icon: SVG source plus PNG sizes for each platform
.nojekyll              Tells GitHub Pages to skip Jekyll processing
```

The app loads [Tailwind CSS](https://tailwindcss.com/) (Play CDN), [Chart.js](https://www.chartjs.org/) and the [Inter](https://rsms.me/inter/) font from CDNs. The service worker caches them after the first visit.

## Customising

- **Coffee profiles**: edit `coffeeData` in `index.html`. Each entry has a `category` (`standard`, `pact` or `regional`), display `name`, water `temp`, tasting `notes` and base Ode grind setting (`ode`).
- **Recipes and timings**: edit `generateSteps(method, cups)`. Each step has a duration in seconds (`time`), the time spent pouring (`pourTime`), the cumulative target weight (`water`), the flow rate shown on screen, the instruction text, its `phase` (`pour`, `bloom`, `steep` or `drawdown`) and the Switch `valve` state.
- **Grind offsets**: `getCalculatedOdeSetting` adds +0.2 for Switch hybrid, +0.5 for full immersion or Clever, and +1.0 for two cups.

After changing any file, bump `CACHE_VERSION` in `sw.js` (for example `brew-guide-v2`) so installed copies pick up the update.

## Running locally

Open `index.html` directly in a browser, or serve the folder so the service worker can register:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```
