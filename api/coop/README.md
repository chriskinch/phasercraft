# Co-op signaling service (`/api/coop/*`)

Minimal WebRTC signaling broker for online co-op (epic #2, spike #390). It
brokers exactly one **join code → SDP offer/answer** handoff per session and
carries **no gameplay traffic** — once the peers connect, everything flows
directly over the `RTCDataChannel`.

## Handshake

1. **Host** gathers a non-trickle SDP offer (ICE candidates embedded) and
   `POST /api/coop/session` `{ offer }` → `{ code }` (a 5-character join code).
2. Host reads the code to the guest out-of-band (voice, chat, …).
3. **Guest** `GET /api/coop/session/:code` → `{ offer }`, applies it, gathers a
   non-trickle answer, and `POST /api/coop/session/:code` `{ answer }`.
4. Host polls `GET /api/coop/session/:code` until `answer` is non-null, applies
   it, and the peer connection completes. The data channel opens P2P.

Sessions live in Vercel KV (Redis) under `coop:session:<code>` with a
10-minute TTL, so abandoned handshakes clean themselves up. Without
`REDIS_URL` the store falls back to in-memory (tests and the Vite dev
middleware, which serves these same handlers at `/api/coop/*` during
`npm run dev`).

Shared HTTP plumbing (`ApiRequest`/`ApiResponse`, CORS, error wrapping) is
imported from `api/armory/_lib/http.ts`.
