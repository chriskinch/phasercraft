// RemoteLoot take-once/cleanup tests against the real prototype with a
// constructor-free fake (no Phaser boot), per the Phase 2 test convention.

import { describe, it, expect, vi } from "vitest";
import RemoteLoot from "./RemoteLoot";

interface RemoteLootUnderTest {
    id: string;
    kind: string;
    taken: boolean;
    onTake: ReturnType<typeof vi.fn>;
    activateTimer?: { remove: ReturnType<typeof vi.fn> };
    collider?: object;
    scene: { physics: { world: { removeCollider: ReturnType<typeof vi.fn> } } };
    take(): void;
    cleanup(): void;
}

const makeRemoteLoot = (): RemoteLootUnderTest => {
    const loot = Object.create(RemoteLoot.prototype) as RemoteLootUnderTest;
    loot.id = "l1";
    loot.kind = "coin";
    loot.taken = false;
    loot.onTake = vi.fn();
    loot.activateTimer = { remove: vi.fn() };
    loot.collider = {};
    loot.scene = { physics: { world: { removeCollider: vi.fn() } } };
    return loot;
};

describe("RemoteLoot.take", () => {
    it("sends the collect intent exactly once", () => {
        const loot = makeRemoteLoot();
        loot.take();
        loot.take();
        loot.take();
        expect(loot.onTake).toHaveBeenCalledTimes(1);
        expect(loot.onTake).toHaveBeenCalledWith("l1");
    });
});

describe("RemoteLoot.cleanup", () => {
    it("releases the arming timer and the player collider", () => {
        const loot = makeRemoteLoot();
        loot.cleanup();
        expect(loot.activateTimer?.remove).toHaveBeenCalledTimes(1);
        expect(loot.scene.physics.world.removeCollider).toHaveBeenCalledTimes(1);
    });

    it("tolerates a drop that never armed", () => {
        const loot = makeRemoteLoot();
        loot.activateTimer = undefined;
        loot.collider = undefined;
        expect(() => loot.cleanup()).not.toThrow();
    });
});
