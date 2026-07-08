// Co-op session service: owns the WebRTC peer connection, the signaling
// handshake (join code → SDP via /api/coop), and the data channel (epic #2,
// spike #390). Lives outside Phaser and Redux on purpose:
//   - it must survive scene transitions (town ↔ dungeon), so no scene owns it;
//   - session state is runtime-only and must never leak into the Redux store,
//     which is snapshotted wholesale into save games (see saveStorage).
// The React panel subscribes via useSyncExternalStore(subscribe, getState);
// scenes attach a CoopPresence that subscribes to the same service.
//
// Topology (maintainer-confirmed in #2): host + guest, non-trickle ICE so the
// whole handshake is one offer blob and one answer blob through Vercel KV.
// Gameplay traffic then flows direct P2P over the reliable-ordered channel.

import type { PlayerName } from "@entities/Player/AssignClass";
import type { CoopSignal, SignalingClient } from "@/lib/coopClient";
import { httpSignalingClient } from "@/lib/coopClient";
import { decodeMessage, encodeMessage, PROTOCOL_VERSION, type CoopMessage } from "./protocol";

export type CoopStatus = "idle" | "hosting" | "connecting" | "connected" | "error";
export type CoopRole = "host" | "guest";

export interface CoopState {
    status: CoopStatus;
    role: CoopRole | null;
    /** Join code to read to the other player (host only, once created). */
    code: string | null;
    /** Human-readable failure reason when status is "error". */
    error: string | null;
    /** The peer's character class, known once their hello arrives. */
    peerCharacter: PlayerName | null;
}

const IDLE_STATE: CoopState = {
    status: "idle",
    role: null,
    code: null,
    error: null,
    peerCharacter: null,
};

/** Minimal surface of RTCPeerConnection the session uses — injectable in tests. */
export type PeerConnectionLike = Pick<
    RTCPeerConnection,
    | "createDataChannel"
    | "createOffer"
    | "createAnswer"
    | "setLocalDescription"
    | "setRemoteDescription"
    | "localDescription"
    | "iceGatheringState"
    | "connectionState"
    | "close"
    | "addEventListener"
    | "removeEventListener"
> & {
    ondatachannel: ((event: RTCDataChannelEvent) => void) | null;
    onconnectionstatechange: ((ev: Event) => void) | null;
};

export interface CoopSessionOptions {
    signaling?: SignalingClient;
    createPeerConnection?: () => PeerConnectionLike;
    /** How often the host polls signaling for the guest's answer. */
    pollIntervalMs?: number;
    /** How long the host waits for a guest before giving up. */
    answerTimeoutMs?: number;
    /** How long either side waits for the data channel to open after SDP exchange. */
    connectTimeoutMs?: number;
    /** Cap on non-trickle ICE gathering before sending whatever we have. */
    iceGatherTimeoutMs?: number;
}

// Public STUN is enough for most home NATs; symmetric NATs need TURN, which is
// explicitly out of scope for the POC (documented in docs/COOP_POC.md).
const RTC_CONFIG: RTCConfiguration = {
    iceServers: [{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }],
};

const defaultCreatePeerConnection = (): PeerConnectionLike => new RTCPeerConnection(RTC_CONFIG);

export class CoopSession {
    private state: CoopState = IDLE_STATE;
    private stateListeners = new Set<() => void>();
    private messageListeners = new Set<(message: CoopMessage) => void>();
    private pc: PeerConnectionLike | null = null;
    private channel: RTCDataChannel | null = null;
    private timers = new Set<ReturnType<typeof setTimeout>>();
    // Bumped on every disconnect; in-flight async handshake steps check it and
    // abandon themselves when a newer generation has taken over.
    private generation = 0;

    private readonly signaling: SignalingClient;
    private readonly createPeerConnection: () => PeerConnectionLike;
    private readonly pollIntervalMs: number;
    private readonly answerTimeoutMs: number;
    private readonly connectTimeoutMs: number;
    private readonly iceGatherTimeoutMs: number;

    constructor(options: CoopSessionOptions = {}) {
        this.signaling = options.signaling ?? httpSignalingClient;
        this.createPeerConnection = options.createPeerConnection ?? defaultCreatePeerConnection;
        this.pollIntervalMs = options.pollIntervalMs ?? 1500;
        this.answerTimeoutMs = options.answerTimeoutMs ?? 5 * 60 * 1000;
        this.connectTimeoutMs = options.connectTimeoutMs ?? 30 * 1000;
        this.iceGatherTimeoutMs = options.iceGatherTimeoutMs ?? 2500;
    }

