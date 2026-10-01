import { describe, it, expect, vi } from "vitest";
import Monster from "./Monster";

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
