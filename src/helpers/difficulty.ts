// Distance × biome difficulty (#596). Pure maths, no Phaser: how far from the
// player's start a point is, as a fraction of the furthest anyone can walk on
// that map, and what multiplier and level that works out to.

import type { Point } from "./spawnGeometry";
import type { WalkabilityGrid } from "./walkability";

// The displayed level is the multiplier × this, rounded: forest start Lv 5,
// tundra's far edge Lv 30.
export const LEVEL_PER_MULTIPLIER = 5;

/**
 * Straight-line distance, in world px, from `start` to the centre of the
 * furthest spawnable tile: the most "far out" a spawn on this map can be.
 */
export function maxSpawnableDistance(grid: WalkabilityGrid, start: Point): number {
    const { width, height, tileWidth, tileHeight, spawnable } = grid;
    let max = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (!spawnable[y * width + x]) continue;
            const d = Math.hypot((x + 0.5) * tileWidth - start.x, (y + 0.5) * tileHeight - start.y);
            if (d > max) max = d;
        }
    }
    return max;
}

/** How far out `point` is, from 0 at `start` to 1 at `maxDistance` (clamped). */
export function distanceFraction(point: Point, start: Point, maxDistance: number): number {
    if (maxDistance <= 0) return 0;
    const d = Math.hypot(point.x - start.x, point.y - start.y);
    return Math.min(d / maxDistance, 1);
}

/**
 * The stat multiplier at `fraction` of the way out: the biome's own factor at
 * the start, rising linearly to biome × `maxMultiplier` at the far edge.
 */
export function difficultyMultiplier(
    biomeFactor: number,
    fraction: number,
    maxMultiplier: number
): number {
    return biomeFactor * (1 + (maxMultiplier - 1) * fraction);
}

/** The level shown on an enemy's health bar. */
export function difficultyLevel(multiplier: number): number {
    return Math.round(multiplier * LEVEL_PER_MULTIPLIER);
}

/**
 * Health and damage scaled by `multiplier`, rounded to whole points; at 1 they
 * are returned unchanged. Healing is a fraction of max health, so it scales
 * with the health it restores and needs nothing here.
 */
export function applyDifficulty<S extends { damage: number; health_max: number }>(
    stats: S,
    multiplier: number
): S {
    return {
        ...stats,
        damage: Math.round(stats.damage * multiplier),
        health_max: Math.round(stats.health_max * multiplier),
    };
}
