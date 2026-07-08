// Player down()/revive() (the reversible co-op spectate path) tested against
// the real prototype with a constructor-free fake, per the Phase 2 convention.

import { describe, it, expect, vi } from "vitest";
import Player from "./Player";

class FakeEmitter {
    on = vi.fn();
    off = vi.fn();
}

interface PlayerUnderTest {
    alive: boolean;
    dragging: boolean;
    destination: { x: number | null; y: number | null };
    stats: { health_max: number };
    scene: { events: FakeEmitter };
    casting: { cancelAll: ReturnType<typeof vi.fn> };
    body: { setVelocity: ReturnType<typeof vi.fn> };
    hero: { death: ReturnType<typeof vi.fn>; idle: ReturnType<typeof vi.fn> };
    health: { adjustValue: ReturnType<typeof vi.fn> };
    down(): void;
    revive(): void;
}

const makePlayer = (): PlayerUnderTest => {
    const player = Object.create(Player.prototype) as PlayerUnderTest;
    player.alive = true;
    player.dragging = true;
    player.destination = { x: 50, y: 60 };
    player.stats = { health_max: 500 };
    player.scene = { events: new FakeEmitter() };
    player.casting = { cancelAll: vi.fn() };
    player.body = { setVelocity: vi.fn() };
    player.hero = { death: vi.fn(), idle: vi.fn() };
    player.health = { adjustValue: vi.fn() };
    return player;
};

describe("Player.down / Player.revive", () => {
    it("down() stops the player reversibly — no resource destruction", () => {
        const player = makePlayer();
        player.down();

        expect(player.alive).toBe(false);
        expect(player.dragging).toBe(false);
        expect(player.destination).toEqual({ x: null, y: null });
        expect(player.casting.cancelAll).toHaveBeenCalled();
        expect(player.body.setVelocity).toHaveBeenCalledWith(0);
        expect(player.hero.death).toHaveBeenCalled();
        // The reversible path must not touch health.remove()/resource.remove().
        expect(player.health.adjustValue).not.toHaveBeenCalled();
        // Input + damage handlers released (4 scene listeners).
        expect(player.scene.events.off).toHaveBeenCalledTimes(4);
    });

    it("revive() restores health, controls, and the idle pose", () => {
        const player = makePlayer();
        player.down();
        player.revive();

        expect(player.alive).toBe(true);
        expect(player.health.adjustValue).toHaveBeenCalledWith(500);
        expect(player.hero.idle).toHaveBeenCalled();
        expect(player.scene.events.on).toHaveBeenCalledTimes(4);
    });

    it("both are idempotent", () => {
        const player = makePlayer();
        player.down();
        player.down();
        expect(player.hero.death).toHaveBeenCalledTimes(1);

        player.revive();
        player.revive();
        expect(player.hero.idle).toHaveBeenCalledTimes(1);
    });
});
