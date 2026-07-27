import enemyTypes from "@config/enemies.json";
import type { EnemyConfig, EnemyType } from "@/types/game";

// A combat area holds a fixed pool of enemies. The player clears the pool, a
// boss spawns, and killing the boss clears the area. Leaving and re-entering
// rebuilds the pool from scratch, so none of this is persisted.
export const AREA_TOTAL_ENEMIES = 20;

// How many pool enemies may be alive at once. Each death tops the area back up
// to this cap until the pool is exhausted.
export const AREA_LIVE_CAP = 5;

// The single default pool. Phase 13 PR 2 replaces this with per-biome pools; it
// lives here so the wave removal lands without also changing which creatures
// spawn.
export const DEFAULT_ENEMY_POOL = Object.keys(enemyTypes) as EnemyType[];

// Boss multipliers, derived from the two hand-authored entries in
// `bosses.json` (kept as the reference for these numbers):
//
//   baby-ghoul  damage 50 → 150 (×3)   health 50 → 500 (×10)  speed 50 → 30 (×0.6)
//   imp         damage 25 → 95  (×3.8) health 80 → 300 (×3.75) speed 70 → 40 (×0.57)
//
// The two entries disagree on the health ratio, so ×8 splits them. Both are
// authored as `Melee` with a short range even though the base `imp` is a
// 200-range `Ranged` creature, so a promoted boss is always melee — the boss is
// meant to close on the player rather than kite.
export const BOSS_SCALING = {
    damage: 3,
    health_max: 8,
    speed: 0.6,
    range: 60,
    aggro_radius: 80,
    coin_multiplier: 10,
} as const;

// Promotes one of the area's own creatures into that area's boss.
export function promoteToBoss(id: EnemyType): EnemyConfig {
    const base = enemyTypes[id] as EnemyConfig;

    return {
        ...base,
        type: "Melee",
        damage: Math.round(base.damage * BOSS_SCALING.damage),
        health_max: Math.round(base.health_max * BOSS_SCALING.health_max),
        speed: Math.round(base.speed * BOSS_SCALING.speed),
        range: BOSS_SCALING.range,
        aggro_radius: BOSS_SCALING.aggro_radius,
        coin_multiplier: BOSS_SCALING.coin_multiplier,
    };
}
