import type { EnemyType } from "@/types/game";

// Biomes (Phase 13).
//
// The world is being opened up beyond the single combat area. For now a biome
// differs only in its background colour and which creatures live there; POIs,
// treasure and dungeons come later. One BiomeScene reads this table rather than
// there being a scene class per biome.

export type BiomeId = "forest" | "desert" | "tundra";

export interface BiomeDefinition {
    id: BiomeId;
    name: string;
    // Applied per-scene via the camera, so the game-wide backgroundColor in
    // PhaserGame.tsx stays untouched and Town keeps its tilemap look.
    backgroundColor: string;
    enemies: EnemyType[];
    // Enemies in the area before its boss appears.
    total: number;
    // How many of them may be alive at once.
    liveCap: number;
}

// Pools overlap deliberately: neighbouring biomes share a creature or two so the
// difficulty ramp (baby-ghoul → slime) reads as a gradient rather than three
// unrelated rosters. Totals are uniform for now; the per-biome fields exist so
// tuning later is a config edit rather than a code change.
export const BIOMES: Record<BiomeId, BiomeDefinition> = {
    forest: {
        id: "forest",
        name: "Forest",
        backgroundColor: "#4a7c3f",
        enemies: ["baby-ghoul", "ghoul", "imp"],
        total: 20,
        liveCap: 5,
    },
    desert: {
        id: "desert",
        name: "Desert",
        backgroundColor: "#d9c06a",
        enemies: ["imp", "ghoul", "satyr", "egbert"],
        total: 20,
        liveCap: 5,
    },
    tundra: {
        id: "tundra",
        name: "Tundra",
        backgroundColor: "#e8eef2",
        enemies: ["satyr", "egbert", "slime"],
        total: 20,
        liveCap: 5,
    },
};

export const DEFAULT_BIOME: BiomeId = "forest";

export const BIOME_IDS = Object.keys(BIOMES) as BiomeId[];

export function isBiomeId(value: unknown): value is BiomeId {
    return typeof value === "string" && value in BIOMES;
}
