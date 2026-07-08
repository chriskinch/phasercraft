// Typed REST client for the co-op signaling service (`/api/coop/*`). Mirrors
// the armory client's shape (src/lib/armoryClient.ts): a thin fetch wrapper
// over the handshake endpoints, nothing else — gameplay traffic goes over the
// WebRTC data channel, never through this API.

/** A non-trickle SDP blob, matching `api/coop/_lib/types.ts`. */
export interface CoopSignal {
    type: "offer" | "answer";
    sdp: string;
}

export interface CoopSessionSnapshot {
    offer: CoopSignal;
    answer: CoopSignal | null;
}

/** Seam the transport depends on, so tests can fake signaling without fetch. */
export interface SignalingClient {
    createSession(offer: CoopSignal): Promise<{ code: string }>;
    getSession(code: string): Promise<CoopSessionSnapshot | null>;
    postAnswer(code: string, answer: CoopSignal): Promise<boolean>;
}

// Same-origin by default: the game and its functions deploy together on
// Vercel, and the Vite dev server serves the same handlers at this path.
const baseUrl = (): string => (import.meta.env.VITE_COOP_URL || "/api/coop").replace(/\/$/, "");

export const httpSignalingClient: SignalingClient = {
    async createSession(offer) {
        const res = await fetch(`${baseUrl()}/session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ offer }),
        });
        if (!res.ok) throw new Error(`Failed to create co-op session (${res.status}).`);
        return (await res.json()) as { code: string };
    },

    /** Returns null for an unknown/expired code (a 404), throws on other failures. */
    async getSession(code) {
        const res = await fetch(`${baseUrl()}/session/${encodeURIComponent(code)}`);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`Failed to look up co-op session (${res.status}).`);
        return (await res.json()) as CoopSessionSnapshot;
    },

    /** Returns false for an unknown/expired code (a 404), throws on other failures. */
    async postAnswer(code, answer) {
        const res = await fetch(`${baseUrl()}/session/${encodeURIComponent(code)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answer }),
        });
        if (res.status === 404) return false;
        if (!res.ok) throw new Error(`Failed to submit co-op answer (${res.status}).`);
        return true;
    },
};
