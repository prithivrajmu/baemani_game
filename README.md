# Baemani

Hyper-casual road-safety arcade game: pick a character and a city (Chennai, New York, Bangkok), then hop across ever-busier roads without getting hit.

## How to play
- Arrow keys (or the on-screen d-pad on touch devices) hop one step. Reach the green GOAL line to clear a level.
- 3 lives, 10 levels. Getting hit costs a life. Your best run is saved in the browser.
- `P` / `Esc` pause, `M` mute.

## Run / build
```
npm install && npm run dev      # local dev server
npm install && npm run build    # static site in dist/
```
`dist/` uses relative URLs, so it can be served from any subpath (e.g. `/baemani/`).

## Next steps
- Deploy `dist/` to games.prithivraj.xyz/baemani/ via the owner's Vercel project.
- Remaining ideas: swipe controls, per-character stats, real crosswalk/signal levels, code-split Tone.js (audio) to shrink the bundle, delete unused `src/character.js` and `src/limousine.js`.
