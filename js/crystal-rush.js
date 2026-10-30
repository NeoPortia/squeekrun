/* Crystal Rush v0.2 — Sepolia testnet gameplay event.
 * Uses provisional Squeek blocks (accepted wheel work), not Ethereum blocks.
 * No wallet, token rewards, or financial value.
 */
(() => {
  'use strict';

  const API = 'https://api.squeekchain.com/v1/measurement/blocks';
  const POLL_MS = 15000;
  const RUSH_MS = 20000;
  const EVERY_BLOCKS = 10;
  const hud = document.getElementById('rush-status');
  const banner = document.getElementById('rush-banner');

  let lastHeight = null;
  let activeUntil = 0;
  let nextSpawn = 0;
  let status = 'Connecting to Squeekchain Sepolia…';
  let pendingHeight = null;
  let wasPlaying = false;

  function render() {
    const seconds = Math.ceil(Math.max(0, activeUntil - Date.now()) / 1000);
    hud.textContent = seconds
      ? '⚡ Crystal Rush: ' + seconds + 's remaining'
      : status;
    banner.hidden = seconds === 0;
    if (seconds) banner.textContent = '⚡ CRYSTAL RUSH · ' + seconds + 's · 2× crystals';
  }

  async function poll() {
    try {
      const response = await fetch(API, { cache: 'no-store' });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const data = await response.json();
      if (data.status !== 'available' || data.freshness !== 'fresh' ||
          !data.projected || !/^\d+$/.test(data.projected.blockHeight)) {
        throw new Error('Squeekchain measurements unavailable');
      }

      const height = BigInt(data.projected.blockHeight);
      if (lastHeight !== null && height > lastHeight &&
          height / BigInt(EVERY_BLOCKS) > lastHeight / BigInt(EVERY_BLOCKS)) {
        pendingHeight = height.toString();
      }
      lastHeight = height;
      status = '⛓️ Sepolia Squeek block #' + height.toString() +
        ' · Next rush at #' +
        ((height / BigInt(EVERY_BLOCKS) + 1n) * BigInt(EVERY_BLOCKS)).toString();
    } catch (error) {
      status = '⛓️ Squeekchain offline · Normal gameplay available';
      // Rebaseline on recovery: no catch-up shower for missed network data.
      lastHeight = null;
    }
    render();
  }

  function tick(game) {
    const now = Date.now();
    if (game.state !== 'playing') {
      wasPlaying = false;
      render();
      return;
    }
    if (!wasPlaying) {
      wasPlaying = true;
      // No events queued while a player is in the menu or between runs.
      pendingHeight = null;
    }
    if (pendingHeight !== null && now >= activeUntil) {
      activeUntil = now + RUSH_MS;
      nextSpawn = 0;
      pendingHeight = null;
    }
    if (now < activeUntil && now >= nextSpawn) {
      nextSpawn = now + 650;
      // Place collectible gems near the player's path. Existing game physics,
      // drawing, and collision handling do the rest.
      for (let i = 0; i < 3; i++) {
        game.gems.push({
          x: Math.min(game.finish - 80, game.player.x + 65 + i * 42),
          y: game.ground - 58 - Math.random() * 60,
          got: false,
          phase: Math.random() * 6,
          rush: true
        });
      }
    }
    render();
  }

  function crystalValue(gem) {
    return gem.rush && Date.now() < activeUntil ? 2 : 1;
  }

  window.SqueekRush = { tick, crystalValue };
  render();
  poll();
  setInterval(poll, POLL_MS);
  setInterval(render, 250);
})();
