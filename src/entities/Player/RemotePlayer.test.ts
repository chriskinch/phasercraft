// RemotePlayer interpolation/animation tests against the real prototype with
// a constructor-free fake (no Phaser boot), per the Phase 2 test convention.

import { describe, it, expect, vi } from "vitest";
import RemotePlayer from "./RemotePlayer";

interface RemoteUnderTest {
    x: number;
    y: number;
    character: string;
    target: { x: number; y: number };
    cleaned: boolean;
    sprite: { play: ReturnType<typeof vi.fn> };
    setPosition: (x: number, y: number) => void;
    setDepth: ReturnType<typeof vi.fn>;
    setTargetPosition(x: number, y: number): void;
    update(time: number, delta: number): void;
    cleanup(): void;
}

const makeRemote = (x = 0, y = 0): RemoteUnderTest => {
    const remote = Object.create(RemotePlayer.prototype) as RemoteUnderTest;
    remote.x = x;
    remote.y = y;
    remote.character = "Warrior";
    remote.target = { x, y };
    remote.cleaned = false;
    remote.sprite = { play: vi.fn() };
    remote.setPosition = (nx: number, ny: number) => {
        remote.x = nx;
        remote.y = ny;
    };
    remote.setDepth = vi.fn();
    return remote;
};

describe("RemotePlayer.update", () => {
    it("glides toward the target and plays the facing walk animation", () => {
        const remote = makeRemote(0, 0);
        remote.setTargetPosition(100, 0);

        remote.update(0, 50); // half the 100ms lerp window → half the distance
        expect(remote.x).toBeCloseTo(50);
        expect(remote.sprite.play).toHaveBeenCalledWith("coop-warrior-right-up", true);

        remote.setTargetPosition(-100, 0);
        remote.update(0, 50);
        expect(remote.sprite.play).toHaveBeenCalledWith("coop-warrior-left-down", true);
    });

    it("idles once it has effectively arrived", () => {
        const remote = makeRemote(10, 10);
        remote.setTargetPosition(10.5, 10);

        remote.update(0, 16);

        expect(remote.sprite.play).toHaveBeenCalledWith("coop-warrior-idle", true);
        expect(remote.x).toBe(10);
    });

    it("snaps across large jumps instead of gliding", () => {
        const remote = makeRemote(0, 0);
        remote.setTargetPosition(1000, 1000);

        remote.update(0, 16);

        expect(remote.x).toBe(1000);
        expect(remote.y).toBe(1000);
    });

    it("depth-sorts by y like the local player", () => {
        const remote = makeRemote(0, 0);
        remote.setTargetPosition(0, 200);
        remote.update(0, 100); // full window → arrives at target

        expect(remote.setDepth).toHaveBeenCalledWith(200);
    });
});

describe("RemotePlayer.cleanup", () => {
    it("is idempotent", () => {
        const remote = makeRemote();
        remote.cleanup();
        remote.cleanup();
        expect(remote.cleaned).toBe(true);
    });
});
