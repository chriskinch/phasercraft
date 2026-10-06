// Pure rules for the clustered spawn configurations (#595): which kind of group
// comes next, how many are in it, which creatures, and how they scatter around
// the group's centre. No Phaser here; `random` is injected like Math.random.

import type { Point } from "./spawnGeometry";

export type SpawnConfigKind = "group" | "pair" | "pack";

export interface SpawnConfigTuning {
    // Relative weights of each kind; they need not sum to anything in particular.
    configWeights: Record<SpawnConfigKind, number>;
    // Inclusive [min, max] head counts. A pair is always two.
    groupSize: [number, number];
    packSize: [number, number];
    // Chance a pack draws each member separately; otherwise it is one species.
    packMixedChance: number;
}

export interface SpawnConfig<Id> {
    kind: SpawnConfigKind;
    ids: Id[];
}

const KINDS: SpawnConfigKind[] = ["group", "pair", "pack"];

/** A whole number in [min, max], uniformly. */
export function randomInt([min, max]: [number, number], random: () => number): number {
    return min + Math.floor(random() * (max - min + 1));
}

/** One kind, drawn in proportion to its weight. */
export function pickKind(
    weights: Record<SpawnConfigKind, number>,
    random: () => number
): SpawnConfigKind {
    const total = KINDS.reduce((sum, kind) => sum + Math.max(weights[kind], 0), 0);
    let roll = random() * total;
    for (const kind of KINDS) {
        roll -= Math.max(weights[kind], 0);
        if (roll < 0) return kind;
    }
    return "group";
}

/**
 * The next configuration. A small group draws every member from the pool; a
 * pair is two of one creature; a pack is one creature throughout, or (at
 * `packMixedChance`) each member drawn separately.
 */
export function rollConfig<Id>(
    tuning: SpawnConfigTuning,
    pick: () => Id,
    random: () => number
): SpawnConfig<Id> {
    const kind = pickKind(tuning.configWeights, random);
    const many = (count: number, mixed: boolean): Id[] => {
        if (mixed) return Array.from({ length: count }, pick);
        const id = pick();
        return Array.from({ length: count }, () => id);
    };

    switch (kind) {
        case "pair":
            return { kind, ids: many(2, false) };
        case "pack": {
            const count = randomInt(tuning.packSize, random);
            return { kind, ids: many(count, random() < tuning.packMixedChance) };
        }
        default:
            return { kind, ids: many(randomInt(tuning.groupSize, random), true) };
    }
}

/**
 * How far a configuration's members scatter from its centre: `base` for a lone
 * creature, growing with the square root of the head count so a pack's density
 * stays about the same as a pair's.
 */
export function clusterRadius(count: number, base: number): number {
    return base * Math.sqrt(count);
}

/** A point uniformly inside the disc of `radius` around `centre`. */
export function sampleInDisc(centre: Point, radius: number, random: () => number): Point {
    const angle = random() * Math.PI * 2;
    // sqrt keeps the density even across the disc rather than bunched at the middle.
    const distance = radius * Math.sqrt(random());
    return {
        x: centre.x + Math.cos(angle) * distance,
        y: centre.y + Math.sin(angle) * distance,
    };
}
