import { describe, it, expect, vi } from "vitest";
import Hero, { HERO_SCALE } from "./Hero";

// Hero draws at HERO_SCALE, but its own Arcade body — the one enemies collide
// with (Enemy.enemySpawned) — must stay the 24×32 it was before the sprite was
// scaled up. Arcade multiplies a body's source size by the sprite's scale, so
// the fake body below does the same.
describe("Hero.sizeBody", () => {
    it("keeps the enemy collider at the unscaled 24x32 frame", () => {
        const hero = Object.create(Hero.prototype) as Hero;
        Object.defineProperty(hero, "width", { value: 24 });
        Object.defineProperty(hero, "height", { value: 32 });
        const body = {
            width: 0,
            height: 0,
            setSize: vi.fn(function (
                this: { width: number; height: number },
                w: number,
                h: number
            ) {
                this.width = w * HERO_SCALE;
                this.height = h * HERO_SCALE;
            }),
        };
        Object.defineProperty(hero, "body", { value: body });

        hero.sizeBody();

        expect({ width: body.width, height: body.height }).toEqual({ width: 24, height: 32 });
        // Centred on the sprite, as Arcade's default body was.
        expect(body.setSize).toHaveBeenCalledWith(expect.any(Number), expect.any(Number), true);
    });
});
