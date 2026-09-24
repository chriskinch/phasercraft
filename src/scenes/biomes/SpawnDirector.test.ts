import { describe, it, expect, vi } from "vitest";
import { DEFAULT_AREA_TUNING, type AreaTuning } from "@config/area";
import SpawnDirector, { type SpawnHost } from "./SpawnDirector";

// The director is pure logic over a host, so it runs here against a fake host
// with a seeded random source: no Phaser, and every spawn point reproducible.

class FakeEnemy {
    despawn = vi.fn();
    constructor(
        public x: number,
        public y: number,
        public id: string
    ) {}
}

// Park–Miller: deterministic, and never repeats a value within a test, so
// successive spawns do not land on top of each other by accident.
function seeded(seed = 42): () => number {
    let state = seed;
    return () => {
        state = (state * 16807) % 2147483647;
        return (state - 1) / 2147483646;
    };
}

// 800x600 at zoom 1: half the 1000px diagonal plus the 64px margin.
const RADIUS = 564;

function makeDirector(tuning: Partial<AreaTuning> = {}, host: Partial<SpawnHost<FakeEnemy>> = {}) {
    const player = { x: 5000, y: 5000 };
    const velocity = { x: 0, y: 0 };
    const fake: SpawnHost<FakeEnemy> = {
        playerPosition: () => player,
        playerVelocity: () => velocity,
        view: () => ({ width: 800, height: 600, zoom: 1 }),
        isSpawnable: vi.fn(() => true),
        footprint: vi.fn(() => ({ width: 32, height: 32 })),
        pickRegular: vi.fn(() => "imp"),
        pickBoss: vi.fn(() => "ghoul"),
        spawnRegular: vi.fn((id: string, at) => new FakeEnemy(at.x, at.y, id)),
        spawnBoss: vi.fn((id: string, at) => new FakeEnemy(at.x, at.y, `boss:${id}`)),
        onProgress: vi.fn(),
        onAreaCleared: vi.fn(),
        onBossSpawned: vi.fn(),
        random: seeded(),
        ...host,
    };
    const director = new SpawnDirector({ ...DEFAULT_AREA_TUNING, ...tuning }, fake);
    const spawnRegular = vi.mocked(fake.spawnRegular);
    const spawnBoss = vi.mocked(fake.spawnBoss);
    const regulars = () => spawnRegular.mock.results.map((r) => r.value as FakeEnemy);
    const bosses = () => spawnBoss.mock.results.map((r) => r.value as FakeEnemy);
    return { director, host: fake, player, velocity, spawnRegular, spawnBoss, regulars, bosses };
}

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.hypot(a.x - b.x, a.y - b.y);

// Signed angle between a point's bearing from the player and a direction.
const offAngle = (
    player: { x: number; y: number },
    p: { x: number; y: number },
    dir: { x: number; y: number }
) => {
    const diff = Math.atan2(p.y - player.y, p.x - player.x) - Math.atan2(dir.y, dir.x);
    return Math.atan2(Math.sin(diff), Math.cos(diff));
};

describe("SpawnDirector pacing", () => {
    it("starts the HUD at the full kill count, with no boss", () => {
        const { director, host } = makeDirector();

        director.start();

        expect(host.onProgress).toHaveBeenCalledWith(20, false);
    });

    it("spawns at most one enemy per tick, up to the live cap", () => {
        const { director, spawnRegular } = makeDirector({ liveCap: 3 });

        director.tick();
        expect(spawnRegular).toHaveBeenCalledTimes(1);

        for (let i = 0; i < 10; i++) director.tick();
        expect(spawnRegular).toHaveBeenCalledTimes(3);
        expect(director.regularsAlive).toBe(3);
    });

    it("draws each regular from the host's pool", () => {
        const { director, host, spawnRegular } = makeDirector();

        director.tick();

        expect(host.pickRegular).toHaveBeenCalled();
        expect(spawnRegular.mock.calls[0][0]).toBe("imp");
    });
});

