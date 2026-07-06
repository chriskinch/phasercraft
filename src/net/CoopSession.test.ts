// Exercises the CoopSession handshake state machine end-to-end against fakes:
// an in-memory signaling service (the same contract as /api/coop) and a fake
// RTCPeerConnection pair whose data channels are cross-wired in memory. No
// real WebRTC — that seam is exactly what the fakes replace.

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { CoopSession, type PeerConnectionLike } from "./CoopSession";
import type { CoopSignal, CoopSessionSnapshot, SignalingClient } from "@/lib/coopClient";
import { PROTOCOL_VERSION, type CoopMessage } from "./protocol";

// ---- fake signaling (in-memory /api/coop) ----

class FakeSignaling implements SignalingClient {
    sessions = new Map<string, CoopSessionSnapshot>();
    private counter = 0;

    async createSession(offer: CoopSignal): Promise<{ code: string }> {
        const code = `CODE${++this.counter}`;
        this.sessions.set(code, { offer, answer: null });
        return { code };
    }

    async getSession(code: string): Promise<CoopSessionSnapshot | null> {
        const session = this.sessions.get(code);
        return session ? { offer: session.offer, answer: session.answer } : null;
    }

    async postAnswer(code: string, answer: CoopSignal): Promise<boolean> {
        const session = this.sessions.get(code);
        if (!session) return false;
        session.answer = answer;
        return true;
    }
}

// ---- fake RTCDataChannel / RTCPeerConnection ----

class FakeDataChannel {
    readyState: RTCDataChannelState = "connecting";
    onopen: (() => void) | null = null;
    onmessage: ((event: MessageEvent) => void) | null = null;
    onclose: (() => void) | null = null;
    peer: FakeDataChannel | null = null;
    sent: string[] = [];

    send(data: string): void {
        this.sent.push(data);
        // Deliver synchronously to the cross-wired peer channel.
        this.peer?.onmessage?.({ data } as MessageEvent);
    }

    open(): void {
        this.readyState = "open";
        this.onopen?.();
    }

    close(): void {
        this.readyState = "closed";
        this.onclose?.();
    }
}

class FakePeerConnection {
    iceGatheringState: RTCIceGatheringState = "complete";
    connectionState: RTCPeerConnectionState = "new";
    localDescription: { type: string; sdp: string } | null = null;
    remoteDescription: { type: string; sdp: string } | null = null;
    ondatachannel: ((event: RTCDataChannelEvent) => void) | null = null;
    onconnectionstatechange: (() => void) | null = null;
    channel: FakeDataChannel | null = null;
    closed = false;
    private role: "host" | "guest";

    constructor(role: "host" | "guest") {
        this.role = role;
    }

    createDataChannel(): RTCDataChannel {
        this.channel = new FakeDataChannel();
        return this.channel as unknown as RTCDataChannel;
    }

    async createOffer(): Promise<RTCSessionDescriptionInit> {
        return { type: "offer", sdp: `sdp-offer-${this.role}` };
    }

    async createAnswer(): Promise<RTCSessionDescriptionInit> {
        return { type: "answer", sdp: `sdp-answer-${this.role}` };
    }

    async setLocalDescription(desc: RTCSessionDescriptionInit): Promise<void> {
        this.localDescription = { type: desc.type ?? "offer", sdp: desc.sdp ?? "" };
    }

    async setRemoteDescription(desc: RTCSessionDescriptionInit): Promise<void> {
        this.remoteDescription = { type: desc.type ?? "answer", sdp: desc.sdp ?? "" };
    }

    /** Test hook: the guest "receives" the host's channel and both ends open. */
    connectTo(host: FakePeerConnection): FakeDataChannel {
        const guestChannel = new FakeDataChannel();
        const hostChannel = host.channel;
        if (!hostChannel) throw new Error("host has no channel");
        guestChannel.peer = hostChannel;
        hostChannel.peer = guestChannel;
        this.ondatachannel?.({ channel: guestChannel } as unknown as RTCDataChannelEvent);
        hostChannel.open();
        guestChannel.open();
        return guestChannel;
    }

    close(): void {
        this.closed = true;
    }

