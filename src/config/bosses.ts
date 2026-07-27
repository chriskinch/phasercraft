import enemyTypes from "@config/enemies.json";
import type { EnemyConfig, EnemyType } from "@/types/game";

// Boss promotion (Phase 13).
//
// A biome's boss is one of that biome's own creatures scaled up, rather than a
// separate roster — so every creature needs to work as a boss and the numbers
// have to come from a rule, not a table.
//
// `bosses.json` holds the two hand-tuned bosses this replaces. They do not agree
// with each other: baby-ghoul goes 50 → 500 health (×10) while imp goes 80 → 300
// (×3.75), so no single multiplier reproduces both. ×6 sits between them. Damage
// (×3) and speed (×0.6) are consistent across both entries and carried over as-is.
// `bosses.json` stays in the tree as the reference for the original values.
const DAMAGE_MULTIPLIER = 3;
const HEALTH_MULTIPLIER = 6;
const SPEED_MULTIPLIER = 0.6;

// Both hand-tuned bosses are Melee with a short reach and a tight aggro radius —
// including the imp, whose 200 range collapses to 70. Promotion follows that:
// a boss closes distance and brawls regardless of what the base creature does.
const BOSS_RANGE = 60;
const BOSS_AGGRO_RADIUS = 80;

// Matches the multiplier `spawnBoss` has always applied to boss loot.
const BOSS_COIN_MULTIPLIER = 10;

// Scale a creature from `enemies.json` into that area's boss.
export function promoteToBoss(id: EnemyType): EnemyConfig {
    const base = enemyTypes[id] as EnemyConfig;

    return {
        ...base,
        type: "Melee",
        damage: base.damage * DAMAGE_MULTIPLIER,
        health_max: base.health_max * HEALTH_MULTIPLIER,
        speed: base.speed * SPEED_MULTIPLIER,
        range: BOSS_RANGE,
        aggro_radius: BOSS_AGGRO_RADIUS,
        coin_multiplier: BOSS_COIN_MULTIPLIER,
    };
}
