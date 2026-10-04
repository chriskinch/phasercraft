import { describe, it, expect, vi } from "vitest";
import Scroll from "./Scroll";
import store from "@store";
import { playSfx } from "@services/sfx";
import type { SpellLevel, SpellType } from "@/types/game";

// Spell scroll world drop (#385). Constructor-free fake on the real prototype,
// per the lifecycle-test convention.
vi.mock("@services/sfx", () => ({ playSfx: vi.fn(() => true) }));

interface ScrollUnderTest {
    spell: SpellType;
    level: SpellLevel;
    activateTimer?: { remove: ReturnType<typeof vi.fn> };
    collider?: object;
    scene: {
        physics: { world: { removeCollider: ReturnType<typeof vi.fn> } };
        tweens: { add: ReturnType<typeof vi.fn> };
    };
    destroy(): void;
    cleanup(): void;
    collect(): void;
}

function makeScroll(spell: SpellType = "Fireball", level: SpellLevel = 1): ScrollUnderTest {
    const scroll = Object.create(Scroll.prototype) as ScrollUnderTest;
    scroll.spell = spell;
    scroll.level = level;
    scroll.scene = {
        physics: { world: { removeCollider: vi.fn() } },
        tweens: { add: vi.fn() },
    };
    return scroll;
}

describe("Scroll", () => {
    it("adds one unread scroll of its spell and level on collect, with the pickup sound", () => {
        const before = store.getState().game.scrolls.Whirlwind?.[1] ?? 0;

        makeScroll("Whirlwind", 1).collect();

        expect(store.getState().game.scrolls.Whirlwind?.[1]).toBe(before + 1);
        expect(playSfx).toHaveBeenCalledWith("coin");
    });

    it("destroys itself once the collect tween ends", () => {
        const scroll = makeScroll();
        scroll.destroy = vi.fn();

        scroll.collect();
        const [tween] = scroll.scene.tweens.add.mock.calls[0];
        expect(tween.targets).toBe(scroll);
        expect(scroll.destroy).not.toHaveBeenCalled();
        tween.onComplete();

        expect(scroll.destroy).toHaveBeenCalledTimes(1);
    });

    it("cleanup removes the activate timer and the collider", () => {
        const scroll = makeScroll();
        scroll.activateTimer = { remove: vi.fn() };
        scroll.collider = { id: "collider" };

        scroll.cleanup();

        expect(scroll.activateTimer.remove).toHaveBeenCalledTimes(1);
        expect(scroll.scene.physics.world.removeCollider).toHaveBeenCalledWith(scroll.collider);
    });

    it("cleanup does not throw when the collider was never created", () => {
        const scroll = makeScroll();
        scroll.activateTimer = { remove: vi.fn() };

        expect(() => scroll.cleanup()).not.toThrow();
        expect(scroll.scene.physics.world.removeCollider).not.toHaveBeenCalled();
    });
});
