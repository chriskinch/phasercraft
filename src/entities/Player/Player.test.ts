import { describe, it, expect, vi } from "vitest";
import Player from "./Player";
import { HERO_SCALE } from "./Hero";
import Projectile from "@entities/Weapons/Projectile";
import { playSfx } from "@services/sfx";

vi.mock("@entities/Weapons/Projectile", () => ({ default: vi.fn() }));
vi.mock("@services/sfx", () => ({ playSfx: vi.fn(() => true) }));

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
    boons: { cleanup: ReturnType<typeof vi.fn> };
    death(): void;
    hit(power: number): void;
    gameDownHandler(): void;
    gameMoveHandler(): void;
    gameUpHandler(): void;
    targetDead(): void;
    targetDespawned(): void;
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
    player.boons = { cleanup: vi.fn() };
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
        expect(player.boons.cleanup).toHaveBeenCalled();
    });

    it("is idempotent — a second cleanup does not throw", () => {
        const player = makePlayer();

        player.cleanup();
        expect(() => player.cleanup()).not.toThrow();
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

// A despawn is not a kill: no XP, and only the chased enemy's despawn stops the
// player. Despawns happen far away while the player runs with nothing selected,
// so idling on every one (as targetDead does) would halt the run.
describe("Player.targetDespawned", () => {
    function makeDespawnPlayer(selected: unknown) {
        const player = Object.create(Player.prototype) as {
            scene: { selected: unknown };
            idle: ReturnType<typeof vi.fn>;
            targetDespawned(enemy: unknown): void;
        };
        player.scene = { selected };
        player.idle = vi.fn();
        return player;
    }

    it("stops chasing when the despawned enemy was the target", () => {
        const enemy = {};
        const player = makeDespawnPlayer(enemy);

        player.targetDespawned(enemy);

        expect(player.idle).toHaveBeenCalledTimes(1);
    });

    it("keeps running when an unrelated enemy despawns", () => {
        const player = makeDespawnPlayer(null);

        player.targetDespawned({});

        expect(player.idle).not.toHaveBeenCalled();
    });

    it("keeps chasing its own target when a different enemy despawns", () => {
        const player = makeDespawnPlayer({});

        player.targetDespawned({});

        expect(player.idle).not.toHaveBeenCalled();
    });
});

// Every auto-attack hit plays the hurt sound: at once for melee, and when the
// projectile lands for ranged classes (the Ranger's arrow).
describe("Player.attack sound", () => {
    function makeAttacker(ranged: boolean) {
        const player = Object.create(Player.prototype) as {
            x: number;
            y: number;
            stats: { attack_power: number; attack_speed: number; critical_chance: number };
            attack_projectile?: { key: string; frame: number; speed: number };
            weapon: { swoosh: ReturnType<typeof vi.fn> };
            positionWeapon: ReturnType<typeof vi.fn>;
            scene: {
                time: { addEvent: ReturnType<typeof vi.fn> };
                events: { emit: ReturnType<typeof vi.fn> };
            };
            attack(target: object): void;
        };
        player.x = 0;
        player.y = 0;
        player.stats = { attack_power: 10, attack_speed: 1, critical_chance: 0 };
        if (ranged) player.attack_projectile = { key: "multishot-effect", frame: 0, speed: 500 };
        player.weapon = { swoosh: vi.fn() };
        player.positionWeapon = vi.fn();
        player.scene = { time: { addEvent: vi.fn() }, events: { emit: vi.fn() } };
        return player;
    }

    it("ranged plays the hurt sound on impact, not on firing", () => {
        vi.mocked(playSfx).mockClear();
        const player = makeAttacker(true);
        const enemy = { hit: vi.fn() };

        player.attack(enemy);
        expect(playSfx).not.toHaveBeenCalled();

        vi.mocked(Projectile).mock.calls[0][0].onImpact(enemy as never);

        expect(playSfx).toHaveBeenCalledTimes(1);
        expect(playSfx).toHaveBeenCalledWith("hurt");
        expect(enemy.hit).toHaveBeenCalledWith({ power: 10, crit: false });
    });

    it("melee plays the hurt sound with the hit", () => {
        vi.mocked(playSfx).mockClear();
        const player = makeAttacker(false);
        const enemy = { hit: vi.fn() };

        player.attack(enemy);

        expect(enemy.hit).toHaveBeenCalledTimes(1);
        expect(playSfx).toHaveBeenCalledTimes(1);
        expect(playSfx).toHaveBeenCalledWith("hurt");
    });
});

// The first enemy to hit the player from within the player's auto-attack range
// becomes the target; an existing live target is never switched.
describe("Player.retaliate", () => {
    function makeEnemyStub({ alive = true, x = 30 } = {}) {
        return { alive, x, y: 0, select: vi.fn(), deselect: vi.fn() };
    }

    function makeRetaliator({ selected = null as unknown, range = 20 } = {}) {
        const player = Object.create(Player.prototype) as {
            scene: { selected: unknown };
            stats: { range: number };
            x: number;
            y: number;
            alive: boolean;
            dragging: boolean;
            body: { speed: number };
            retaliate(attacker?: unknown): void;
        };
        player.scene = { selected };
        player.body = { speed: 0 };
        player.stats = { range };
        player.x = 0;
        player.y = 0;
        player.alive = true;
        player.dragging = false;
        return player;
    }

    it("targets an attacker within auto-attack range when nothing is selected", () => {
        const attacker = makeEnemyStub({ x: 35 });
        makeRetaliator({ range: 20 }).retaliate(attacker);
        expect(attacker.select).toHaveBeenCalledTimes(1);
    });

    it("ignores an attacker beyond auto-attack range", () => {
        const attacker = makeEnemyStub({ x: 36 });
        makeRetaliator({ range: 20 }).retaliate(attacker);
        expect(attacker.select).not.toHaveBeenCalled();
    });

    it("a longer-ranged player (Ranger) retaliates further out", () => {
        const attacker = makeEnemyStub({ x: 200 });
        makeRetaliator({ range: 200 }).retaliate(attacker);
        expect(attacker.select).toHaveBeenCalledTimes(1);
    });

    it("does not switch from a live target", () => {
        const attacker = makeEnemyStub();
        makeRetaliator({ selected: makeEnemyStub() }).retaliate(attacker);
        expect(attacker.select).not.toHaveBeenCalled();
    });

    it("replaces a dead target", () => {
        const dead = makeEnemyStub({ alive: false });
        const attacker = makeEnemyStub();
        makeRetaliator({ selected: dead }).retaliate(attacker);
        expect(dead.deselect).toHaveBeenCalledTimes(1);
        expect(attacker.select).toHaveBeenCalledTimes(1);
    });

    it("skips while walking to a clicked point", () => {
        const attacker = makeEnemyStub();
        const walking = makeRetaliator();
        walking.body.speed = 100;
        walking.retaliate(attacker);
        expect(attacker.select).not.toHaveBeenCalled();
    });

    it("skips while dragging a move, when dead, or without a live attacker", () => {
        const attacker = makeEnemyStub();
        const dragging = makeRetaliator();
        dragging.dragging = true;
        dragging.retaliate(attacker);
        const dead = makeRetaliator();
        dead.alive = false;
        dead.retaliate(attacker);
        makeRetaliator().retaliate(undefined);
        const deadAttacker = makeEnemyStub({ alive: false });
        makeRetaliator().retaliate(deadAttacker);
        expect(attacker.select).not.toHaveBeenCalled();
        expect(deadAttacker.select).not.toHaveBeenCalled();
    });
});

// HERO_SCALE is display only: Hero draws at 2x, but the collision box has to
// stay the size it was before the sprite was scaled up, or the player's hitbox
// quadruples. setCollisionBox() reads the frame (hero.width/height) rather than
// getBounds(), which carries the scale — this pins that distinction.
describe("setCollisionBox", () => {
    interface Sized {
        hero: unknown;
        body: {
            debugBodyColor: number;
            setSize: ReturnType<typeof vi.fn>;
            setOffset: ReturnType<typeof vi.fn>;
        };
        setCollisionBox(height?: number): void;
    }

    it("sizes the body from the unscaled frame, not the scaled sprite", () => {
        const player = Object.create(Player.prototype) as Sized;
        // Mirrors a Phaser sprite at HERO_SCALE: width/height are the frame,
        // displayHeight and getBounds() carry the scale.
        player.hero = {
            width: 24,
            height: 32,
            displayHeight: 32 * HERO_SCALE,
            getBounds: () => ({ width: 24 * HERO_SCALE, height: 32 * HERO_SCALE }),
        };
        player.body = { debugBodyColor: 0, setSize: vi.fn(), setOffset: vi.fn() };

        player.setCollisionBox();

        expect(player.body.setSize).toHaveBeenCalledWith(24, 8);
        // Offset is from the container's top (y = -16). The scaled art's feet
        // are at +32, so the box's bottom edge (offset + 8) must land at 48.
        expect(player.body.setOffset).toHaveBeenCalledWith(0, 40);
    });
});
