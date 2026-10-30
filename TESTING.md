# v0.1 regression checklist

Run this checklist on the refactor branch before merging into `main`.

## Startup
- [ ] Load `index.html` through a local web server or preview deployment.
- [ ] Confirm the game canvas, HUD, and start overlay appear.
- [ ] Check the browser console for errors.

## Platformer
- [ ] Start a run and move left/right using arrow keys and A/D.
- [ ] Jump with Space/Up and dash with Shift.
- [ ] Collect crystals and confirm the run counter increases.
- [ ] Touch spikes/enemies and confirm lives decrease.
- [ ] Reach the end or lose all lives; confirm the result screen appears.
- [ ] Pause/resume with P and the pause button.

## Colony
- [ ] Open the colony tab and return to the adventure.
- [ ] Purchase an upgrade with enough crystals.
- [ ] Confirm mining power and crystal balance change.
- [ ] Refresh and confirm saved progress persists.
- [ ] Verify simulated SQK is clearly labelled as non-withdrawable.

## Mobile and audio
- [ ] Test touch movement, jump, and dash.
- [ ] Test the sound toggle and sound effects after a user interaction.
- [ ] Check narrow-screen layout and controls.

## Technical checks
- [ ] Run `node --check js/game.js`.
- [ ] Confirm `index.html` loads `css/style.css` and `js/game.js` successfully.
- [ ] Compare behavior against the existing `main` version.

Do not merge until the gameplay checks pass. The refactor should not introduce new gameplay features.
