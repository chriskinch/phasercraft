import { describe, it, expect, vi, beforeEach } from "vitest";
import Enemy from "./Enemy";
import Projectile from "@entities/Weapons/Projectile";
import type { CombatType } from "@/types/game";
import { playSfx } from "@services/sfx";
import Special from "@entities/Loot/Special";
import Scroll from "@entities/Loot/Scroll";
import Crafting from "@entities/Loot/Crafting";

// Enemy.attack VFX: melee/healer enemies play the player's swoosh angled at the
// player and hit immediately; ranged enemies fire a homing bolt and the hit
// lands on impact. Constructor-free fake on the real prototype, with the
// Projectile module mocked at the entity seam.

vi.mock("@entities/Weapons/Projectile", () => ({ default: vi.fn() }));
vi.mock("@services/sfx", () => ({ playSfx: vi.fn(() => true) }));
vi.mock("@entities/Loot/Special", () => ({ default: vi.fn() }));
vi.mock("@entities/Loot/Scroll", () => ({ default: vi.fn() }));
vi.mock("@entities/Loot/Crafting", () => ({ default: vi.fn() }));
// The scene's shared selection ring, at the module seam.
const ring = vi.hoisted(() => ({ attach: vi.fn(), detach: vi.fn() }));
vi.mock("@entities/UI/SelectionRing", () => ({ default: { for: vi.fn(() => ring) } }));

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
    beforeEach(() => {
        ProjectileMock.mockClear();
        vi.mocked(playSfx).mockClear();
    });

    it.each(["melee", "healer"] as const)("%s swings the swoosh at the player and hits", (type) => {
        const enemy = makeEnemy(type);

        enemy.attack();

        expect(enemy.weapon.setAngle).toHaveBeenCalledWith(90);
        expect(enemy.weapon.swoosh).toHaveBeenCalledTimes(1);
        expect(ProjectileMock).not.toHaveBeenCalled();
        expect(enemy.scene.add.sprite).not.toHaveBeenCalled();
        expect(enemy.scene.events.emit).toHaveBeenCalledWith("enemy:attack", 12, type, enemy);
        expect(playSfx).toHaveBeenCalledTimes(1);
        expect(playSfx).toHaveBeenCalledWith("hurt");
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

        expect(enemy.scene.events.emit).toHaveBeenCalledWith("enemy:attack", 12, "ranged", enemy);
        expect(enemy.scene.add.sprite).toHaveBeenCalledWith(0, 100, "enemy-bolt", 0);
        const burst = enemy.scene.add.sprite.mock.results[0].value;
        expect(burst.play).toHaveBeenCalledWith("enemy-bolt-impact");
    });

    it("ranged plays the explosion sound on impact, not on firing", () => {
        const enemy = makeEnemy("ranged");
        enemy.attack();
        expect(playSfx).not.toHaveBeenCalled();

        ProjectileMock.mock.calls[0][0].onImpact(enemy.scene.player);

        expect(playSfx).toHaveBeenCalledTimes(1);
        expect(playSfx).toHaveBeenCalledWith("explosion");
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

// Lifecycle (#459): enemies now spawn in place with no drop-in, register one
// collider against the player (the enemy-vs-enemy one lives on BiomeScene), and
// can be silently despawned. Same constructor-free fake on the real prototype.

interface LifecycleEnemy {
    alive: boolean;
    active: boolean;
    state: string;
    selected: boolean;
    home: { x: number; y: number };
    states: { movement: string; attack: string };
    banes: { timers: Record<string, { remove: ReturnType<typeof vi.fn> }> };
    wandering_looped_timer: { remove: ReturnType<typeof vi.fn> } | null;
    swing: { remove: ReturnType<typeof vi.fn> } | null;
    circling: { remove: ReturnType<typeof vi.fn> } | null;
    player_collider?: { destroy: ReturnType<typeof vi.fn> };
    destination: { x: number; y: number } | null;
    scene_events: {
        on: ReturnType<typeof vi.fn>;
        off: ReturnType<typeof vi.fn>;
        emit: ReturnType<typeof vi.fn>;
    };
    scene: {
        selected: unknown;
        player: { hero: object };
        enemies: { remove: ReturnType<typeof vi.fn> };
        active_enemies: { remove: ReturnType<typeof vi.fn> };
        physics: {
            add: { collider: ReturnType<typeof vi.fn> };
            accelerateToObject: ReturnType<typeof vi.fn>;
        };
        time: { addEvent: ReturnType<typeof vi.fn> };
    };
    body: { setAcceleration: ReturnType<typeof vi.fn>; maxVelocity: { x: number } };
    stats: { speed: number };
    on: ReturnType<typeof vi.fn>;
    emit: ReturnType<typeof vi.fn>;
    destroy: ReturnType<typeof vi.fn>;
    dropLoot: ReturnType<typeof vi.fn>;
    cleanup(): void;
    despawn(): void;
    enemySpawned(): void;
    wander(): void;
}

function makeLifecycleEnemy(): LifecycleEnemy {
    const enemy = Object.create(Enemy.prototype) as LifecycleEnemy;
    const timer = () => ({ remove: vi.fn() });
    enemy.alive = true;
    enemy.active = true;
    enemy.state = "spawned";
    enemy.selected = false;
    enemy.home = { x: 400, y: 300 };
    enemy.states = { movement: "idle", attack: "primed" };
    enemy.banes = { timers: { frostbolt: timer() } };
    enemy.wandering_looped_timer = timer();
    enemy.swing = timer();
    enemy.circling = timer();
    enemy.player_collider = { destroy: vi.fn() };
    enemy.destination = null;
    enemy.scene_events = { on: vi.fn(), off: vi.fn(), emit: vi.fn() };
    enemy.scene = {
        selected: null,
        player: { hero: {} },
        enemies: { remove: vi.fn() },
        active_enemies: { remove: vi.fn() },
        physics: {
            add: { collider: vi.fn(() => ({ destroy: vi.fn() })) },
            accelerateToObject: vi.fn(),
        },
        time: { addEvent: vi.fn(() => timer()) },
    };
    enemy.body = { setAcceleration: vi.fn(), maxVelocity: { x: 1000 } };
    enemy.stats = { speed: 50 };
    enemy.on = vi.fn();
    enemy.emit = vi.fn();
    enemy.destroy = vi.fn();
    enemy.dropLoot = vi.fn();
    return enemy;
}

describe("Enemy.cleanup", () => {
    it("releases its timers, bane timers and player collider", () => {
        const enemy = makeLifecycleEnemy();
        const { wandering_looped_timer, swing, circling, player_collider } = enemy;
        const bane = enemy.banes.timers.frostbolt;

        enemy.cleanup();

        expect(wandering_looped_timer!.remove).toHaveBeenCalled();
        expect(swing!.remove).toHaveBeenCalled();
        expect(circling!.remove).toHaveBeenCalled();
        expect(bane.remove).toHaveBeenCalled();
        expect(player_collider!.destroy).toHaveBeenCalledTimes(1);
    });

    it("removes each scene listener with the handler it registered", () => {
        const enemy = makeLifecycleEnemy();

        enemy.cleanup();

        const off = enemy.scene_events.off.mock.calls;
        expect(off).toContainEqual(["pointerdown:game", Enemy.prototype.deselect, enemy]);
        expect(off).toContainEqual(["pointerdown:enemy", Enemy.prototype.deselect, enemy]);
        expect(off).toContainEqual(["shutdown", Enemy.prototype.cleanup, enemy]);
    });

    it("is idempotent — the collider is only destroyed once", () => {
        // destroy() nulls the collider's world, so a second call would throw.
        const enemy = makeLifecycleEnemy();
        const collider = enemy.player_collider!;

        enemy.cleanup();
        expect(() => enemy.cleanup()).not.toThrow();

        expect(collider.destroy).toHaveBeenCalledTimes(1);
        expect(enemy.wandering_looped_timer).toBeNull();
        expect(enemy.swing).toBeNull();
        expect(enemy.circling).toBeNull();
    });
});

describe("Enemy.despawn", () => {
    it("is silent: no enemy:dead, no loot", () => {
        const enemy = makeLifecycleEnemy();

        enemy.despawn();

        expect(enemy.emit).not.toHaveBeenCalledWith("enemy:dead", expect.anything());
        expect(enemy.scene_events.emit).not.toHaveBeenCalledWith("enemy:dead", expect.anything());
        expect(enemy.dropLoot).not.toHaveBeenCalled();
    });

    it("announces enemy:despawned, leaves its groups and destroys itself", () => {
        const enemy = makeLifecycleEnemy();

        enemy.despawn();

        expect(enemy.scene_events.emit).toHaveBeenCalledWith("enemy:despawned", enemy);
        expect(enemy.scene.enemies.remove).toHaveBeenCalledWith(enemy);
        expect(enemy.scene.active_enemies.remove).toHaveBeenCalledWith(enemy);
        expect(enemy.destroy).toHaveBeenCalledTimes(1);
        expect(enemy.alive).toBe(false);
        expect(enemy.active).toBe(false);
    });

    it("announces the despawn while still selected, then deselects", () => {
        // The player decides whether to stop chasing by comparing its target
        // to the despawned enemy, so the event must fire before deselect().
        const enemy = makeLifecycleEnemy();
        enemy.selected = true;
        enemy.scene.selected = enemy;
        ring.detach.mockClear();
        let selected_at_emit: unknown;
        enemy.scene_events.emit.mockImplementation(() => {
            selected_at_emit = enemy.scene.selected;
        });

        enemy.despawn();

        expect(selected_at_emit).toBe(enemy);
        expect(enemy.scene.selected).toBeNull();
        expect(ring.detach).toHaveBeenCalledWith(enemy);
    });

    it("does nothing to an enemy that is already dead", () => {
        // A dead enemy stays on screen decomposing; it must not also despawn.
        const enemy = makeLifecycleEnemy();
        enemy.alive = false;

        enemy.despawn();

        expect(enemy.scene_events.emit).not.toHaveBeenCalled();
        expect(enemy.destroy).not.toHaveBeenCalled();
    });
});

describe("Enemy.death", () => {
    it("emits enemy:dead on the scene with the dying enemy itself", () => {
        // The spawn director counts a kill by identity, so the payload must be
        // this exact instance, not a copy or an id.
        const enemy = makeLifecycleEnemy() as LifecycleEnemy & {
            monster: { death: ReturnType<typeof vi.fn> };
            health: { remove: ReturnType<typeof vi.fn> };
            deselect(): void;
            decompose: ReturnType<typeof vi.fn>;
            death(): void;
            input?: { enabled: boolean };
        };
        const emit = vi.fn();
        Object.assign(enemy.scene, {
            events: { emit, off: vi.fn() },
            physics: { ...enemy.scene.physics, world: { disable: vi.fn() } },
        });
        enemy.monster = { death: vi.fn() };
        enemy.health = { remove: vi.fn() };
        enemy.decompose = vi.fn();

        enemy.death();

        expect(emit).toHaveBeenCalledWith("enemy:dead", enemy);
    });

    it("pins the corpse's depth to its middle once it leaves the feet sort", () => {
        const enemy = makeLifecycleEnemy() as LifecycleEnemy & {
            monster: { death: ReturnType<typeof vi.fn> };
            health: { remove: ReturnType<typeof vi.fn> };
            decompose: ReturnType<typeof vi.fn>;
            death(): void;
            setDepth: ReturnType<typeof vi.fn>;
            y: number;
        };
        Object.assign(enemy.scene, {
            events: { emit: vi.fn(), off: vi.fn() },
            physics: { ...enemy.scene.physics, world: { disable: vi.fn() } },
        });
        enemy.monster = { death: vi.fn() };
        enemy.health = { remove: vi.fn() };
        enemy.decompose = vi.fn();
        enemy.setDepth = vi.fn();
        enemy.y = 240;

        enemy.death();

        expect(enemy.setDepth).toHaveBeenCalledExactlyOnceWith(240);
    });
});

describe("Enemy.enemySpawned", () => {
    it("stores the player collider rather than leaking it", () => {
        const enemy = makeLifecycleEnemy();
        enemy.player_collider = undefined;

        enemy.enemySpawned();

        expect(enemy.scene.physics.add.collider).toHaveBeenCalledTimes(1);
        expect(enemy.scene.physics.add.collider).toHaveBeenCalledWith(
            enemy.scene.player.hero,
            enemy
        );
        expect(enemy.player_collider).toBe(enemy.scene.physics.add.collider.mock.results[0].value);
        expect(enemy.state).toBe("spawned");
    });
});

describe("Enemy.setWandering", () => {
    it("replaces rather than orphans an existing wander loop", () => {
        const enemy = makeLifecycleEnemy() as LifecycleEnemy & { setWandering(): void };
        const first = enemy.wandering_looped_timer!;

        enemy.setWandering();

        expect(first.remove).toHaveBeenCalledTimes(1);
        expect(enemy.wandering_looped_timer).not.toBe(first);
        expect(enemy.wandering_looped_timer).toBe(enemy.scene.time.addEvent.mock.results[0].value);
    });
});

describe("Enemy.wander", () => {
    it("wanders within 30px of where it spawned", () => {
        const enemy = makeLifecycleEnemy();

        for (let i = 0; i < 50; i++) {
            enemy.wander();
            expect(Math.abs(enemy.destination!.x - enemy.home.x)).toBeLessThanOrEqual(30);
            expect(Math.abs(enemy.destination!.y - enemy.home.y)).toBeLessThanOrEqual(30);
        }
    });
});

// `special` and `scroll` entries must drop their own entity, not fall through
// dropLoot's default branch into a Crafting component.
describe("Enemy.dropLoot", () => {
    const dropOne = (name: string) => {
        const enemy = Object.create(Enemy.prototype) as {
            x: number;
            y: number;
            scene: object;
            loot_table: Array<{ name: string; rate: number; bonus: number }>;
            dropLoot(): void;
        };
        enemy.x = 5;
        enemy.y = 6;
        enemy.scene = {};
        enemy.loot_table = [{ name, rate: 100, bonus: 0 }];
        enemy.dropLoot();
        return enemy;
    };

    it("drops a Special for a special entry", () => {
        const enemy = dropOne("special");

        expect(vi.mocked(Special)).toHaveBeenCalledTimes(1);
        expect(vi.mocked(Special)).toHaveBeenCalledWith({ scene: enemy.scene, x: 5, y: 6 });
        expect(vi.mocked(Crafting)).not.toHaveBeenCalled();
    });

    it("drops a Scroll for a scroll entry", () => {
        const enemy = dropOne("scroll");

        expect(vi.mocked(Scroll)).toHaveBeenCalledTimes(1);
        expect(vi.mocked(Scroll)).toHaveBeenCalledWith({ scene: enemy.scene, x: 5, y: 6 });
        expect(vi.mocked(Crafting)).not.toHaveBeenCalled();
    });
});

describe("Enemy stun", () => {
    function makeStunnable(stunned: boolean) {
        const enemy = Object.create(Enemy.prototype) as Enemy;
        const attack = vi.fn();
        const accelerateToObject = vi.fn();
        Object.assign(enemy, {
            state: "spawned",
            x: 0,
            y: 0,
            attack_radius: 100,
            states: { attack: "primed", movement: "chasing" },
            banes: { stunned },
            health: { update: vi.fn(), getValue: () => 10 },
            body: { setAcceleration: vi.fn(), setVelocity: vi.fn(), maxVelocity: { x: 100 } },
            monster: { freeze: vi.fn(), unfreeze: vi.fn() },
            stats: { speed: 50 },
            target: {},
            setDepth: vi.fn(),
            attack,
            scene: { player: { x: 10, y: 0 }, physics: { accelerateToObject } },
        });
        return { enemy, attack, accelerateToObject };
    }

    it("a stunned enemy halts and neither attacks nor moves", () => {
        const { enemy, attack, accelerateToObject } = makeStunnable(true);

        enemy.update(0, 16);
        enemy.move();

        expect(attack).not.toHaveBeenCalled();
        expect(accelerateToObject).not.toHaveBeenCalled();
        expect(enemy.body.setVelocity).toHaveBeenCalledWith(0, 0);
        expect(enemy.monster.freeze).toHaveBeenCalled();
    });

    it("an unstunned enemy in range attacks", () => {
        const { enemy, attack } = makeStunnable(false);
        Object.assign(enemy, {
            movementAnimationHandler: vi.fn(),
            isInAggroDistance: () => false,
            destination: null,
        });
        enemy.update(0, 16);
        expect(attack).toHaveBeenCalled();
        expect(enemy.monster.unfreeze).toHaveBeenCalled();
    });
});

describe("Enemy depth", () => {
    // BiomeScene.sortCharactersByFeet owns a live enemy's depth (on its feet)
    // and runs after the group update each frame; a write here would be
    // overwritten unseen and still queue a display-list sort.
    it("update does not write the enemy's depth", () => {
        const enemy = Object.create(Enemy.prototype) as Enemy;
        const setDepth = vi.fn();
        Object.assign(enemy, { state: "dead", setDepth });

        enemy.update(0, 16);

        expect(setDepth).not.toHaveBeenCalled();
    });
});

describe("Enemy.movementAnimationHandler", () => {
    function makeWalker(vx: number) {
        const enemy = Object.create(Enemy.prototype) as Enemy;
        const monster = { walk: vi.fn(), idle: vi.fn() };
        Object.assign(enemy, { key: "imp", monster, body: { velocity: { x: vx, y: 0 } } });
        return { enemy, monster };
    }

    it.each([
        [-40, "imp-left-down"],
        [40, "imp-right-up"],
    ])("walks with velocity x %d as %s", (vx, anim) => {
        const { enemy, monster } = makeWalker(vx);

        enemy.movementAnimationHandler();

        expect(monster.walk).toHaveBeenCalledWith(anim);
        expect(monster.idle).not.toHaveBeenCalled();
    });

    it("idles when not moving sideways", () => {
        const { enemy, monster } = makeWalker(0);

        enemy.movementAnimationHandler();

        expect(monster.idle).toHaveBeenCalledTimes(1);
        expect(monster.walk).not.toHaveBeenCalled();
    });
});

describe("Enemy.scaleToDifficulty", () => {
    const base = {
        damage: 60,
        health_max: 200,
        speed: 50,
        range: 40,
        attack_speed: 0.98,
        health_regen_rate: 0,
    };

    function scaled(difficulty: number) {
        const enemy = Object.create(Enemy.prototype) as Enemy;
        enemy.scaleToDifficulty({ ...base }, 2, difficulty);
        return enemy;
    }

    it("leaves today's stats, XP and coin value untouched at 1", () => {
        const enemy = scaled(1);
        expect(enemy.stats).toMatchObject({ damage: 60, health_max: 200, health_value: 200 });
        expect(enemy.xp).toBe(20);
        expect(enemy.coin_multiplier).toBe(2);
        expect(enemy.level).toBe(5);
    });

    it("scales health and damage, starting at full health", () => {
        const enemy = scaled(3);
        expect(enemy.base_stats).toMatchObject({ damage: 180, health_max: 600 });
        expect(enemy.stats.health_value).toBe(600);
        expect(enemy.stats.speed).toBe(50);
        expect(enemy.difficulty).toBe(3);
    });

    it("is worth XP from its scaled max health", () => {
        expect(scaled(3).xp).toBe(60);
        expect(scaled(6).xp).toBe(120);
    });

    it("drops coins and gems worth the creature's multiplier × difficulty", () => {
        expect(scaled(1.5).coin_multiplier).toBe(3);
        expect(scaled(6).coin_multiplier).toBe(12);
    });

    it("shows its level as difficulty × 5", () => {
        expect(scaled(2.34).level).toBe(12);
        expect(scaled(6).level).toBe(30);
    });
});
