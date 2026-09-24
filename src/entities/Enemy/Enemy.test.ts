import { describe, it, expect, vi, beforeEach } from "vitest";
import Enemy from "./Enemy";
import Projectile from "@entities/Weapons/Projectile";
import type { CombatType } from "@/types/game";

// Enemy.attack VFX: melee/healer enemies play the player's swoosh angled at the
// player and hit immediately; ranged enemies fire a homing bolt and the hit
// lands on impact. Constructor-free fake on the real prototype, with the
// Projectile module mocked at the entity seam.

vi.mock("@entities/Weapons/Projectile", () => ({ default: vi.fn() }));

interface EnemyUnderTest {
    x: number;
    y: number;
    combat_type: CombatType;
    stats: { damage: number; attack_speed: number };
    states: { movement: string; attack: string };
    scene: {
        player: { x: number; y: number };
        events: { emit: ReturnType<typeof vi.fn> };
        time: { addEvent: ReturnType<typeof vi.fn> };
        add: { sprite: ReturnType<typeof vi.fn> };
    };
    weapon: { setAngle: ReturnType<typeof vi.fn>; swoosh: ReturnType<typeof vi.fn> };
    attack(): void;
}

function makeBurst() {
    return {
        setDepth: vi.fn(),
        setPosition: vi.fn(),
        on: vi.fn(),
        once: vi.fn(),
        play: vi.fn(),
        destroy: vi.fn(),
    };
}

function makeEnemy(combat_type: CombatType): EnemyUnderTest {
    const enemy = Object.create(Enemy.prototype) as EnemyUnderTest;
    enemy.x = 0;
    enemy.y = 0;
    enemy.combat_type = combat_type;
    enemy.stats = { damage: 12, attack_speed: 1 };
    enemy.states = { movement: "chasing", attack: "primed" };
    enemy.scene = {
        player: { x: 0, y: 100 },
        events: { emit: vi.fn() },
        time: { addEvent: vi.fn() },
        add: { sprite: vi.fn(() => makeBurst()) },
    };
    enemy.weapon = { setAngle: vi.fn(), swoosh: vi.fn() };
    return enemy;
}

const ProjectileMock = vi.mocked(Projectile);

describe("Enemy.attack", () => {
    beforeEach(() => ProjectileMock.mockClear());

    it.each(["melee", "healer"] as const)("%s swings the swoosh at the player and hits", (type) => {
        const enemy = makeEnemy(type);

        enemy.attack();

        expect(enemy.weapon.setAngle).toHaveBeenCalledWith(90);
        expect(enemy.weapon.swoosh).toHaveBeenCalledTimes(1);
        expect(ProjectileMock).not.toHaveBeenCalled();
        expect(enemy.scene.add.sprite).not.toHaveBeenCalled();
        expect(enemy.scene.events.emit).toHaveBeenCalledWith("enemy:attack", 12, type);
    });

    it("ranged fires a bolt at the player and hits on impact", () => {
        const enemy = makeEnemy("ranged");

        enemy.attack();

        expect(enemy.weapon.swoosh).not.toHaveBeenCalled();
        expect(ProjectileMock).toHaveBeenCalledTimes(1);
        const opts = ProjectileMock.mock.calls[0][0];
        expect(opts.key).toBe("enemy-bolt");
        expect(opts.target).toBe(enemy.scene.player);
        expect(enemy.scene.events.emit).not.toHaveBeenCalled();

        opts.onImpact(enemy.scene.player);

        expect(enemy.scene.events.emit).toHaveBeenCalledWith("enemy:attack", 12, "ranged");
        expect(enemy.scene.add.sprite).toHaveBeenCalledWith(0, 100, "enemy-bolt", 0);
        const burst = enemy.scene.add.sprite.mock.results[0].value;
        expect(burst.play).toHaveBeenCalledWith("enemy-bolt-impact");
    });

    it("ranged impact burst removes itself when its animation completes", () => {
        const enemy = makeEnemy("ranged");
        enemy.attack();
        ProjectileMock.mock.calls[0][0].onImpact(enemy.scene.player);
        const burst = enemy.scene.add.sprite.mock.results[0].value;

        const [, onComplete] = burst.once.mock.calls[0];
        onComplete();

        expect(burst.destroy).toHaveBeenCalledTimes(1);
    });

    it("does nothing while recovering", () => {
        const enemy = makeEnemy("ranged");
        enemy.states.attack = "recovering";

        enemy.attack();

        expect(ProjectileMock).not.toHaveBeenCalled();
        expect(enemy.scene.events.emit).not.toHaveBeenCalled();
    });
});

