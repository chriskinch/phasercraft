// Wire types for the co-op signaling service (epic #2, spike #390).
//
// The service brokers exactly one WebRTC offer/answer handoff per session:
// the host posts an SDP offer and receives a short join code; the guest looks
// the offer up by code and posts an SDP answer; the host polls until the
// answer appears. Gameplay traffic never touches this API — once the peers
// connect, everything flows over the RTCDataChannel.

/** A non-trickle SDP blob (ICE candidates are embedded in the sdp string). */
export interface CoopSignal {
    type: "offer" | "answer";
    sdp: string;
}

export interface CoopSessionRecord {
    offer: CoopSignal;
    answer: CoopSignal | null;
    createdAt: number;
}

/** Sessions are short-lived: long enough to read a code to a friend, no more. */
export const SESSION_TTL_SECONDS = 600;

/** Generous cap on SDP size — real offers with embedded candidates are ~2-10KB. */
export const MAX_SDP_LENGTH = 100_000;

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

/** Validates an incoming signal body field ({ type, sdp }) of the expected kind. */
export const parseSignal = (value: unknown, kind: "offer" | "answer"): CoopSignal | null => {
    if (!isRecord(value)) return null;
    const { type, sdp } = value;
    if (type !== kind) return null;
    if (typeof sdp !== "string" || sdp.length === 0 || sdp.length > MAX_SDP_LENGTH) return null;
    return { type: kind, sdp };
};
