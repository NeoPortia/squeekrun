# 🐹 SqueekRun: Crystal Caverns

A free-to-play browser platformer and mining-colony game inspired by Squeekchain.

**🎮 [Play SqueekRun](https://squeekrun.vercel.app/)** · **Built by [@defsnotneo](https://x.com/defsnotneo)**

## Play

SqueekRun is live on Vercel: **https://squeekrun.vercel.app/**

No installation or wallet is required. Progress is saved locally in your browser.

## Controls

- **A / D** or **← / →** — Move
- **Space** or **↑** — Jump
- **Shift** — Dash
- **P** — Pause

Collect crystals, avoid cave hazards and enemies, and upgrade your mining colony.

## SQK and blockchain transparency

**All in-game SQK is simulated.** It is not a real on-chain token, has no cash value, and cannot be withdrawn. There are currently **no real mining, staking, or token rewards**. No live Squeekchain blockchain connection is implemented yet.

The mining theme and reward concepts are inspired by [Squeekchain](https://docs.squeekchain.com/), but SqueekRun is an independent fan-made game.

## Roadmap

- **v0.1 — Crystal Caverns:** Initial playable browser game, simulated SQK, colony upgrades, and browser-based saving. **Live.**
- **v0.2 — Crystal Rush:** Planned Squeekchain Sepolia integration. Detect new Squeekchain blocks and trigger a 20-second bonus crystal shower every 10 blocks. **Implemented on the v0.2 feature branch; awaiting preview testing.**
- **v0.3 — Visual and audio overhaul:** More expressive full-body hamster, improved animations and UI, and an original nostalgic chiptune soundtrack. **Planned.**
- **v0.4 — Mobile optimization:** Improve responsive layouts, touchscreen controls, performance, and playability across phones and tablets. **Planned.**

## Road to Mainnet — Long-term vision

If Squeekchain launches SQK on mainnet with usable SQK/ETH liquidity, SqueekRun may explore a player-focused on-chain economy:

- **Squeek Runner NFTs:** Optional collectible hamster characters with distinct appearances and modest, capped **in-game** mining-power bonuses, without excluding free players.
- **Wallet-linked progression:** Optional wallet connection and verifiable achievements, supported by secure score validation and anti-cheat systems.
- **Community reward treasury:** Explore allocating a transparent portion of **net game revenue** (potentially from NFT sales, optional cosmetics, and marketplace royalties actually received) toward acquiring SQK through available liquidity and funding player rewards.
- **SQK player rewards:** Consider distributing real SQK from the game's own funded treasury based on fair, verified participation or achievements, subject to sustainability, legal review, and security safeguards. This would **not** constitute official Squeekchain mining rewards.

Squeekchain's published tokenomics contemplate initial SQK/ETH liquidity, but the amount of ETH backing, available trading depth, and launch conditions are not guaranteed. NFT boosts, treasury allocations, and real-token rewards are **ideas for a potential mainnet phase**, not live features, commitments, investment opportunities, or guaranteed earnings. Any rollout depends on mainnet availability, token liquidity, smart-contract security, legal compliance, and economic viability.

The game will remain playable even when network data is unavailable. Features and release plans may change during development.

## Development

- `main` — live production version, deployed through Vercel
- `refactor/v0.1-code-structure` — code cleanup and testing branch

## Disclaimer

SqueekRun is an unofficial community project and is not affiliated with or endorsed by the Squeekchain team.

Created by **[@defsnotneo](https://x.com/defsnotneo)**.

## Crystal Rush v0.2 testing notes

The v0.2 feature branch polls the official Sepolia `/v1/measurement/blocks` endpoint every 15 seconds. The first successful reading establishes a baseline; it does not trigger a shower. When new accepted provisional Squeek blocks cross a multiple of 10, the game starts a 20-second Crystal Rush during active gameplay, spawning additional crystals worth 2× while the event is active. The UI displays the network block height, the next milestone, and a rush countdown.

Provisional blocks are **not yet settled on Ethereum** and can differ from final on-chain state. API outages disable new events without stopping the platformer. This is testnet gameplay integration only: all SQK shown in-game remains simulated.

Before release, test network connectivity and event timing on a Vercel preview, keyboard/mobile controls, collection accounting, menu-to-run transitions, and offline fallback.