    addEventListener(): void {}
    removeEventListener(): void {}
}

const asPeerConnection = (fake: FakePeerConnection): PeerConnectionLike =>
    fake as unknown as PeerConnectionLike;

// ---- helpers ----

const flush = async (ms = 0): Promise<void> => {
    await vi.advanceTimersByTimeAsync(ms);
};

describe("CoopSession", () => {
    let signaling: FakeSignaling;
    let hostPc: FakePeerConnection;
    let guestPc: FakePeerConnection;
    let host: CoopSession;
    let guest: CoopSession;

    beforeEach(() => {
        vi.useFakeTimers();
        signaling = new FakeSignaling();
        hostPc = new FakePeerConnection("host");
        guestPc = new FakePeerConnection("guest");
        host = new CoopSession({
            signaling,
            createPeerConnection: () => asPeerConnection(hostPc),
            pollIntervalMs: 100,
        });
        guest = new CoopSession({
            signaling,
            createPeerConnection: () => asPeerConnection(guestPc),
            pollIntervalMs: 100,
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const handshake = async (): Promise<void> => {
        await host.host({ character: "Warrior" });
        expect(host.getState().status).toBe("hosting");
        const code = host.getState().code;
        expect(code).toBeTruthy();

        await guest.join(code as string, { character: "Mage" });
        // Guest has posted its answer; the fake "network" now opens both ends.
        guestPc.connectTo(hostPc);
        // Host's next poll applies the answer.
        await flush(150);
    };

    it("connects host and guest and exchanges hellos", async () => {
        await handshake();

        expect(host.getState().status).toBe("connected");
        expect(guest.getState().status).toBe("connected");
        // Each side learns the other's character from the hello.
        expect(host.getState().peerCharacter).toBe("Mage");
        expect(guest.getState().peerCharacter).toBe("Warrior");
    });

    it("delivers data-channel messages to subscribers", async () => {
        await handshake();

        const received: CoopMessage[] = [];
        const unsubscribe = guest.onMessage((message) => received.push(message));

        expect(host.send({ t: "state", x: 10, y: 20, area: "town" })).toBe(true);
        expect(received).toEqual([{ t: "state", x: 10, y: 20, area: "town" }]);

        unsubscribe();
        host.send({ t: "state", x: 1, y: 2, area: "town" });
        expect(received).toHaveLength(1);
    });

    it("reports an unknown join code as an error", async () => {
        await guest.join("ZZZZZ", { character: "Mage" });
        expect(guest.getState().status).toBe("error");
        expect(guest.getState().error).toMatch(/no session found/i);
    });

    it("a graceful disconnect sends bye and the peer surfaces it", async () => {
        await handshake();

        host.disconnect();
        expect(host.getState().status).toBe("idle");

        expect(guest.getState().status).toBe("error");
        expect(guest.getState().error).toMatch(/left the game/i);
        expect(guestPc.closed).toBe(true);
    });

    it("times out a host nobody joins", async () => {
        const lonely = new CoopSession({
            signaling,
            createPeerConnection: () => asPeerConnection(hostPc),
            pollIntervalMs: 100,
            answerTimeoutMs: 1000,
        });
        await lonely.host({ character: "Cleric" });
        expect(lonely.getState().status).toBe("hosting");

        await flush(1500);
        expect(lonely.getState().status).toBe("error");
        expect(lonely.getState().error).toMatch(/nobody joined/i);
    });

    it("hello v-mismatch frames are ignored, not crashes", async () => {
        await handshake();
        const hostChannel = hostPc.channel;
        // Simulate a peer speaking a future protocol version.
        hostChannel?.peer?.onmessage?.({
            data: JSON.stringify({ t: "hello", v: PROTOCOL_VERSION + 1, character: "Mage" }),
        } as MessageEvent);
        expect(guest.getState().status).toBe("connected");
    });

    it("notifies state subscribers on every transition", async () => {
        const seen: string[] = [];
        host.subscribe(() => seen.push(host.getState().status));
        await handshake();
        expect(seen[0]).toBe("hosting");
        expect(seen[seen.length - 1]).toBe("connected");
    });
});
