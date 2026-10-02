// State digests for the gameplay-equivalence net (#527): a replay is reduced
// to a short hash per checkpoint, so a golden file can say "this seed, this
// many ticks, this exact world" without storing the world.

// 32-bit FNV-1a as 8 hex chars. Not cryptographic; it only has to change when
// the state string does.
export function fnv1a(text: string): string {
    let hash = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) {
        hash ^= text.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(16).padStart(8, "0");
}

// Positions are hashed at 1/100 px: tighter than anything visible, loose
// enough that a last-bit float difference never reads as a behaviour change.
export const fixed = (value: number): string => (Math.round(value * 100) / 100).toFixed(2);

export interface DigestActor {
    key: string;
    x: number;
    y: number;
    health: number;
    state: string;
}

export interface DigestInput {
    player: { x: number; y: number; health: number; alive: boolean };
    // In display-list order, which is spawn order.
    enemies: readonly DigestActor[];
    loot: readonly { key: string; x: number; y: number }[];
}

export function stateString({ player, enemies, loot }: DigestInput): string {
    const parts = [
        `P:${fixed(player.x)},${fixed(player.y)},${player.health},${player.alive ? 1 : 0}`,
        ...enemies.map((e) => `E:${e.key},${fixed(e.x)},${fixed(e.y)},${e.health},${e.state}`),
        ...loot.map((l) => `L:${l.key},${fixed(l.x)},${fixed(l.y)}`),
    ];
    return parts.join("|");
}

export const digest = (input: DigestInput): string => fnv1a(stateString(input));
