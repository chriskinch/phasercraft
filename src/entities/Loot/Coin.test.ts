import { describe, it, expect, vi } from "vitest";
import Coin from "./Coin";

// Coin lifecycle: the activate timer and the player collider outlive a plain
// destroy, so cleanup() (wired to DESTROY) releases both. Constructor-free fake
// on the real prototype, per the lifecycle-test convention.

interface CoinUnderTest {
    activateTimer?: { remove: ReturnType<typeof vi.fn> };
    collider?: object;
    scene: { physics: { world: { removeCollider: ReturnType<typeof vi.fn> } } };
    cleanup(): void;
}

function makeCoin(): CoinUnderTest {
    const coin = Object.create(Coin.prototype) as CoinUnderTest;
    coin.scene = { physics: { world: { removeCollider: vi.fn() } } };
    return coin;
}

describe("Coin.cleanup", () => {
    it("removes the activate timer and the collider", () => {
        const coin = makeCoin();
        const timer = { remove: vi.fn() };
        const collider = { id: "collider" };
        coin.activateTimer = timer;
        coin.collider = collider;

        coin.cleanup();

        expect(timer.remove).toHaveBeenCalledTimes(1);
        expect(coin.scene.physics.world.removeCollider).toHaveBeenCalledWith(collider);
    });

    it("is idempotent: a repeat call releases nothing twice", () => {
        const coin = makeCoin();
        const timer = { remove: vi.fn() };
        coin.activateTimer = timer;
        coin.collider = { id: "collider" };

        coin.cleanup();
        coin.cleanup();

        expect(timer.remove).toHaveBeenCalledTimes(1);
        expect(coin.scene.physics.world.removeCollider).toHaveBeenCalledTimes(1);
    });

    it("does not throw when the collider was never created", () => {
        const coin = makeCoin();
        coin.activateTimer = { remove: vi.fn() };

        expect(() => coin.cleanup()).not.toThrow();
        expect(coin.scene.physics.world.removeCollider).not.toHaveBeenCalled();
    });
});
