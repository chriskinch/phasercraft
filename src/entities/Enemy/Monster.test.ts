import { describe, it, expect, vi } from "vitest";
import type { Scene } from "phaser";
import Monster from "./Monster";

// Sprite stubbed at the entity seam so the real Monster constructor can run
// against a fake scene without booting the renderer/texture manager.
vi.mock("phaser", async (importOriginal) => {
    const actual = await importOriginal<typeof import("phaser")>();
    class Sprite {
        scene: unknown;
        constructor(scene: unknown) {
            this.scene = scene;
        }
    }
    return { ...actual, GameObjects: { ...actual.GameObjects, Sprite } };
});

describe("Monster construction", () => {
    it("adds itself to the scene without a physics body (#529)", () => {
        const scene = {
            add: { existing: vi.fn() },
            physics: { world: { enable: vi.fn() } },
        };

        const monster = new Monster({
            scene: scene as unknown as Scene,
            key: "imp",
            x: 0,
            y: 0,
            target: null,
        });

        // The enemy's body lives on its Enemy container; the sprite has none.
        expect(scene.physics.world.enable).not.toHaveBeenCalled();
        expect(scene.add.existing).toHaveBeenCalledWith(monster);
        expect(monster.key).toBe("imp");
    });
});

// Constructor-free fake on the real prototype.
function makeMonster() {
    const monster = Object.create(Monster.prototype) as Monster;
    const firstFrame = { index: 0 };
    const anims = {
        play: vi.fn(),
        pause: vi.fn(),
        resume: vi.fn(),
        currentAnim: { frames: [firstFrame, { index: 1 }] },
    };
    Object.assign(monster, { key: "imp", frozen: false, anims });
    return { monster, anims, firstFrame };
}

describe("Monster stun pose", () => {
    it("freezes on the first idle frame, once", () => {
        const { monster, anims, firstFrame } = makeMonster();

        monster.freeze();
        monster.freeze();

        expect(anims.play).toHaveBeenCalledTimes(1);
        expect(anims.play).toHaveBeenCalledWith("imp-idle");
        expect(anims.pause).toHaveBeenCalledWith(firstFrame);
    });

    it("unfreeze resumes only when frozen", () => {
        const { monster, anims } = makeMonster();

        monster.unfreeze();
        expect(anims.resume).not.toHaveBeenCalled();

        monster.freeze();
        monster.unfreeze();
        expect(anims.resume).toHaveBeenCalledTimes(1);
        expect(monster.frozen).toBe(false);
    });
});
