// Distance-weighted species picks (#598). Pure maths, no Phaser: near the
// player's start the weakest creatures of a biome's pool turn up more often,
// out at the far edge the strongest do, and half-way out it is even.

import { STRONGEST_BIAS_AT_EDGE, WEAKEST_BIAS_AT_START } from "@config/area";

/**
 * The strongest species' weight over the weakest's at distance `fraction`:
 * 1/2 at 0, 1 at 0.5, 3 at 1, eased geometrically in between so each half
 * of the map moves the odds smoothly.
 */
export function strongestOverWeakest(fraction: number): number {
    const f = Math.min(Math.max(fraction, 0), 1);
    return f < 0.5
        ? Math.pow(1 / WEAKEST_BIAS_AT_START, 1 - 2 * f)
        : Math.pow(STRONGEST_BIAS_AT_EDGE, 2 * f - 1);
}

/**
 * One weight per species, from its `tier` placed within the pool's own tier
 * range: the weakest gets 1, the strongest `strongestOverWeakest(fraction)`,
 * those between a geometric step along the way. A pool of one tier is even.
 */
export function speciesWeights(tiers: number[], fraction: number): number[] {
    const min = Math.min(...tiers);
    const max = Math.max(...tiers);
    if (max === min) return tiers.map(() => 1);
    const ratio = strongestOverWeakest(fraction);
    return tiers.map((tier) => Math.pow(ratio, (tier - min) / (max - min)));
}

/** One item, drawn in proportion to its weight; `random` returns [0, 1). */
export function weightedPick<T>(items: T[], weights: number[], random: () => number): T {
    const total = weights.reduce((sum, w) => sum + w, 0);
    let roll = random() * total;
    for (let i = 0; i < items.length; i++) {
        roll -= weights[i];
        if (roll < 0) return items[i];
    }
    return items[items.length - 1];
}
