import enemyTypes from "@config/enemies.json";
import type { EnemyConfig, EnemyType, LootTable } from "@/types/game";

// Enemies populate a combat area as the player moves through it. Once this many
// have been killed the area's boss spawns, and killing the boss clears the
// area. Despawned enemies do not count. Leaving and re-entering starts the
// count again, so none of this is persisted.
export const AREA_KILLS_TO_BOSS = 20;

// How many regular enemies may be alive at once.
export const AREA_LIVE_CAP = 5;

// While below the live cap, at most one enemy spawns per interval, so the area
// fills gradually rather than in waves.
export const SPAWN_INTERVAL_MS = 750;

// An enemy further than the spawn radius from the player for this long,
// continuously, despawns. The clock resets whenever it comes back within range.
export const DESPAWN_DELAY_MS = 20000;

// Candidate points tried per spawn tick before giving up until the next tick.
export const SPAWN_ATTEMPTS_PER_TICK = 12;

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

// Everything the spawn director reads, bundled so a run can be tuned as one
// value (the Debug settings override some of these; see #462).
export interface AreaTuning {
    killsToBoss: number;
    liveCap: number;
    spawnIntervalMs: number;
    despawnDelayMs: number;
    attemptsPerTick: number;
    // A fixed spawn radius in world px; 0 derives it from the viewport.
    radiusOverride: number;
    radiusMargin: number;
    coneHalfAngleDeg: number;
    movingSpeed: number;
}

export const DEFAULT_AREA_TUNING: Readonly<AreaTuning> = {
    killsToBoss: AREA_KILLS_TO_BOSS,
    liveCap: AREA_LIVE_CAP,
    spawnIntervalMs: SPAWN_INTERVAL_MS,
    despawnDelayMs: DESPAWN_DELAY_MS,
    attemptsPerTick: SPAWN_ATTEMPTS_PER_TICK,
    radiusOverride: 0,
    radiusMargin: SPAWN_RADIUS_MARGIN,
    coneHalfAngleDeg: SPAWN_CONE_HALF_ANGLE_DEG,
    movingSpeed: SPAWN_MOVING_SPEED,
};

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
