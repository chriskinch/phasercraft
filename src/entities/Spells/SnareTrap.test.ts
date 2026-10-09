import { describe, it, expect, vi } from "vitest";
import SnareTrap from "./SnareTrap";
import type Enemy from "@entities/Enemy/Enemy";

// triggerTrap roots the enemy, then a scene-clock timer frees it. An enemy
// despawned while snared (#456) is destroyed, and destroy() clears its body
// before that timer fires. Constructor-free fake on the real prototype.

interface FakeEnemy {
    body?: {
        setMaxVelocity: ReturnType<typeof vi.fn>;
        checkCollision: { none: boolean };
    };
    monster: { anims: { pause: ReturnType<typeof vi.fn>; resume: ReturnType<typeof vi.fn> } };
    health: { adjustValue: ReturnType<typeof vi.fn> };
}

function setup() {
    let release: (() => void) | undefined;
    const trap = Object.create(SnareTrap.prototype) as SnareTrap;
    trap.type = "bleed";
    trap.duration = 6;
    trap.trapDamage = 20;
    (trap as unknown as { scene: object }).scene = {
        time: {
            delayedCall: vi.fn((_delay: number, cb: () => void) => {
                release = cb;
            }),
        },
    };
    const enemy: FakeEnemy = {
        body: { setMaxVelocity: vi.fn(), checkCollision: { none: false } },
        monster: { anims: { pause: vi.fn(), resume: vi.fn() } },
        health: { adjustValue: vi.fn() },
    };
    trap.triggerTrap(enemy as unknown as Enemy);
    return { enemy, release: () => release!() };
}

describe("SnareTrap.triggerTrap", () => {
    it("roots the enemy, then frees it when the snare wears off", () => {
        const { enemy, release } = setup();
        const body = enemy.body!;

        expect(body.setMaxVelocity).toHaveBeenLastCalledWith(0);
        expect(enemy.monster.anims.pause).toHaveBeenCalled();
        expect(body.checkCollision.none).toBe(true);
        expect(enemy.health.adjustValue).toHaveBeenCalledWith(-20, "bleed", false);

        release();

        expect(body.setMaxVelocity).toHaveBeenLastCalledWith(10000);
        expect(enemy.monster.anims.resume).toHaveBeenCalled();
        expect(body.checkCollision.none).toBe(false);
    });

    it("does not throw when the enemy was despawned before the snare wears off", () => {
        const { enemy, release } = setup();

        enemy.body = undefined;

        expect(() => release()).not.toThrow();
        expect(enemy.monster.anims.resume).not.toHaveBeenCalled();
    });
});
