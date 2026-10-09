import enemyTypes from "@config/enemies.json";
import { SPECIAL_DROP_RATE } from "@/types/game";
import { SCROLL_DROP_RATE } from "@/lib/scrollDrops";
import type { EnemyConfig, EnemyType, LootDropRate, LootTable } from "@/types/game";
import type { Settings } from "@services/settingsStorage";
import type { SpawnConfigKind } from "@helpers/spawnConfig";

// Enemies populate a combat area as the player moves through it, and exploring
// new ground may bring on the area's miniboss (#594). Nothing clears an area
// yet — that waits on the boss epic. Leaving and re-entering starts the area
// afresh, so none of this is persisted.

// The miniboss is found by exploring, not by waiting. The map is split into
// square cells this many world px across (about 5 s of walking), and each cell
// counts once, the first time the player steps into it (the start cell never
// does). The Nth counted cell since the last miniboss rolls N ×
// MINIBOSS_CHANCE_PER_CELL, so the odds climb with exploring: at 1% the first
// new cell is 1%, the tenth 10%, and the 100th certain (about 12 cells on
// average). The count resets when a miniboss is rolled and stays at 0 while it
// is up.
export const EXPLORATION_CELL_SIZE = 512;
export const MINIBOSS_CHANCE_PER_CELL = 0.01;

// Enemies get tougher the further from the player's start they spawn (#596):
// health and damage × the biome's own factor at the start, rising linearly to
// biome × this at the furthest spawnable point of the map. The single knob for
// how much harder the far reaches are.
export const DISTANCE_MAX_MULTIPLIER = 3;

// Species picks lean by distance too (#598): the weakest species of a biome's
// pool is this much likelier than the strongest at the start (fraction 0), and
// the strongest this much likelier than the weakest at the far edge (1).
export const WEAKEST_BIAS_AT_START = 2;
export const STRONGEST_BIAS_AT_EDGE = 3;

// Regular enemies arrive in configurations (#595): mostly small groups of 1-3
// mixed creatures, sometimes a pair of one creature, now and then a pack of
// 5-10 (one species, or mixed at PACK_MIXED_CHANCE). The weights are relative.
export const SPAWN_CONFIG_WEIGHTS = { group: 70, pair: 22, pack: 8 } as const;
export const GROUP_SIZE: [number, number] = [1, 3];
export const PACK_SIZE: [number, number] = [5, 10];
export const PACK_MIXED_CHANCE = 0.7;

// Packs get commoner further out (#599): the pack weight above is the one at
// the player's start, easing linearly to this at the furthest spawnable point,
// the difference taken from the small groups (70/22/8 at the start, 58/22/20
// at the far edge).
export const PACK_WEIGHT_AT_EDGE = 20;

// A safe pocket around the player's start (#599), in world px: no pack spawns
// with its centre inside it, and exploration cells whose centre lies inside it
// never count towards the miniboss. Groups and pairs spawn as usual.
export const SAFE_START_RADIUS = 1500;

// A configuration's members scatter around its centre within this radius × the
// square root of the head count (48 px alone, about 150 px for a pack of 10).
// The whole circle sits beyond the spawn radius, so no member is seen arriving.
export const CLUSTER_BASE_RADIUS = 48;

// Spots tried per member around a candidate centre before leaving it out.
export const CLUSTER_MEMBER_ATTEMPTS = 4;

// A new configuration spawns each interval while fewer than the live cap are
// alive. The cap is checked before the roll, so a pack may take the count past
// it (up to cap - 1 + the largest pack).
export const AREA_LIVE_CAP = 25;
export const SPAWN_INTERVAL_MS = 3000;

// An enemy further than the despawn radius from the player for this long,
// continuously, despawns. The clock resets whenever it comes back within range.
// The despawn radius is the spawn radius plus the largest cluster's diameter
// (~304 px), so a pack member placed at the far edge of its circle does not
// start out despawning.
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
    explorationCellSize: number;
    minibossChancePerCell: number;
    configWeights: Record<SpawnConfigKind, number>;
    groupSize: [number, number];
    packSize: [number, number];
    packMixedChance: number;
    packWeightAtEdge: number;
    safeStartRadius: number;
    clusterBaseRadius: number;
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
    explorationCellSize: EXPLORATION_CELL_SIZE,
    minibossChancePerCell: MINIBOSS_CHANCE_PER_CELL,
    configWeights: { ...SPAWN_CONFIG_WEIGHTS },
    groupSize: GROUP_SIZE,
    packSize: PACK_SIZE,
    packMixedChance: PACK_MIXED_CHANCE,
    packWeightAtEdge: PACK_WEIGHT_AT_EDGE,
    safeStartRadius: SAFE_START_RADIUS,
    clusterBaseRadius: CLUSTER_BASE_RADIUS,
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
    if (positive(settings.minibossChancePerCellOverride))
        tuning.minibossChancePerCell = settings.minibossChancePerCellOverride / 100;
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

// The loot a miniboss drops exactly one of, which difficulty must not boost either.
export const MINIBOSS_PINNED_LOOT: ReadonlySet<LootDropRate["name"]> = new Set(
    Object.keys(MINIBOSS_PINNED_RATES) as LootDropRate["name"][]
);

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
