import { describe, it, expect, vi } from "vitest";
import { Geom } from "phaser";
import SiphonSoul from "./SiphonSoul";
import type { SpellOptions } from "@/types/game";

// Regression: the Occultist crashed on entering a biome. Biomes build the
// player's abilities (the town passes `abilities: []`), and SiphonSoul's
// constructor referenced the `Phaser` global — which the ESM build Vite
// bundles never defines — throwing `ReferenceError: Phaser is not defined`.
//
// Mocked at the entity seam: the Spell base (a Phaser Sprite that wires up
// buttons, animations and scene listeners) is replaced with a plain class
// that just applies the config, so only SiphonSoul's own constructor runs.
vi.mock("./Spell", () => ({
    default: class {
        constructor(config: Record<string, unknown>) {
            Object.assign(this, config);
        }
    },
}));

describe("SiphonSoul constructor", () => {
    it("builds without relying on a global Phaser namespace", () => {
        expect((globalThis as { Phaser?: unknown }).Phaser).toBeUndefined();

        // centre() is the player's body centre, below the sprite origin at 2x.
        const player = {
            x: 12,
            y: 34,
            centre: () => ({ x: 12, y: 50 }),
            stats: { magic_power: 60 },
        };
        const spell = new SiphonSoul({ player } as unknown as SpellOptions);

        expect(spell.deathZone).toBeInstanceOf(Geom.Circle);
        expect(spell.deathZone.x).toBe(12);
        expect(spell.deathZone.y).toBe(50);
        expect(spell.deathZone.radius).toBe(20);
        expect(spell.power).toBe(6);
    });
});