describe("SpawnDirector placement", () => {
    it("spawns exactly on the viewport-derived radius", () => {
        const { director, player, regulars } = makeDirector();

        for (let i = 0; i < 5; i++) director.tick();

        regulars().forEach((enemy) => expect(distance(enemy, player)).toBeCloseTo(RADIUS));
    });

    it("uses a fixed radius override when one is set", () => {
        const { director, player, regulars } = makeDirector({ radiusOverride: 200 });

        director.tick();

        expect(distance(regulars()[0], player)).toBeCloseTo(200);
    });

    it("spawns within the cone ahead of a moving player", () => {
        const { director, player, velocity, regulars } = makeDirector({ liveCap: 50 });
        velocity.x = -120;
        velocity.y = 60;

        for (let i = 0; i < 50; i++) director.tick();

        expect(regulars().length).toBeGreaterThan(10);
        regulars().forEach((enemy) =>
            expect(Math.abs(offAngle(player, enemy, velocity))).toBeLessThanOrEqual(
                Math.PI / 4 + 1e-9
            )
        );
    });

    it("spawns anywhere around a player standing still", () => {
        // random() = 0.5 puts a stationary spawn half-way round the ring: due
        // left, where a cone facing right could never reach.
        const { director, player, regulars } = makeDirector({}, { random: () => 0.5 });

        director.tick();

        expect(regulars()[0].x).toBeCloseTo(player.x - RADIUS);
        expect(regulars()[0].y).toBeCloseTo(player.y);
    });

    it("checks the creature's whole footprint, centred on the spawn point", () => {
        const { director, host, regulars } = makeDirector(
            {},
            { footprint: vi.fn(() => ({ width: 40, height: 20 })) }
        );

        director.tick();

        const enemy = regulars()[0];
        expect(host.isSpawnable).toHaveBeenCalledWith({
            x: enemy.x - 20,
            y: enemy.y - 10,
            width: 40,
            height: 20,
        });
        expect(host.footprint).toHaveBeenCalledWith("imp", false);
    });

    it("skips the tick after a bounded number of rejected points", () => {
        const { director, host, spawnRegular } = makeDirector(
            { attemptsPerTick: 7 },
            { isSpawnable: vi.fn(() => false) }
        );

        director.tick();

        expect(host.isSpawnable).toHaveBeenCalledTimes(7);
        expect(spawnRegular).not.toHaveBeenCalled();
    });

    it("retries on a later tick once there is room", () => {
        const isSpawnable = vi.fn(() => false);
        const { director, spawnRegular } = makeDirector({}, { isSpawnable });

        director.tick();
        isSpawnable.mockReturnValue(true);
        director.tick();

        expect(spawnRegular).toHaveBeenCalledTimes(1);
    });

    it("never spawns on top of a live enemy", () => {
        // A constant random source proposes the same point every time.
        const { director, spawnRegular } = makeDirector({}, { random: () => 0.5 });

        director.tick();
        director.tick();

        expect(spawnRegular).toHaveBeenCalledTimes(1);
    });
});

describe("SpawnDirector despawning", () => {
    it("despawns an enemy left beyond the radius for the full delay", () => {
        const { director, player, regulars } = makeDirector({ despawnDelayMs: 1000 });
        director.tick();
        const enemy = regulars()[0];
        player.x += 2000;

        director.update(999);
        expect(enemy.despawn).not.toHaveBeenCalled();

        director.update(1);
        expect(enemy.despawn).toHaveBeenCalledTimes(1);
        expect(director.regularsAlive).toBe(0);
    });

    it("resets the clock whenever the enemy comes back within range", () => {
        const { director, player, regulars } = makeDirector({ despawnDelayMs: 1000 });
        director.tick();
        const enemy = regulars()[0];

        player.x += 2000;
        director.update(900);
        player.x -= 2000;
        director.update(16);
        player.x += 2000;
        director.update(900);

        expect(enemy.despawn).not.toHaveBeenCalled();
    });

    it("does not start the clock for an enemy sitting exactly on the radius", () => {
        const { director, regulars } = makeDirector({ despawnDelayMs: 1000 });
        director.tick();

        director.update(5000);

        expect(regulars()[0].despawn).not.toHaveBeenCalled();
    });

    it("does not count a despawn as a kill, and frees a slot for a new spawn", () => {
        const { director, host, player, spawnRegular } = makeDirector({
            liveCap: 1,
            despawnDelayMs: 10,
        });
        director.tick();
        vi.mocked(host.onProgress).mockClear();

        player.x += 2000;
        director.update(10);
        director.tick();

        expect(host.onProgress).not.toHaveBeenCalled();
        expect(director.killsRemaining).toBe(20);
        expect(spawnRegular).toHaveBeenCalledTimes(2);
    });
});

