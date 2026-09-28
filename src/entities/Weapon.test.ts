import { describe, it, expect, vi } from "vitest";
import Weapon from "./Weapon";
import { playSfx } from "@services/sfx";

// Every melee swing (player and enemy) goes through Weapon.swoosh(), so the
// swing sound lives there. Constructor-free fake on the real prototype.
vi.mock("@services/sfx", () => ({ playSfx: vi.fn(() => true) }));

describe("Weapon.swoosh", () => {
    it("plays the swing animation and the hurt sound", () => {
        const weapon = Object.create(Weapon.prototype) as Weapon;
        const play = vi.fn();
        Object.defineProperty(weapon, "anims", { value: { play } });

        weapon.swoosh();

        expect(play).toHaveBeenCalledWith("attack", true);
        expect(playSfx).toHaveBeenCalledTimes(1);
        expect(playSfx).toHaveBeenCalledWith("hurt");
    });
});
