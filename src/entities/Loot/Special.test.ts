import { describe, it, expect, vi } from "vitest";
import Special, { specialTextureKey } from "./Special";
import store from "@store";
import { playSfx } from "@services/sfx";

// Special item world drop (Blacksmith Step 4d). Constructor-free fake on the
// real prototype, per the lifecycle-test convention.
vi.mock("@services/sfx", () => ({ playSfx: vi.fn(() => true) }));

interface SpecialUnderTest {
    specialId: string;
    activateTimer?: { remove: ReturnType<typeof vi.fn> };
    collider?: object;
    scene: {
        physics: { world: { removeCollider: ReturnType<typeof vi.fn> } };
        tweens: { add: ReturnType<typeof vi.fn> };
    };
    cleanup(): void;
    collect(): void;
}

function makeSpecial(id = "void-pearl"): SpecialUnderTest {
    const special = Object.create(Special.prototype) as SpecialUnderTest;
    special.specialId = id;
    special.scene = {
        physics: { world: { removeCollider: vi.fn() } },
        tweens: { add: vi.fn() },
    };
    return special;
}

describe("Special", () => {
    it("keys its texture by the special's id", () => {
        expect(specialTextureKey("void-pearl")).toBe("special-void-pearl");
    });

    it("adds one of its special to the save on collect, with the pickup sound", () => {
        const before = store.getState().game.specials["ember-core"] ?? 0;

        makeSpecial("ember-core").collect();

        expect(store.getState().game.specials["ember-core"]).toBe(before + 1);
        expect(playSfx).toHaveBeenCalledWith("coin");
    });

    it("cleanup removes the activate timer and the collider", () => {
        const special = makeSpecial();
        special.activateTimer = { remove: vi.fn() };
        special.collider = { id: "collider" };

        special.cleanup();

        expect(special.activateTimer.remove).toHaveBeenCalledTimes(1);
        expect(special.scene.physics.world.removeCollider).toHaveBeenCalledWith(special.collider);
    });

    it("cleanup does not throw when the collider was never created", () => {
        const special = makeSpecial();
        special.activateTimer = { remove: vi.fn() };

        expect(() => special.cleanup()).not.toThrow();
        expect(special.scene.physics.world.removeCollider).not.toHaveBeenCalled();
    });
});