describe("SpawnDirector kills and the boss", () => {
    function killAll(director: SpawnDirector<FakeEnemy>, enemies: FakeEnemy[]) {
        enemies.forEach((enemy) => director.onEnemyDead(enemy));
    }

    it("counts kills down on the HUD", () => {
        const { director, host, regulars } = makeDirector();
        director.tick();

        director.onEnemyDead(regulars()[0]);

        expect(host.onProgress).toHaveBeenLastCalledWith(19, false);
        expect(director.killsRemaining).toBe(19);
    });

    it("ignores the death of an enemy it did not spawn", () => {
        const { director, host } = makeDirector();

        director.onEnemyDead(new FakeEnemy(0, 0, "stray"));

        expect(host.onProgress).not.toHaveBeenCalled();
        expect(director.killsRemaining).toBe(20);
    });

    it("spawns the boss the moment the last kill lands, with regulars still alive", () => {
        const { director, host, spawnBoss, regulars } = makeDirector({
            killsToBoss: 2,
            liveCap: 5,
        });
        for (let i = 0; i < 5; i++) director.tick();

        killAll(director, regulars().slice(0, 2));

        expect(host.pickBoss).toHaveBeenCalledTimes(1);
        expect(spawnBoss).toHaveBeenCalledTimes(1);
        expect(spawnBoss.mock.calls[0][0]).toBe("ghoul");
        expect(host.footprint).toHaveBeenLastCalledWith("ghoul", true);
        expect(host.onProgress).toHaveBeenLastCalledWith(0, true);
        expect(director.regularsAlive).toBe(3);
    });

    it("announces the boss every time it appears: first spawn, retry and respawn", () => {
        const isSpawnable = vi.fn(() => true);
        const { director, host, player, regulars, bosses } = makeDirector(
            { killsToBoss: 1, despawnDelayMs: 10 },
            { isSpawnable }
        );
        director.tick();

        // First attempt finds no room: nothing to announce yet.
        isSpawnable.mockReturnValue(false);
        killAll(director, regulars());
        expect(host.onBossSpawned).not.toHaveBeenCalled();

        // The retry on the next tick lands it.
        isSpawnable.mockReturnValue(true);
        director.tick();
        expect(host.onBossSpawned).toHaveBeenCalledTimes(1);
        expect(host.onBossSpawned).toHaveBeenLastCalledWith(bosses()[0]);

        // Left behind, despawned, and respawned ahead: announced again.
        player.x += 5000;
        director.update(10);
        director.tick();
        expect(host.onBossSpawned).toHaveBeenCalledTimes(2);
        expect(host.onBossSpawned).toHaveBeenLastCalledWith(bosses()[1]);
    });

    it("stops spawning regulars once the boss is triggered", () => {
        const { director, spawnRegular, regulars } = makeDirector({ killsToBoss: 1 });
        director.tick();
        killAll(director, regulars());

        for (let i = 0; i < 10; i++) director.tick();

        expect(spawnRegular).toHaveBeenCalledTimes(1);
    });

    it("does not clear the area when a regular dies after the boss spawns", () => {
        const { director, host, regulars } = makeDirector({ killsToBoss: 1 });
        director.tick();
        director.tick();
        const [first, second] = regulars();
        director.onEnemyDead(first);
        vi.mocked(host.onProgress).mockClear();

        director.onEnemyDead(second);

        expect(host.onAreaCleared).not.toHaveBeenCalled();
        expect(host.onProgress).not.toHaveBeenCalled();
    });

    it("clears the area only when the boss itself dies, and spawns nothing after", () => {
        const { director, host, spawnRegular, spawnBoss, regulars, bosses } = makeDirector({
            killsToBoss: 1,
        });
        director.tick();
        killAll(director, regulars());

        director.onEnemyDead(bosses()[0]);
        for (let i = 0; i < 10; i++) director.tick();

        expect(host.onAreaCleared).toHaveBeenCalledTimes(1);
        expect(spawnRegular).toHaveBeenCalledTimes(1);
        expect(spawnBoss).toHaveBeenCalledTimes(1);
    });

    it("retries the boss on later ticks when there is no room at first", () => {
        const isSpawnable = vi.fn(() => true);
        const { director, spawnBoss, regulars } = makeDirector({ killsToBoss: 1 }, { isSpawnable });
        director.tick();
        isSpawnable.mockReturnValue(false);
        killAll(director, regulars());
        expect(spawnBoss).not.toHaveBeenCalled();

        isSpawnable.mockReturnValue(true);
        director.tick();

        expect(spawnBoss).toHaveBeenCalledTimes(1);
    });

    it("respawns a despawned boss ahead as the same creature, only once", () => {
        const { director, player, spawnBoss, regulars, bosses } = makeDirector({
            killsToBoss: 1,
            despawnDelayMs: 10,
        });
        director.tick();
        killAll(director, regulars());

        player.x += 5000;
        director.update(10);
        expect(bosses()[0].despawn).toHaveBeenCalledTimes(1);

        director.tick();
        director.tick();

        expect(spawnBoss).toHaveBeenCalledTimes(2);
        expect(spawnBoss.mock.calls[1][0]).toBe("ghoul");
    });

    it("does not clear the area when a despawned boss's replacement is still alive", () => {
        const { director, host, player, bosses, regulars } = makeDirector({
            killsToBoss: 1,
            despawnDelayMs: 10,
        });
        director.tick();
        killAll(director, regulars());
        player.x += 5000;
        director.update(10);
        director.tick();

        // The first boss is gone; a stale death event for it must not count.
        director.onEnemyDead(bosses()[0]);
        expect(host.onAreaCleared).not.toHaveBeenCalled();

        director.onEnemyDead(bosses()[1]);
        expect(host.onAreaCleared).toHaveBeenCalledTimes(1);
    });
});

