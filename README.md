# Cool Clock

> Check it out at https://planetaryclock.netlify.app/

A simple, animated analog clock with:

- Dynamic shadows that change through the day
- A stronger default night shadow
- A soft directional light gradient over the face
- Moving second and minute hands with optional ticking sound

## Getting Started

1. Clone or download this repository.
2. Run `npm i`
3. Run `npm run dev`

That’s it — no build step required.

## Project Structure

- `index.html` — Markup for the clock and controls.
- `src/style.css` — Styles for the clock, hands, and light overlay.
- `src/main.js` — Clock logic, animated hands, shadows, and sound.
- `src/planetTimer.js` — Utility for showing planetary “days” (optional).

## Controls

- Click the speaker icon to toggle ticking sound on/off.

## Customization

- Shadow time zone: In `src/main.js`, search for `Asia/Kolkata` and replace with your preferred IANA time zone (e.g., `America/New_York`).
- Shadow strength: Adjust the `opts` values in `calculateBoxShadow` inside `src/main.js`.
- Night shadow: Tweak the fixed layered values returned when it’s night.
- Light gradient: Modify the gradient stops/opacities in `.lightOverlay` within `src/style.css`.

## Notes

- Everything runs in the browser; no external dependencies.
- Tested in modern Chromium-based browsers.