    // ---- external-store contract (React useSyncExternalStore + scenes) ----

    subscribe = (listener: () => void): (() => void) => {
        this.stateListeners.add(listener);
        return () => this.stateListeners.delete(listener);
    };

    getState = (): CoopState => this.state;

    isConnected(): boolean {
        return this.state.status === "connected";
    }

    onMessage(listener: (message: CoopMessage) => void): () => void {
        this.messageListeners.add(listener);
        return () => this.messageListeners.delete(listener);
    }

    // ---- session lifecycle ----

    /** Creates a session: gathers an offer, publishes it, polls for the answer. */
    async host(profile: { character: PlayerName }): Promise<void> {
        if (this.state.status !== "idle" && this.state.status !== "error") return;
        const generation = ++this.generation;
        this.setState({ ...IDLE_STATE, status: "hosting", role: "host" });

        try {
            const pc = (this.pc = this.createPeerConnection());
            this.watchConnection(pc);
            this.wireChannel(pc.createDataChannel("coop"), profile);

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            await this.waitForIceGathering(pc);
            if (this.stale(generation)) return;

            const local = pc.localDescription;
            if (!local?.sdp) throw new Error("No local SDP after ICE gathering.");
            const { code } = await this.signaling.createSession({ type: "offer", sdp: local.sdp });
            if (this.stale(generation)) return;
            this.setState({ ...this.state, code });

            this.pollForAnswer(pc, code, generation, Date.now());
        } catch (err) {
            this.fail(generation, err, "Could not create the co-op session.");
        }
    }

    /** Joins a hosted session by code: fetches the offer, answers it. */
    async join(rawCode: string, profile: { character: PlayerName }): Promise<void> {
        if (this.state.status !== "idle" && this.state.status !== "error") return;
        const generation = ++this.generation;
        const code = rawCode.trim().toUpperCase();
        this.setState({ ...IDLE_STATE, status: "connecting", role: "guest", code });

        try {
            const session = await this.signaling.getSession(code);
            if (this.stale(generation)) return;
            if (!session) {
                this.fail(
                    generation,
                    null,
                    "No session found for that code (it may have expired)."
                );
                return;
            }

            const pc = (this.pc = this.createPeerConnection());
            this.watchConnection(pc);
            pc.ondatachannel = (event) => this.wireChannel(event.channel, profile);

            await pc.setRemoteDescription({ type: "offer", sdp: session.offer.sdp });
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            await this.waitForIceGathering(pc);
            if (this.stale(generation)) return;

            const local = pc.localDescription;
            if (!local?.sdp) throw new Error("No local SDP after ICE gathering.");
            const accepted = await this.signaling.postAnswer(code, {
                type: "answer",
                sdp: local.sdp,
            });
            if (this.stale(generation)) return;
            if (!accepted) {
                this.fail(generation, null, "The session expired before the answer was sent.");
                return;
            }

            this.startTimer(() => {
                if (!this.stale(generation) && this.state.status !== "connected") {
                    this.fail(generation, null, "Timed out waiting for the connection to open.");
                }
            }, this.connectTimeoutMs);
        } catch (err) {
            this.fail(generation, err, "Could not join the co-op session.");
        }
    }

    /** Sends one message; returns false when the channel is not open. */
    send(message: CoopMessage): boolean {
        if (!this.channel || this.channel.readyState !== "open") return false;
        this.channel.send(encodeMessage(message));
        return true;
    }

    /** Tears the session down. With a reason → error state; without → idle. */
    disconnect(reason: string | null = null): void {
        this.generation++;
        for (const timer of this.timers) clearTimeout(timer);
        this.timers.clear();

        if (this.channel) {
            if (this.channel.readyState === "open") {
                // Best-effort goodbye so the peer shows "left" rather than "lost".
                try {
                    this.channel.send(encodeMessage({ t: "bye" }));
                } catch {
                    // Channel raced shut — the connectionstatechange path covers it.
                }
            }
            this.channel.onmessage = null;
            this.channel.onclose = null;
            this.channel = null;
        }
        if (this.pc) {
            this.pc.ondatachannel = null;
            this.pc.onconnectionstatechange = null;
            this.pc.close();
            this.pc = null;
        }
        this.setState(reason ? { ...IDLE_STATE, status: "error", error: reason } : IDLE_STATE);
    }