describe("SpawnDirector.debugView", () => {
    it("reports the radius, cone and despawn delay the director is using", () => {
        const { director, velocity } = makeDirector({ despawnDelayMs: 3000, coneHalfAngleDeg: 30 });
        velocity.x = 50;

        const view = director.debugView();

        expect(view.radius).toBeCloseTo(RADIUS);
        expect(view.direction).toEqual({ x: 1, y: 0 });
        expect(view.halfAngle).toBeCloseTo(Math.PI / 6);
        expect(view.despawnDelayMs).toBe(3000);
    });

    it("reports no direction while the player stands still", () => {
        const { director } = makeDirector();

        expect(director.debugView().direction).toBeNull();
    });

    it("lists every tracked enemy with its despawn clock", () => {
        const { director, player, regulars } = makeDirector({ despawnDelayMs: 1000 });
        director.tick();
        player.x += 2000;
        director.update(250);

        expect(director.debugView().enemies).toEqual([{ enemy: regulars()[0], beyondMs: 250 }]);
    });

    it("records the last spawn attempt's candidates and which one fit", () => {
        const isSpawnable = vi.fn().mockReturnValueOnce(false).mockReturnValueOnce(true);
        const { director } = makeDirector({}, { isSpawnable });

        director.tick();

        const attempts = director.debugView().attempts;
        expect(attempts.map((a) => a.ok)).toEqual([false, true]);
    });

    it("keeps only the most recent attempt's candidates", () => {
        const { director } = makeDirector(
            { attemptsPerTick: 3 },
            { isSpawnable: vi.fn(() => false) }
        );

        director.tick();
        director.tick();

        expect(director.debugView().attempts).toHaveLength(3);
    });
});

describe("SpawnDirector.stop", () => {
    it("freezes spawning, despawning and kill counting", () => {
        const { director, host, player, spawnRegular, regulars } = makeDirector({
            despawnDelayMs: 10,
        });
        director.tick();
        const enemy = regulars()[0];
        vi.mocked(host.onProgress).mockClear();

        director.stop();
        director.tick();
        player.x += 2000;
        director.update(1000);
        director.onEnemyDead(enemy);

        expect(spawnRegular).toHaveBeenCalledTimes(1);
        expect(enemy.despawn).not.toHaveBeenCalled();
        expect(host.onProgress).not.toHaveBeenCalled();
    });
});
