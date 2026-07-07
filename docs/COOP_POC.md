# Online co-op POC — architecture and findings

Proof of concept for **epic #2** (online two-player co-op, P2P host/guest).
Covers the transport spike (#390), the first slice of the per-player
foundation (#391), and the **host-authoritative replication track**: two
players connect via a join code, see each other move live, and fight the
same host-simulated waves together — shared enemies, loot, XP, and a
downed/revive rule.

## How to play together

1. Both players open the deployed game (Vercel — the signaling functions and
   KV must be provisioned; see below) and load/start their own character, so
   each is standing in town.
2. Either player opens the **cog menu → Co-op → Host Game** and reads the
   5-character join code to the other (voice, chat, …). Whoever hosts runs
   the authoritative world.
3. The other player opens **cog menu → Co-op**, types the code, hits **Join**.
4. On "Connected!", close the menu — your partner's avatar is in town with
   you. The **host enters the dungeon first** (the host's client simulates
   the waves); when the guest follows, they see and fight the same enemies.

Local dev: `npm run dev` serves the same signaling handlers at
`/api/coop/*` (in-memory), so two tabs on `localhost:8080` can host/join.

## What is (and isn't) in the POC

In scope — the infrastructure the epic needs de-risked:

- **Signaling** (`api/coop/`): Vercel functions + KV brokering a join code →
  SDP offer/answer handoff. Sessions expire after 10 minutes; no gameplay
  traffic touches Vercel. Requires the same `REDIS_URL` env var the armory
  uses (falls back to in-memory per-instance storage without it, which is
  fine for dev but NOT for production — two serverless invocations won't
  share sessions).
- **Transport** (`src/net/CoopSession.ts`): raw `RTCPeerConnection` +
  reliable-ordered `RTCDataChannel`, non-trickle ICE (candidates embedded in
  the SDP, so signaling is a single blob each way). Public Google STUN.
- **Protocol** (`src/net/protocol.ts`): versioned JSON frames — `hello`
  (class introduction), `state` (~10Hz presence snapshots), `bye`.
- **Presence replication** (`src/net/CoopPresence.ts` +
  `src/entities/Player/RemotePlayer.ts`): each client is authoritative for
  its own avatar; the partner renders as a lightweight interpolated entity
  (the "scene-only replicated entity" model recommended in #391). Peers in
  different areas (town vs dungeon) are hidden until areas match.
- **Host-authoritative combat replication** (`src/net/HostReplicator.ts`,
  `src/net/GuestReplicator.ts`, `src/entities/Enemy/RemoteEnemy.ts`,
  `src/entities/Loot/RemoteLoot.ts`): the host simulates enemies, waves, and
  loot exactly as in single-player and streams enemy snapshots (~10Hz) plus
  event messages. The guest spawns nothing — it renders replicated enemies
  (which join the normal `scene.enemies` group, so targeting/auto-attack/
  spell-damage seams work unchanged) and sends validated _events_: damage
  dealt (`hit`) and loot touched (`lootTake`). Enemies target the **nearest**
  of the two avatars; hits on the guest's avatar are relayed to the guest's
  client, which owns its own health.
- **Co-op rules (maintainer-confirmed defaults, tune later):** every kill
  grants full XP to both players; coin/gem pickups pay out to both; crafting
  drops go to whoever grabs them first. A player who dies **spectates** and
  revives when the wave is cleared; the run ends only when both are down
  (the host decides, and relays `gameOver`).

Out of scope — later tracks of #2:

- **Guest CC/banes on enemies**: the guest's direct damage (auto-attacks and
  spells that call `enemy.hit`) is forwarded; debuffs, knockback, and other
  status effects from the guest are not applied to the host's simulation.
- **Enemy↔guest-avatar physics**: on the host, enemies chase and hit the
  guest's replicated avatar but don't collide with it bodily.
- **TURN relay**: peers behind symmetric NATs (some mobile carriers,
  corporate networks) cannot connect with STUN alone. The error state
  surfaces this ("a restrictive NAT may require TURN").
- **Reconnection / host migration**: a drop ends the session (per the epic's
  v1 decision); a guest dropped mid-dungeon is returned to town.

## Spike findings (#390 deliverable)

- **Topology works.** Vercel-brokered signaling (join code → SDP in KV) plus
  a direct WebRTC data channel connects two browsers with no game server.
  Non-trickle ICE keeps the handshake to one offer and one answer blob —
  no candidate streaming through KV, at the cost of ~1–2.5s of gathering
  (capped by `iceGatherTimeoutMs`).
- **Library recommendation: none — use raw `RTCPeerConnection`.** The
  non-trickle host/guest handshake is ~200 lines including state handling;
  `simple-peer` is effectively unmaintained (last release 2021) and PeerJS
  imposes its own broker protocol where we already have Vercel + KV. Zero
  new dependencies, zero bundle growth.
- **Reliability mode:** the POC uses one reliable-ordered channel for
  everything; at 10Hz presence snapshots, head-of-line blocking is not
  noticeable. When host-authoritative replication lands, movement should
  move to an unreliable channel (`ordered: false, maxRetransmits: 0`) and
  events (damage, loot) stay reliable — the protocol's tagged-union format
  already permits routing message types onto separate channels.
- **STUN/TURN:** Google public STUN suffices for typical home NATs
  (host candidates even suffice for two tabs/same LAN). Symmetric NATs need
  TURN, which means running/renting a relay — a cost/ops decision to defer
  until the full build.
- **Latency:** on loopback/LAN, sub-millisecond to a few ms round trip —
  imperceptible. Real cross-network numbers depend on the specific pair of
  ISPs; the `state` cadence (10Hz + client-side interpolation over ~100ms)
  is designed to feel smooth up to ~150ms RTT. Measuring real-world RTT
  in-session (a `ping` protocol message) is a cheap follow-up when tuning
  the replication track.

### Remaining spike validation (open on #390)

The #390 acceptance criterion "two browsers on **different networks**
connect" has not yet been exercised: the automated evidence is two browser
contexts on one machine (host candidates / loopback). The remaining step is
a manual run by two people on different home networks against the deployed
build — note whether STUN sufficed or the "restrictive NAT may require
TURN" error appeared, and roughly how the movement feels. #390 stays open
until that run is recorded there.

## Testing

- `api/coop/handlers.test.ts` — signaling endpoint contract + TTL expiry.
- `src/net/CoopSession.test.ts` — full host/guest handshake state machine
  against fake signaling + fake peer connections.
- `src/net/CoopPresence.test.ts`, `src/entities/Player/RemotePlayer.test.ts`
  — replication, lifecycle discipline (cleanup idempotency), interpolation.
- `src/net/HostReplicator.test.ts`, `src/net/GuestReplicator.test.ts` —
  host-authoritative combat: snapshots, validated hits, loot payout rules,
  down/revive/game-over policy, session-drop teardown.
- `src/entities/Player/Player.coop.test.ts` — reversible down()/revive().
- `src/ui/components/templates/Coop.test.tsx` — panel states.
- Manual/local: `npm run dev`, two tabs, host in one, join from the other.
