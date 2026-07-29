import { describe, it, expect, vi } from "vitest";
import Player from "./Player";

// Regression coverage for the scene-restart listener leak.
//
// Phaser calls `events.removeAllListeners()` in Systems.destroy() but NOT in
// Systems.shutdown() (see Systems.js), so everything Player registers on the
// scene's emitter survives a scene restart. Scene instances are reused, so a
// second create() stacked a second player's handlers on top of the first's —
// and the dead one ran first, threw on its cleared `this.scene`, and aborted
// emit() before the live player's handler. The visible symptom was that the
// player could not move after a town -> biome -> town round trip.
//
// cleanup() must therefore release every scene-emitter listener it registered,
// and must do so through the captured emitter rather than `this.scene`, which
// Phaser has already cleared by the time cleanup() runs.
//
// Mocked at the entity seam per the Phase 2 convention: a constructor-free fake
// built on the real prototype, rather than booting Phaser.

const SCENE_EVENTS = [
    "player:dead",
    "enemy:attack",
    "pointerdown:game",
    "pointermove:game",
    "pointerup:game",
    "enemy:dead",
] as const;

interface PlayerUnderTest {
    subscriptions: Array<ReturnType<typeof vi.fn>>;
    scene_events: { off: ReturnType<typeof vi.fn> };
    scene?: unknown;
    casting: { cleanup: ReturnType<typeof vi.fn> };
    castBar: { cleanup: ReturnType<typeof vi.fn> };
    health: { cleanup: ReturnType<typeof vi.fn> };
    resource: { cleanup: ReturnType<typeof vi.fn> };
    shield: { cleanup: ReturnType<typeof vi.fn> };
    death(): void;
    hit(power: number): void;
    gameDownHandler(): void;
    gameMoveHandler(): void;
    gameUpHandler(): void;
    targetDead(): void;
    cleanup(): void;
}

function makePlayer(): PlayerUnderTest {
    const player = Object.create(Player.prototype) as PlayerUnderTest;
    player.subscriptions = [];
    player.scene_events = { off: vi.fn() };
    // Phaser clears `this.scene` on destroy, and the display list destroys game
    // objects ahead of any create()-registered SHUTDOWN handler — so this is the
    // state cleanup() actually runs in.
    player.scene = undefined;
    player.casting = { cleanup: vi.fn() };
    player.castBar = { cleanup: vi.fn() };
    player.health = { cleanup: vi.fn() };
    player.resource = { cleanup: vi.fn() };
    player.shield = { cleanup: vi.fn() };
    return player;
}

describe("Player.cleanup", () => {
    it("releases every listener it registered on the scene emitter", () => {
        const player = makePlayer();

        player.cleanup();

        SCENE_EVENTS.forEach((event) => {
            expect(player.scene_events.off).toHaveBeenCalledWith(
                event,
                expect.any(Function),
                player
            );
        });
        expect(player.scene_events.off).toHaveBeenCalledTimes(SCENE_EVENTS.length);
    });

    it("removes each listener with the same handler it registered", () => {
        // off() only matches on the (event, fn, context) triple — a different
        // function reference silently leaves the listener attached.
        const player = makePlayer();

        player.cleanup();

        const byEvent = Object.fromEntries(
            player.scene_events.off.mock.calls.map(([event, fn]) => [event, fn])
        );
        expect(byEvent["player:dead"]).toBe(player.death);
        expect(byEvent["enemy:attack"]).toBe(player.hit);
        expect(byEvent["pointerdown:game"]).toBe(player.gameDownHandler);
        expect(byEvent["pointermove:game"]).toBe(player.gameMoveHandler);
        expect(byEvent["pointerup:game"]).toBe(player.gameUpHandler);
        expect(byEvent["enemy:dead"]).toBe(player.targetDead);
    });

    it("does not reach for this.scene, which Phaser has already cleared", () => {
        const player = makePlayer();
        player.scene = undefined;

        expect(() => player.cleanup()).not.toThrow();
        expect(player.scene_events.off).toHaveBeenCalled();
    });

    it("still releases store subscriptions and child resources", () => {
        const player = makePlayer();
        const unsubscribe = vi.fn();
        player.subscriptions = [unsubscribe];

        player.cleanup();

        expect(unsubscribe).toHaveBeenCalled();
        expect(player.subscriptions).toEqual([]);
        expect(player.casting.cleanup).toHaveBeenCalled();
        expect(player.castBar.cleanup).toHaveBeenCalled();
        expect(player.health.cleanup).toHaveBeenCalled();
        expect(player.resource.cleanup).toHaveBeenCalled();
        expect(player.shield.cleanup).toHaveBeenCalled();
    });

    it("is idempotent — a second cleanup does not throw", () => {
        const player = makePlayer();

        player.cleanup();
        expect(() => player.cleanup()).not.toThrow();
    });
});