    // ---- internals ----

    private setState(next: CoopState): void {
        this.state = next;
        for (const listener of this.stateListeners) listener();
    }

    private stale(generation: number): boolean {
        return generation !== this.generation;
    }

    private fail(generation: number, err: unknown, fallback: string): void {
        if (this.stale(generation)) return;
        const message = err instanceof Error && err.message ? err.message : fallback;
        console.error("[coop] session failed:", err ?? fallback);
        this.disconnect(message);
    }

    private startTimer(fn: () => void | Promise<void>, delayMs: number): void {
        const timer = setTimeout(() => {
            this.timers.delete(timer);
            void fn();
        }, delayMs);
        this.timers.add(timer);
    }

    private pollForAnswer(
        pc: PeerConnectionLike,
        code: string,
        generation: number,
        startedAt: number
    ): void {
        this.startTimer(async () => {
            if (this.stale(generation)) return;
            if (Date.now() - startedAt > this.answerTimeoutMs) {
                this.fail(generation, null, "Nobody joined before the session expired.");
                return;
            }
            try {
                const session = await this.signaling.getSession(code);
                if (this.stale(generation)) return;
                if (session?.answer) {
                    await pc.setRemoteDescription({
                        type: "answer",
                        sdp: session.answer.sdp,
                    });
                    // Channel-open (via wireChannel) flips us to connected; guard
                    // against a peer that never completes ICE.
                    this.startTimer(() => {
                        if (!this.stale(generation) && this.state.status !== "connected") {
                            this.fail(
                                generation,
                                null,
                                "A player answered but the connection never opened."
                            );
                        }
                    }, this.connectTimeoutMs);
                    return;
                }
                if (!session && this.state.status === "hosting") {
                    this.fail(generation, null, "The co-op session expired.");
                    return;
                }
                this.pollForAnswer(pc, code, generation, startedAt);
            } catch (err) {
                // Transient signaling blips shouldn't kill a waiting host; retry.
                console.warn("[coop] answer poll failed, retrying:", err);
                if (!this.stale(generation)) this.pollForAnswer(pc, code, generation, startedAt);
            }
        }, this.pollIntervalMs);
    }

    private wireChannel(channel: RTCDataChannel, profile: { character: PlayerName }): void {
        this.channel = channel;
        const generation = this.generation;

        channel.onopen = () => {
            if (this.stale(generation)) return;
            this.setState({ ...this.state, status: "connected", error: null });
            this.send({ t: "hello", v: PROTOCOL_VERSION, character: profile.character });
        };
        channel.onmessage = (event: MessageEvent) => {
            if (this.stale(generation)) return;
            const message = decodeMessage(event.data);
            if (!message) return;
            if (message.t === "hello") {
                this.setState({ ...this.state, peerCharacter: message.character });
            }
            if (message.t === "bye") {
                this.disconnect("Your co-op partner left the game.");
                return;
            }
            for (const listener of this.messageListeners) listener(message);
        };
        channel.onclose = () => {
            if (this.stale(generation)) return;
            if (this.state.status === "connected") {
                this.disconnect("The connection to your co-op partner closed.");
            }
        };
    }

    private watchConnection(pc: PeerConnectionLike): void {
        const generation = this.generation;
        pc.onconnectionstatechange = () => {
            if (this.stale(generation)) return;
            if (pc.connectionState === "failed") {
                this.fail(
                    generation,
                    null,
                    "The peer connection failed (a restrictive NAT may require TURN)."
                );
            }
        };
    }

    private waitForIceGathering(pc: PeerConnectionLike): Promise<void> {
        if (pc.iceGatheringState === "complete") return Promise.resolve();
        return new Promise((resolve) => {
            let settled = false;
            const finish = (): void => {
                if (settled) return;
                settled = true;
                pc.removeEventListener("icegatheringstatechange", check);
                resolve();
            };
            const check = (): void => {
                if (pc.iceGatheringState === "complete") finish();
            };
            pc.addEventListener("icegatheringstatechange", check);
            // Non-trickle with a cap: after the timeout, ship whatever
            // candidates we have (usually everything that matters). A raw
            // setTimeout (not startTimer) so this promise always settles even
            // if the session is torn down mid-wait — callers re-check the
            // generation right after awaiting.
            setTimeout(finish, this.iceGatherTimeoutMs);
        });
    }
}

/** The app-wide session. UI and scenes share this one instance. */
export const coopSession = new CoopSession();