interface LifecycleEnemyUnderTest {
    alive: boolean;
    active: boolean;
    input?: { enabled: boolean };
    cleaned_up?: boolean;
    caution?: number;
    scene: {
        enemies: { remove: ReturnType<typeof vi.fn> };
        active_enemies: { remove: ReturnType<typeof vi.fn> };
    };
    scene_events: { off: ReturnType<typeof vi.fn>; emit: ReturnType<typeof vi.fn> };
    physics_world: {
        disable: ReturnType<typeof vi.fn>;
        removeCollider: ReturnType<typeof vi.fn>;
    };
    wandering_looped_timer: { remove: ReturnType<typeof vi.fn> } | null;
    swing: { remove: ReturnType<typeof vi.fn> } | null;
    circling: { remove: ReturnType<typeof vi.fn> } | null;
    player_collider: object | null;
    deselect: ReturnType<typeof vi.fn>;
    destroy: ReturnType<typeof vi.fn>;
    dropLoot: ReturnType<typeof vi.fn>;
    monster: { death: ReturnType<typeof vi.fn> };
    cleanup(): void;
    despawn(): void;
    home: { x: number; y: number };
    states: { movement: string };
    destination?: { x: number; y: number };
    move: ReturnType<typeof vi.fn>;
    wander(): void;
}

function makeLifecycleEnemy(): LifecycleEnemyUnderTest {
    const enemy = Object.create(Enemy.prototype) as LifecycleEnemyUnderTest;
    enemy.alive = true;
    enemy.active = true;
    enemy.input = { enabled: true };
    enemy.scene = {
        enemies: { remove: vi.fn() },
        active_enemies: { remove: vi.fn() },
    };
    enemy.scene_events = { off: vi.fn(), emit: vi.fn() };
    enemy.physics_world = { disable: vi.fn(), removeCollider: vi.fn() };
    enemy.wandering_looped_timer = { remove: vi.fn() };
    enemy.swing = { remove: vi.fn() };
    enemy.circling = { remove: vi.fn() };
    enemy.player_collider = { id: "player" };
    enemy.deselect = vi.fn();
    enemy.destroy = vi.fn();
    enemy.dropLoot = vi.fn();
    enemy.monster = { death: vi.fn() };
    enemy.home = { x: 100, y: 200 };
    enemy.states = { movement: "idle" };
    enemy.move = vi.fn();
    return enemy;
}

describe("Enemy.cleanup", () => {
    it("releases timers, scene listeners, and the player collider exactly once", () => {
        const enemy = makeLifecycleEnemy();

        enemy.cleanup();
        enemy.cleanup();

        expect(enemy.wandering_looped_timer).toBeNull();
        expect(enemy.swing).toBeNull();
        expect(enemy.circling).toBeNull();
        expect(enemy.scene_events.off).toHaveBeenCalledWith(
            "pointerdown:enemy",
            enemy.deselect,
            enemy
        );
        expect(enemy.scene_events.off).toHaveBeenCalledWith(
            "pointerdown:game",
            enemy.deselect,
            enemy
        );
        expect(enemy.physics_world.removeCollider).toHaveBeenCalledWith({ id: "player" });
        expect(enemy.physics_world.removeCollider).toHaveBeenCalledTimes(1);
    });
});

describe("Enemy.despawn", () => {
    it("silently removes the enemy without loot or enemy:dead", () => {
        const enemy = makeLifecycleEnemy();

        enemy.despawn();

        expect(enemy.deselect).toHaveBeenCalledTimes(1);
        expect(enemy.physics_world.disable).toHaveBeenCalledWith(enemy);
        expect(enemy.scene.enemies.remove).toHaveBeenCalledWith(enemy);
        expect(enemy.scene.active_enemies.remove).toHaveBeenCalledWith(enemy);
        expect(enemy.scene_events.emit).toHaveBeenCalledWith("enemy:despawned", enemy);
        expect(enemy.scene_events.emit).not.toHaveBeenCalledWith("enemy:dead", enemy);
        expect(enemy.dropLoot).not.toHaveBeenCalled();
        expect(enemy.monster.death).not.toHaveBeenCalled();
        expect(enemy.destroy).toHaveBeenCalledTimes(1);
    });
});

describe("Enemy.wander", () => {
    it("wanders around the stored home anchor", () => {
        const enemy = makeLifecycleEnemy();
        const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);

        enemy.wander();

        expect(enemy.destination).toEqual({ x: 70, y: 170 });
        expect(enemy.move).toHaveBeenCalledWith({ target: enemy.destination });
        expect(enemy.states.movement).toBe("wandering");
        randomSpy.mockRestore();
    });
});
