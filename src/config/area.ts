import enemyTypes from "@config/enemies.json";
import { SPECIAL_DROP_RATE } from "@/types/game";
import { SCROLL_DROP_RATE } from "@/lib/scrollDrops";
import type { EnemyConfig, EnemyType, LootDropRate, LootTable } from "@/types/game";
import type { Settings } from "@services/settingsStorage";

// Enemies populate a combat area as the player moves through it, and every
// spawn tick may instead bring on the area's miniboss (#594). Nothing clears an
// area yet — that waits on the boss epic. Leaving and re-entering starts the
// area afresh, so none of this is persisted.

// The miniboss's chance per roll on entering an area, and how long (scene
// clock, so pauses don't count) until it is certain. The chance rises linearly
// in between, is frozen while a miniboss is up, and drops back to the base
// chance when it dies.
export const MINIBOSS_BASE_CHANCE = 0.01;
export const MINIBOSS_RAMP_MS = 10 * 60 * 1000;

// At most one miniboss roll per this long, on the first spawn tick after it has
// elapsed. Kept apart from SPAWN_INTERVAL_MS so the odds per minute don't depend
// on how often regulars are paced in.
export const MINIBOSS_ROLL_INTERVAL_MS = 3000;

// How many regular enemies may be alive at once.
export const AREA_LIVE_CAP = 15;

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
// value (the spawn settings override some of these; see #462).
export interface AreaTuning {
    minibossBaseChance: number;
    minibossRampMs: number;
    minibossRollIntervalMs: number;
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
    minibossBaseChance: MINIBOSS_BASE_CHANCE,
    minibossRampMs: MINIBOSS_RAMP_MS,
    minibossRollIntervalMs: MINIBOSS_ROLL_INTERVAL_MS,
    liveCap: AREA_LIVE_CAP,
    spawnIntervalMs: SPAWN_INTERVAL_MS,
    despawnDelayMs: DESPAWN_DELAY_MS,
    attemptsPerTick: SPAWN_ATTEMPTS_PER_TICK,
    radiusOverride: 0,
    radiusMargin: SPAWN_RADIUS_MARGIN,
    coneHalfAngleDeg: SPAWN_CONE_HALF_ANGLE_DEG,
    movingSpeed: SPAWN_MOVING_SPEED,
};

/**
 * The tuning an area runs with. Each override replaces its default when it is
 * a positive number; 0 (or anything a hand-edited settings payload might hold
 * that is not a positive number) keeps the default. Independent of Debug mode.
 */
export function resolveAreaTuning(settings: Settings): AreaTuning {
    const tuning = { ...DEFAULT_AREA_TUNING };

    const positive = (value: unknown): value is number =>
        typeof value === "number" && Number.isFinite(value) && value > 0;

    if (positive(settings.spawnRadiusOverride))
        tuning.radiusOverride = settings.spawnRadiusOverride;
    if (positive(settings.liveCapOverride)) tuning.liveCap = Math.floor(settings.liveCapOverride);
    if (positive(settings.despawnDelaySeconds))
        tuning.despawnDelayMs = settings.despawnDelaySeconds * 1000;
    return tuning;
}

// Miniboss multipliers, derived from the two hand-authored boss entries
// that used to live in `bosses.json` (removed in #593; numbers kept here):
//
//   baby-ghoul  damage 50 → 150 (×3)   health 50 → 500 (×10)  speed 50 → 30 (×0.6)
//   imp         damage 25 → 95  (×3.8) health 80 → 300 (×3.75) speed 70 → 40 (×0.57)
//
// The two entries disagree on the health ratio, so ×8 splits them. Both are
// authored as `Melee` with a short range even though the base `imp` is a
// 120-range `Ranged` creature, so a promoted miniboss is always melee — the miniboss is
// meant to close on the player rather than kite.
export const MINIBOSS_SCALING = {
    damage: 3,
    health_max: 8,
    speed: 0.6,
    range: 60,
    aggro_radius: 80,
    coin_multiplier: 10,
    // How much more loot a miniboss drops than the creature it was promoted from.
    // `loot` scales the drop table itself (see `scaleLootTable`) and
    // `coin_multiplier` scales what each coin/gem is worth when collected, so a
    // miniboss's coin payout is roughly the product of the two. Tune either here.
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

// Loot a miniboss drops exactly one of, unscaled, whatever its creature's own rate.
const MINIBOSS_PINNED_RATES: Partial<Record<LootDropRate["name"], number>> = {
    special: SPECIAL_DROP_RATE.miniboss,
    scroll: SCROLL_DROP_RATE.miniboss,
};

// Promotes one of the area's own creatures into that area's miniboss.
export function promoteToMiniboss(id: EnemyType): EnemyConfig {
    const base = enemyTypes[id] as EnemyConfig;

    return {
        ...base,
        type: "Melee",
        damage: Math.round(base.damage * MINIBOSS_SCALING.damage),
        health_max: Math.round(base.health_max * MINIBOSS_SCALING.health_max),
        speed: Math.round(base.speed * MINIBOSS_SCALING.speed),
        range: MINIBOSS_SCALING.range,
        aggro_radius: MINIBOSS_SCALING.aggro_radius,
        coin_multiplier: MINIBOSS_SCALING.coin_multiplier,
        // Special items and scrolls are not scaled with the rest (MINIBOSS_PINNED_RATES).
        loot_table: scaleLootTable(base.loot_table, MINIBOSS_SCALING.loot).map((item) => {
            const rate = MINIBOSS_PINNED_RATES[item.name];
            return rate === undefined ? item : { ...item, rate, bonus: 0 };
        }),
    };
}
