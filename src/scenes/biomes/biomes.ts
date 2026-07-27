import type { EnemyType } from "@/types/game";
import { AREA_LIVE_CAP, AREA_TOTAL_ENEMIES } from "@config/area";

// The three starting biomes. For now a biome is only a background colour and a
// creature pool — points of interest, treasure and dungeons come later, as does
// the dedicated portal travel screen that replaces the temporary picker.
export type BiomeId = "forest" | "desert" | "tundra";

export interface BiomeDefinition {
    id: BiomeId;
    // Player-facing name, used by the biome picker and the HUD.
    name: string;
    // Applied per-scene via `cameras.main.setBackgroundColor`, so the global
    // `backgroundColor` in PhaserGame.tsx (and therefore the town) is untouched.
    backgroundColor: string;
    // Creatures that spawn here, and the pool the boss is promoted from.
    enemies: EnemyType[];
    // Total enemies to clear before the boss, and how many may be alive at once.
    total: number;
    liveCap: number;
}

// Difficulty tiers, overlapping at the edges so the ramp between biomes is a
// slope rather than a step: the forest is the starter, the tundra the hardest.
// `total`/`liveCap` are identical across the three for now — they live on the
// definition so per-biome tuning is a config edit rather than a refactor.
export const BIOMES: Record<BiomeId, BiomeDefinition> = {
    forest: {
        id: "forest",
        name: "Forest",
        backgroundColor: "#4a7c3f",
        enemies: ["baby-ghoul", "ghoul", "imp"],
        total: AREA_TOTAL_ENEMIES,
        liveCap: AREA_LIVE_CAP,
    },
    desert: {
        id: "desert",
        name: "Desert",
        backgroundColor: "#d9c06a",
        enemies: ["imp", "ghoul", "satyr", "egbert"],
        total: AREA_TOTAL_ENEMIES,
        liveCap: AREA_LIVE_CAP,
    },
    tundra: {
        id: "tundra",
        name: "Tundra",
        backgroundColor: "#e8eef2",
        enemies: ["satyr", "egbert", "slime"],
        total: AREA_TOTAL_ENEMIES,
        liveCap: AREA_LIVE_CAP,
    },
};

export const DEFAULT_BIOME: BiomeId = "forest";

export const BIOME_IDS = Object.keys(BIOMES) as BiomeId[];

// Narrows an unknown/absent id to a real biome, falling back to the default
// rather than throwing — a bad id should drop the player somewhere playable.
export function resolveBiome(id?: BiomeId): BiomeDefinition {
    return (id && BIOMES[id]) || BIOMES[DEFAULT_BIOME];
}
