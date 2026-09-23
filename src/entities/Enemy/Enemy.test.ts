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
