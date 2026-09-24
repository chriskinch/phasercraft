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
    "enemy:despawned",
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
    targetDespawned(enemy: unknown): void;
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
        expect(byEvent["enemy:despawned"]).toBe(player.targetDespawned);
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

describe("Player.targetDespawned", () => {
    it("idles once a despawning enemy clears the current selection", () => {
        const player = Object.create(Player.prototype) as {
            scene: { selected: null };
            idle: ReturnType<typeof vi.fn>;
            targetDespawned(enemy: unknown): void;
        };
        player.scene = { selected: null };
        player.idle = vi.fn();

        player.targetDespawned({ id: "despawned-target" });

        expect(player.idle).toHaveBeenCalledTimes(1);
    });

    it("ignores despawns from some other enemy while a target is still selected", () => {
        const selected = { id: "current-target" };
        const player = Object.create(Player.prototype) as {
            scene: { selected: { id: string } };
            idle: ReturnType<typeof vi.fn>;
            targetDespawned(enemy: { id: string }): void;
        };
        player.scene = { selected };
        player.idle = vi.fn();

        player.targetDespawned({ id: "other-enemy" });

        expect(player.idle).not.toHaveBeenCalled();
    });
});

// Regression coverage for the double camera conversion in goToRange().
//
// An Enemy's x/y are world coordinates. goToRange() used to hand the enemy to
// moveToPosition(), which runs cameras.main.getWorldPoint() on it — a screen ->
// world conversion. Applying that to an already-world position adds the camera
// scroll on top of it, so the player walked to target + scroll instead of to
// target. It stayed invisible while the biome camera was static (at scroll 0
// the conversion is the identity) and only surfaced once the camera began
// following the player across a 300x300 map.
interface RangedPlayerUnderTest {
    x: number;
    y: number;
    scene: unknown;
    stats: { range: number; speed: number };
    attack_ready: boolean;
    attack_delay: unknown;
    destination: { x: number | null; y: number | null };
    body: { setVelocity: ReturnType<typeof vi.fn> };
    hero: { idle: ReturnType<typeof vi.fn>; walk: ReturnType<typeof vi.fn> };
    moveToWorldPoint(point: { x: number; y: number }): void;
    goToRange(): void;
    idle(): void;
    attack(target: unknown): void;
}

function makeRangedPlayer(enemy: { x: number; y: number }, scrollX: number, scrollY: number) {
    const player = Object.create(Player.prototype) as RangedPlayerUnderTest;
    const moveTo = vi.fn();

    player.x = 0;
    player.y = 0;
    player.stats = { range: 10, speed: 100 };
    player.attack_ready = false;
    player.attack_delay = null;
    player.destination = { x: null, y: null };
    player.body = { setVelocity: vi.fn() };
    player.hero = { idle: vi.fn(), walk: vi.fn() };
    player.attack = vi.fn();
    player.scene = {
        selected: enemy,
        global_attack_delay: 250,
        // A scrolled camera: getWorldPoint would shift anything passed through it.
        cameras: {
            main: { getWorldPoint: (x: number, y: number) => ({ x: x + scrollX, y: y + scrollY }) },
        },
        physics: { moveTo },
        time: { delayedCall: vi.fn() },
    };
    return { player, moveTo };
}

describe("Player.goToRange", () => {
    it("walks to the enemy's own world position, not one shifted by camera scroll", () => {
        const enemy = { x: 5000, y: 4000 };
        const { player, moveTo } = makeRangedPlayer(enemy, 1234, 567);

        player.goToRange();

        expect(moveTo).toHaveBeenCalledWith(player, enemy.x, enemy.y, player.stats.speed);
        expect(player.destination).toEqual({ x: enemy.x, y: enemy.y });
    });

    it("is unaffected by how far the camera has scrolled", () => {
        const enemy = { x: 5000, y: 4000 };
        const near = makeRangedPlayer(enemy, 0, 0);
        const far = makeRangedPlayer(enemy, 9000, 9000);

        near.player.goToRange();
        far.player.goToRange();

        // Compare the coordinates only — the first argument is each fixture's
        // own player instance.
        const coords = (m: typeof near.moveTo) => m.mock.calls[0].slice(1);
        expect(coords(far.moveTo)).toEqual(coords(near.moveTo));
        expect(coords(far.moveTo)).toEqual([enemy.x, enemy.y, 100]);
    });
});
