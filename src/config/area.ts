import enemyTypes from "@config/enemies.json";
import type { EnemyConfig, EnemyType, LootTable } from "@/types/game";

// A combat area holds a fixed pool of enemies. The player clears the pool, a
// boss spawns, and killing the boss clears the area. Leaving and re-entering
// rebuilds the pool from scratch, so none of this is persisted.
export const AREA_TOTAL_ENEMIES = 20;

// How many pool enemies may be alive at once. Each death tops the area back up
// to this cap until the pool is exhausted.
export const AREA_LIVE_CAP = 5;

// Enemies spawn on a circle around the player, just off screen. By default the
// radius is half the viewport diagonal (the corner distance) plus this margin,
// so even a spawn towards a corner lands outside the view. See `spawnRadius`.
export const SPAWN_RADIUS_MARGIN = 64;

// Half-width of the cone, around the player's direction of travel, that
// enemies spawn in — so they appear ahead of the player rather than behind.
export const SPAWN_CONE_HALF_ANGLE_DEG = 45;

// Player speed (px/s) below which they count as standing still, and enemies
// may spawn in any direction.
export const SPAWN_MOVING_SPEED = 10;

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
    // How much more loot a boss drops than the creature it was promoted from.
    // `loot` scales the drop table itself (see `scaleLootTable`) and
    // `coin_multiplier` scales what each coin/gem is worth when collected, so a
    // boss's coin payout is roughly the product of the two. Tune either here.
    loot: 10,
} as const;

// Scales a loot table's drop quantities by `multiplier`.
//
// `rate` is "drops per kill x 100" as read by `Enemy.dropLoot`: the whole
// hundreds are guaranteed drops and the remainder is the chance of one more
// (e.g. 135 = 1 guaranteed + a 35% chance of a second). Multiplying `rate`
// therefore multiplies the expected drop count linearly while leaving the
// relative rarity of each entry untouched. `bonus` (the size of the occasional
// 25% bonus roll) is scaled alongside it so bonus rolls stay proportionate.
export function scaleLootTable(loot_table: LootTable, multiplier: number): LootTable {
    return loot_table.map((item) => ({
        ...item,
        rate: Math.round(item.rate * multiplier),
        bonus: Math.round(item.bonus * multiplier),
    }));
}

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
        loot_table: scaleLootTable(base.loot_table, BOSS_SCALING.loot),
    };
}
