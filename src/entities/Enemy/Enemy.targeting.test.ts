// Co-op targeting tests for Enemy against the real prototype with a
// constructor-free fake (no Phaser boot). These pin the two guarantees the
// host-authoritative slice makes: (1) with no co-op session the candidate
// set is exactly the historical single player, and (2) in co-op the enemy
// picks the nearest avatar and routes its attack to the right client.

import { describe, it, expect, vi } from "vitest";
import Enemy from "./Enemy";

interface TargetPoint {
    x: number;
    y: number;
}

// The private co-op helpers under test, surfaced structurally (TS `private`
// is compile-time only; the prototype methods are reachable at runtime).
interface EnemyUnderTest {
    x: number;
    y: number;
    victim: TargetPoint | null;
    target: unknown;
    states: { attack: string };
    stats: { damage: number; attack_speed: number };
    attack_ready: boolean;
    swing: unknown;
    scene: {
        player: { x: number; y: number; alive: boolean };
        coopTarget?: () => TargetPoint | null;
        events: { emit: ReturnType<typeof vi.fn> };
        time: { addEvent: ReturnType<typeof vi.fn> };
    };
    nearestPlayerTarget(): TargetPoint | null;
    isPlayerTarget(target: unknown): boolean;
    attack(): void;
}

const makeEnemy = (x = 0, y = 0): EnemyUnderTest => {
    const enemy = Object.create(Enemy.prototype) as EnemyUnderTest;
    enemy.x = x;
    enemy.y = y;
    enemy.victim = null;
    enemy.target = null;
    enemy.states = { attack: "primed" };
    enemy.stats = { damage: 7, attack_speed: 1 };
    enemy.attack_ready = true;
    enemy.swing = null;
    enemy.scene = {
        player: { x: 10, y: 0, alive: true },
        events: { emit: vi.fn() },
        time: { addEvent: vi.fn(() => ({ remove: vi.fn() })) },
    };
    return enemy;
};

describe("Enemy.nearestPlayerTarget", () => {
    it("offline: always the local player — even dead (historical behavior)", () => {
        const enemy = makeEnemy();
        expect(enemy.nearestPlayerTarget()).toBe(enemy.scene.player);

        enemy.scene.player.alive = false;
        expect(enemy.nearestPlayerTarget()).toBe(enemy.scene.player);
    });

    it("co-op: picks the nearest of the two avatars", () => {
        const enemy = makeEnemy(0, 0);
        const partner = { x: 5, y: 0 };
        enemy.scene.coopTarget = () => partner;

        expect(enemy.nearestPlayerTarget()).toBe(partner); // 5 < 10

        partner.x = 50;
        expect(enemy.nearestPlayerTarget()).toBe(enemy.scene.player);
    });

    it("co-op: skips a dead local player and falls through to the partner", () => {
        const enemy = makeEnemy(0, 0);
        const partner = { x: 500, y: 0 };
        enemy.scene.coopTarget = () => partner;
        enemy.scene.player.alive = false;

        expect(enemy.nearestPlayerTarget()).toBe(partner);
    });
});

describe("Enemy.isPlayerTarget", () => {
    it("matches the local player and the co-op partner, nothing else", () => {
        const enemy = makeEnemy();
        const partner = { x: 1, y: 1 };
        enemy.scene.coopTarget = () => partner;

        expect(enemy.isPlayerTarget(enemy.scene.player as never)).toBe(true);
        expect(enemy.isPlayerTarget(partner as never)).toBe(true);
        expect(enemy.isPlayerTarget({ x: 9, y: 9 } as never)).toBe(false);
    });
});

describe("Enemy.attack routing", () => {
    it("hits the local player through the historical enemy:attack event", () => {
        const enemy = makeEnemy();
        enemy.victim = enemy.scene.player;
        enemy.attack();
        expect(enemy.scene.events.emit).toHaveBeenCalledWith("enemy:attack", 7);
    });

    it("relays hits on the partner's avatar through enemy:attack:peer", () => {
        const enemy = makeEnemy();
        const partner = { x: 1, y: 1 };
        enemy.scene.coopTarget = () => partner;
        enemy.victim = partner;
        enemy.attack();
        expect(enemy.scene.events.emit).toHaveBeenCalledWith("enemy:attack:peer", 7);
    });
});
