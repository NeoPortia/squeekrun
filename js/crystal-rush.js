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
  const dot = document.getElementById('chain-dot');
  const meta = document.getElementById('chain-meta');
  const progress = document.getElementById('chain-progress');
  const strip = document.getElementById('chain-strip');

  let lastHeight = null;
  let activeUntil = 0;
  let nextSpawn = 0;
  let status = 'Connecting to Squeekchain Sepolia…';
  let pendingHeight = null;
  let wasPlaying = false;
  let connected = false;
  let lastChecked = 0;
  let blockProgress = null;
  const testMode = new URLSearchParams(location.search).get('rushTest') === '1';
  let testRequested = false;

  function render() {
    const seconds = Math.ceil(Math.max(0, activeUntil - Date.now()) / 1000);
    hud.textContent = seconds
      ? '⚡ Crystal Rush · ' + seconds + 's'
      : status;
    const age = lastChecked ? Math.floor((Date.now() - lastChecked) / 1000) : null;
    meta.textContent = age === null ? 'Checking…' : 'Checked ' + age + 's ago';
    dot.className = 'chain-dot ' + (connected ? 'online' : 'offline');
    progress.style.width = blockProgress === null ? '0%' :
      Math.max(0, Math.min(100, blockProgress)).toFixed(1) + '%';
    strip.title = connected
      ? 'Squeekchain Sepolia · last checked ' + age + ' seconds ago' +
        (blockProgress === null ? '' : ' · estimated block progress ' + blockProgress.toFixed(1) + '%')
      : 'Squeekchain data unavailable; normal gameplay continues';
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

      connected = true;
      // The API reports blockProgress in hundred-millionths of a block.
      const rawProgress = Number(data.projected.blockProgress);
      blockProgress = Number.isFinite(rawProgress) ? rawProgress / 1000000 : null;
      const height = BigInt(data.projected.blockHeight);
      if (lastHeight !== null && height > lastHeight &&
          height / BigInt(EVERY_BLOCKS) > lastHeight / BigInt(EVERY_BLOCKS)) {
        pendingHeight = height.toString();
      }
      lastHeight = height;
      status = '⛓️ Block #' + height.toString() +
        ' · Rush at #' +
        ((height / BigInt(EVERY_BLOCKS) + 1n) * BigInt(EVERY_BLOCKS)).toString();
    } catch (error) {
      connected = false;
      blockProgress = null;
      status = '⛓️ Sepolia offline · Play normally';
      // Rebaseline on recovery: no catch-up shower for missed network data.
      lastHeight = null;
    }
    lastChecked = Date.now();
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
    if ((pendingHeight !== null || testRequested) && now >= activeUntil) {
      activeUntil = now + RUSH_MS;
      nextSpawn = 0;
      pendingHeight = null;
      testRequested = false;
    }
    if (now < activeUntil && now >= nextSpawn) {
      nextSpawn = now + 650;
      // Place collectible gems near the player's path. Existing game physics,
      // drawing, and collision handling do the rest.
      for (let i = 0; i < 3; i++) {
        game.gems.push({
          x: game.player.x + 65 + i * 42,
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

  // Preview-only test: use ?rushTest=1 and press T during a run.
  // Never changes network height or simulates an API response.
  if (testMode) {
    const hint = document.createElement('span');
    hint.textContent = ' · TEST: press T in-game';
    hint.style.color = '#ffd467';
    hint.style.fontSize = '11px';
    strip.appendChild(hint);
    document.addEventListener('keydown', event => {
      if (event.key.toLowerCase() === 't' && !event.repeat) {
        testRequested = true;
      }
    });
  }

  window.SqueekRush = { tick, crystalValue };
  render();
  poll();
  setInterval(poll, POLL_MS);
  setInterval(render, 250);
})();
