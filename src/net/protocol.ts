// Wire protocol for the co-op data channel (epic #2). Every message is a
// single JSON text frame on the reliable-ordered channel.
//
// Authority model (v2, maintainer-confirmed):
//   - Each client is authoritative for its *own* avatar (per #391 — a remote
//     player is a lightweight replicated entity, not a simulated character).
//   - The HOST is authoritative for enemies, waves, loot, and the game-over
//     decision. The guest renders replicated enemies/loot and sends *events*
//     (damage dealt, loot touched) that the host validates and applies.

import { playerNames, type PlayerName } from "@entities/Player/AssignClass";

export const PROTOCOL_VERSION = 2;

/** One enemy in a host→guest state snapshot. */
export interface EnemySnapshot {
    /** The host-side Enemy.uuid — stable for the enemy's lifetime. */
    id: string;
    /** Texture/type key ("baby-ghoul", …) — anims are global, keyed off this. */
    key: string;
    x: number;
    y: number;
    /** Current and max health, for the guest-side health bar. */
    hp: number;
    max: number;
}

/** What a loot drop looks like on the wire. kind is "coin", "gem", or a crafting key. */
export interface LootSnapshot {
    id: string;
    kind: string;
    x: number;
    y: number;
}

export type CoopMessage =
    /** Sent once by each side when the channel opens. */
    | { t: "hello"; v: number; character: PlayerName }
    /** Presence snapshot for the sender's avatar, ~10Hz while connected. */
    | { t: "state"; x: number; y: number; area: string }
    /** Graceful goodbye so the peer can distinguish "left" from "dropped". */
    | { t: "bye" }
    // ---- host → guest (authoritative world state) ----
    /** Full snapshot of live enemies, ~10Hz while the host is in the arena. */
    | { t: "enemies"; list: EnemySnapshot[] }
    /** An enemy died; both players are awarded the full xp. */
    | { t: "enemyDead"; id: string; xp: number }
    /** A loot drop spawned in the world. */
    | { t: "loot"; loot: LootSnapshot }
    /** A loot drop is gone. by="guest" → the guest collected it (crafting credit). */
    | { t: "lootGone"; id: string; by?: "host" | "guest" }
    /** Credit yourself this many coins (coin/gem pickups pay out to both players). */
    | { t: "coins"; value: number }
    /** An enemy hit YOUR avatar for this much raw power (pre-defence). */
    | { t: "peerHit"; power: number }
    /** Authoritative wave number (sent on start and every advance). */
    | { t: "wave"; n: number }
    /** The wave was cleared — downed players revive. */
    | { t: "waveDone" }
    /** Both players are dead — the run is over. */
    | { t: "gameOver" }
    // ---- guest → host (combat/loot events for validation) ----
    /** The guest dealt damage to enemy `id`. */
    | { t: "hit"; id: string; power: number; crit: boolean }
    /** The guest touched loot `id` and wants to collect it. */
    | { t: "lootTake"; id: string }
    // ---- either direction ----
    /** The sender's avatar just died (spectating until wave clear). */
    | { t: "down" };

export const encodeMessage = (message: CoopMessage): string => JSON.stringify(message);

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isPlayerName = (value: unknown): value is PlayerName =>
    typeof value === "string" && (playerNames as string[]).includes(value);

const isFiniteNumber = (value: unknown): value is number =>
    typeof value === "number" && Number.isFinite(value);

const isEnemySnapshot = (value: unknown): value is EnemySnapshot =>
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.key === "string" &&
    isFiniteNumber(value.x) &&
    isFiniteNumber(value.y) &&
    isFiniteNumber(value.hp) &&
    isFiniteNumber(value.max);

const isLootSnapshot = (value: unknown): value is LootSnapshot =>
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.kind === "string" &&
    isFiniteNumber(value.x) &&
    isFiniteNumber(value.y);

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
        case "enemies":
            if (!Array.isArray(data.list) || !data.list.every(isEnemySnapshot)) return null;
            return { t: "enemies", list: data.list };
        case "enemyDead":
            if (typeof data.id !== "string" || !isFiniteNumber(data.xp)) return null;
            return { t: "enemyDead", id: data.id, xp: data.xp };
        case "loot":
            if (!isLootSnapshot(data.loot)) return null;
            return { t: "loot", loot: data.loot };
        case "lootGone":
            if (typeof data.id !== "string") return null;
            if (data.by !== undefined && data.by !== "host" && data.by !== "guest") return null;
            return { t: "lootGone", id: data.id, by: data.by };
        case "coins":
            if (!isFiniteNumber(data.value) || data.value <= 0) return null;
            return { t: "coins", value: data.value };
        case "peerHit":
            if (!isFiniteNumber(data.power) || data.power < 0) return null;
            return { t: "peerHit", power: data.power };
        case "wave":
            if (!isFiniteNumber(data.n) || data.n < 1) return null;
            return { t: "wave", n: data.n };
        case "waveDone":
            return { t: "waveDone" };
        case "gameOver":
            return { t: "gameOver" };
        case "hit":
            if (typeof data.id !== "string" || !isFiniteNumber(data.power)) return null;
            return { t: "hit", id: data.id, power: data.power, crit: data.crit === true };
        case "lootTake":
            if (typeof data.id !== "string") return null;
            return { t: "lootTake", id: data.id };
        case "down":
            return { t: "down" };
        default:
            return null;
    }
};
