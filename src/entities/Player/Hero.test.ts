import { describe, it, expect } from "vitest";
import Hero, { HERO_SCALE } from "./Hero";

// Hero draws at HERO_SCALE, but its own Arcade body — the one enemies collide
// with (Enemy.enemySpawned) — must stay the 24×32 it was before the sprite was
// scaled up, with its bottom on the scaled sprite's feet. The fake body applies
// Arcade's own maths: size × scale, position = origin + scale × (offset − displayOrigin).
describe("Hero.sizeBody", () => {
    function sized() {
        const hero = Object.create(Hero.prototype) as Hero;
        Object.defineProperty(hero, "width", { value: 24 });
        Object.defineProperty(hero, "height", { value: 32 });
        const body = {
            sourceWidth: 0,
            sourceHeight: 0,
            offset: { x: 0, y: 0 },
            setSize(w: number, h: number) {
                this.sourceWidth = w;
                this.sourceHeight = h;
            },
            setOffset(x: number, y: number) {
                this.offset = { x, y };
            },
        };
        Object.defineProperty(hero, "body", { value: body });
        Object.defineProperty(hero, "displayHeight", { value: 32 * HERO_SCALE });
        hero.sizeBody();

        // Sprite origin at (0, 0), display origin at the frame centre.
        const left = HERO_SCALE * (body.offset.x - 24 / 2);
        const top = HERO_SCALE * (body.offset.y - 32 / 2);
        return {
            left,
            top,
            width: body.sourceWidth * HERO_SCALE,
            height: body.sourceHeight * HERO_SCALE,
            colliderTop: hero.colliderTop(),
        };
    }

    it("keeps the enemy collider at the unscaled 24x32 frame", () => {
        const { width, height } = sized();
        expect({ width, height }).toEqual({ width: 24, height: 32 });
    });

    it("centres it horizontally and puts its bottom on the scaled feet", () => {
        const { left, top, width, height } = sized();
        expect(left + width / 2).toBe(0);
        // Feet are half the display height below the origin.
        expect(top + height).toBe((32 * HERO_SCALE) / 2);
    });

    // Player hangs the bars off colliderTop(), so it must match the body.
    it("reports the collider's top edge", () => {
        const { top, colliderTop } = sized();
        expect(colliderTop).toBe(top);
    });
});
