// Wire protocol for the co-op data channel (epic #2). Deliberately tiny for
// the POC: peers introduce themselves, then stream presence snapshots. Every
// message is a single JSON text frame on the reliable-ordered channel.
//
// Each client is authoritative for its *own* avatar (per the foundation
// recommendation in #391 — a remote player is a lightweight replicated
// entity, not a full simulated character). Host-authoritative enemy/loot
// replication is a later track of #2 and will extend this union.

import { playerNames, type PlayerName } from "@entities/Player/AssignClass";

export const PROTOCOL_VERSION = 1;

export type CoopMessage =
    /** Sent once by each side when the channel opens. */
    | { t: "hello"; v: number; character: PlayerName }
    /** Presence snapshot for the sender's avatar, ~10Hz while connected. */
    | { t: "state"; x: number; y: number; area: string }
    /** Graceful goodbye so the peer can distinguish "left" from "dropped". */
    | { t: "bye" };

export const encodeMessage = (message: CoopMessage): string => JSON.stringify(message);

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isPlayerName = (value: unknown): value is PlayerName =>
    typeof value === "string" && (playerNames as string[]).includes(value);

const isFiniteNumber = (value: unknown): value is number =>
    typeof value === "number" && Number.isFinite(value);

/** Parses one incoming frame; returns null for anything malformed or unknown. */
export const decodeMessage = (raw: unknown): CoopMessage | null => {
    if (typeof raw !== "string") return null;
    let data: unknown;
    try {
        data = JSON.parse(raw);
    } catch {
        return null;
    }
    if (!isRecord(data)) return null;

    switch (data.t) {
        case "hello":
            if (data.v !== PROTOCOL_VERSION || !isPlayerName(data.character)) return null;
            return { t: "hello", v: data.v, character: data.character };
        case "state":
            if (!isFiniteNumber(data.x) || !isFiniteNumber(data.y)) return null;
            if (typeof data.area !== "string") return null;
            return { t: "state", x: data.x, y: data.y, area: data.area };
        case "bye":
            return { t: "bye" };
        default:
            return null;
    }
};
