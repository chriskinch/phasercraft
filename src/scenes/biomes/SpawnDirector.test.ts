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
        pickMiniboss: vi.fn(() => "ghoul"),
        spawnRegular: vi.fn((id: string, at) => new FakeEnemy(at.x, at.y, id)),
        spawnMiniboss: vi.fn((id: string, at) => new FakeEnemy(at.x, at.y, `miniboss:${id}`)),
        onAreaCleared: vi.fn(),
        onMinibossSpawned: vi.fn(),
        random: seeded(),
        ...host,
    };
    // The miniboss is off unless a test turns it on, so the regular-spawn tests
    // never meet a miniboss roll.
    const director = new SpawnDirector(
        {
            ...DEFAULT_AREA_TUNING,
            minibossCellChance: 0,
            minibossCellsToCertain: Infinity,
            ...tuning,
        },
        fake
    );
    const spawnRegular = vi.mocked(fake.spawnRegular);
    const spawnMiniboss = vi.mocked(fake.spawnMiniboss);
    const regulars = () => spawnRegular.mock.results.map((r) => r.value as FakeEnemy);
    const minibosses = () => spawnMiniboss.mock.results.map((r) => r.value as FakeEnemy);
    return {
        director,
        host: fake,
        player,
        velocity,
        spawnRegular,
        spawnMiniboss,
        regulars,
        minibosses,
    };
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

    it("frees a slot for a new spawn when an enemy despawns", () => {
        const { director, player, spawnRegular } = makeDirector({
            liveCap: 1,
            despawnDelayMs: 10,
        });
        director.tick();

        player.x += 2000;
        director.update(10);
        director.tick();

        expect(spawnRegular).toHaveBeenCalledTimes(2);
    });
});

const CELL = DEFAULT_AREA_TUNING.explorationCellSize;

// Walks the player `cells` fresh cells east, one frame per cell. The first call
// also marks the start cell, which never counts.
function explore(
    director: SpawnDirector<FakeEnemy>,
    player: { x: number; y: number },
    cells: number
) {
    director.update(16);
    for (let i = 0; i < cells; i++) {
        player.x += CELL;
        director.update(16);
    }
}

describe("SpawnDirector miniboss exploration", () => {
    it("ships at 2% per new cell, certain on the 50th, 512 px cells", () => {
        expect(DEFAULT_AREA_TUNING.minibossCellChance).toBe(0.02);
        expect(DEFAULT_AREA_TUNING.minibossCellsToCertain).toBe(50);
        expect(DEFAULT_AREA_TUNING.explorationCellSize).toBe(512);
    });

    it("never rolls for a player standing still, however long", () => {
        const random = vi.fn(() => 0);
        const { director } = makeDirector({ minibossCellChance: 1, liveCap: 0 }, { random });

        for (let i = 0; i < 1000; i++) director.update(1000);

        expect(random).not.toHaveBeenCalled();
        expect(director.cellsExplored).toBe(0);
    });

    it("counts the start cell for nothing, and each new cell once", () => {
        const { director, player } = makeDirector({ liveCap: 0 });
        explore(director, player, 3);
        expect(director.cellsExplored).toBe(3);

        // Back over old ground, and pacing within a cell: nothing new.
        player.x -= 3 * CELL;
        director.update(16);
        player.x += CELL / 4;
        director.update(16);

        expect(director.cellsExplored).toBe(3);
    });

    it("rolls the per-cell chance against the host's random source on new ground", () => {
        const random = vi.fn(() => 0.019);
        const { director, player, host } = makeDirector(
            { minibossCellChance: 0.02, minibossCellsToCertain: 50, liveCap: 0 },
            { random }
        );

        explore(director, player, 1);

        expect(random).toHaveBeenCalledTimes(1);
        expect(host.pickMiniboss).toHaveBeenCalledTimes(1);
        expect(director.minibossActive).toBe(true);
    });

    it("misses when the roll is at or above the chance", () => {
        const { director, player, host } = makeDirector(
            { minibossCellChance: 0.02, liveCap: 0 },
            { random: () => 0.02 }
        );

        explore(director, player, 10);

        expect(host.pickMiniboss).not.toHaveBeenCalled();
        expect(director.minibossChance).toBe(0.02);
    });

    it("is certain on the Nth new cell since the last miniboss", () => {
        const { director, player, host } = makeDirector(
            { minibossCellChance: 0.02, minibossCellsToCertain: 5, liveCap: 0 },
            { random: () => 0.99 }
        );

        explore(director, player, 4);
        expect(host.pickMiniboss).not.toHaveBeenCalled();
        expect(director.minibossChance).toBe(1);

        explore(director, player, 1);
        expect(host.pickMiniboss).toHaveBeenCalledTimes(1);
    });
});

describe("SpawnDirector.minibossDebugView", () => {
    it("reports the odds, the count and the guarantee", () => {
        const { director, player } = makeDirector(
            {
                minibossCellChance: 0.02,
                minibossCellsToCertain: 50,
                liveCap: 0,
            },
            { random: () => 0.99 }
        );
        explore(director, player, 3);

        expect(director.minibossDebugView()).toEqual({
            active: false,
            chance: 0.02,
            cellsExplored: 3,
            cellsToCertain: 50,
        });
    });

    it("reports an active miniboss at no chance", () => {
        const { director, player } = makeDirector({ minibossCellChance: 1, liveCap: 0 });
        explore(director, player, 1);

        expect(director.minibossDebugView()).toMatchObject({ active: true, chance: 0 });
    });
});

describe("SpawnDirector miniboss", () => {
    // Certain on the first new cell; the odds themselves are covered above.
    const certain = { minibossCellChance: 1 };

    it("comes on the tick after it is rolled, in place of that tick's regular", () => {
        const { director, player, host, spawnRegular, spawnMiniboss } = makeDirector(certain);
        explore(director, player, 1);

        director.tick();

        expect(spawnMiniboss).toHaveBeenCalledTimes(1);
        expect(spawnMiniboss.mock.calls[0][0]).toBe("ghoul");
        expect(host.footprint).toHaveBeenLastCalledWith("ghoul", true);
        expect(spawnRegular).not.toHaveBeenCalled();
    });

    it("is one at a time: no roll while one is up, and regulars keep coming", () => {
        const { director, player, host, spawnRegular, spawnMiniboss } = makeDirector({
            ...certain,
            liveCap: 5,
        });
        explore(director, player, 1);
        director.tick();

        explore(director, player, 5);
        for (let i = 0; i < 10; i++) director.tick();

        expect(host.pickMiniboss).toHaveBeenCalledTimes(1);
        expect(spawnMiniboss).toHaveBeenCalledTimes(1);
        expect(spawnRegular).toHaveBeenCalledTimes(5);
        expect(director.minibossChance).toBe(0);
    });

    it("freezes the count while one is up; cells crossed then never count", () => {
        const { director, player, minibosses } = makeDirector({
            minibossCellChance: 0,
            minibossCellsToCertain: 3,
        });
        explore(director, player, 3);
        director.tick();
        expect(minibosses()).toHaveLength(1);

        explore(director, player, 4);
        director.onEnemyDead(minibosses()[0]);
        expect(director.cellsExplored).toBe(0);

        // Back over the cells crossed during the fight: already visited.
        player.x -= 4 * CELL;
        director.update(16);
        expect(director.cellsExplored).toBe(0);
    });

    it("restarts the count when killed, and clears nothing", () => {
        const { director, player, host, spawnRegular, spawnMiniboss, minibosses } = makeDirector({
            minibossCellChance: 0,
            minibossCellsToCertain: 2,
        });
        explore(director, player, 2);
        director.tick();
        expect(spawnMiniboss).toHaveBeenCalledTimes(1);

        director.onEnemyDead(minibosses()[0]);

        expect(director.minibossActive).toBe(false);
        expect(director.cellsExplored).toBe(0);
        expect(host.onAreaCleared).not.toHaveBeenCalled();
        // The area carries on: the next tick brings a regular, not another miniboss.
        director.tick();
        expect(spawnRegular).toHaveBeenCalledTimes(1);

        explore(director, player, 2);
        director.tick();
        expect(spawnMiniboss).toHaveBeenCalledTimes(2);
    });

    it("ignores the death of an enemy it did not spawn", () => {
        const { director, player } = makeDirector(certain);
        explore(director, player, 1);
        director.tick();

        director.onEnemyDead(new FakeEnemy(0, 0, "stray"));

        expect(director.minibossActive).toBe(true);
    });

    it("keeps counting when a regular dies", () => {
        const { director, player, regulars } = makeDirector({ liveCap: 1 });
        director.tick();
        explore(director, player, 2);

        director.onEnemyDead(regulars()[0]);

        expect(director.cellsExplored).toBe(2);
    });

    it("retries on later ticks when there is no room at first, still in place of regulars", () => {
        const isSpawnable = vi.fn(() => false);
        const { director, player, host, spawnRegular, spawnMiniboss } = makeDirector(certain, {
            isSpawnable,
        });
        explore(director, player, 1);
        director.tick();
        director.tick();
        expect(spawnMiniboss).not.toHaveBeenCalled();
        expect(spawnRegular).not.toHaveBeenCalled();

        isSpawnable.mockReturnValue(true);
        director.tick();

        expect(spawnMiniboss).toHaveBeenCalledTimes(1);
        // Picked once, on the roll; the retries reuse it.
        expect(host.pickMiniboss).toHaveBeenCalledTimes(1);
    });

    it("announces it every time it appears: first spawn, retry and respawn", () => {
        const isSpawnable = vi.fn(() => false);
        const { director, host, player, minibosses } = makeDirector(
            { ...certain, despawnDelayMs: 10 },
            { isSpawnable }
        );
        explore(director, player, 1);

        // First attempt finds no room: nothing to announce yet.
        director.tick();
        expect(host.onMinibossSpawned).not.toHaveBeenCalled();

        // The retry on the next tick lands it.
        isSpawnable.mockReturnValue(true);
        director.tick();
        expect(host.onMinibossSpawned).toHaveBeenCalledTimes(1);
        expect(host.onMinibossSpawned).toHaveBeenLastCalledWith(minibosses()[0]);

        // Left behind, despawned, and respawned ahead: announced again.
        player.x += 5000;
        director.update(10);
        director.tick();
        expect(host.onMinibossSpawned).toHaveBeenCalledTimes(2);
        expect(host.onMinibossSpawned).toHaveBeenLastCalledWith(minibosses()[1]);
    });

    it("respawns a despawned miniboss ahead as the same creature, only once", () => {
        const { director, host, player, spawnMiniboss, minibosses } = makeDirector({
            ...certain,
            despawnDelayMs: 10,
        });
        explore(director, player, 1);
        director.tick();

        player.x += 5000;
        director.update(10);
        expect(minibosses()[0].despawn).toHaveBeenCalledTimes(1);
        expect(director.minibossActive).toBe(true);

        director.tick();
        director.tick();

        expect(spawnMiniboss).toHaveBeenCalledTimes(2);
        expect(spawnMiniboss.mock.calls[1][0]).toBe("ghoul");
        expect(host.pickMiniboss).toHaveBeenCalledTimes(1);
    });

    it("ignores a stale death for a despawned miniboss's predecessor", () => {
        const { director, player, minibosses } = makeDirector({
            ...certain,
            despawnDelayMs: 10,
        });
        explore(director, player, 1);
        director.tick();
        player.x += 5000;
        director.update(10);
        director.tick();

        // The first miniboss is gone; a stale death event for it must not count.
        director.onEnemyDead(minibosses()[0]);
        expect(director.minibossActive).toBe(true);

        director.onEnemyDead(minibosses()[1]);
        expect(director.minibossActive).toBe(false);
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
    it("freezes spawning, despawning and exploring", () => {
        const { director, player, spawnRegular, spawnMiniboss, regulars } = makeDirector({
            despawnDelayMs: 10,
            minibossCellChance: 1,
        });
        director.tick();
        const enemy = regulars()[0];

        director.stop();
        explore(director, player, 3);
        director.tick();

        expect(spawnRegular).toHaveBeenCalledTimes(1);
        expect(spawnMiniboss).not.toHaveBeenCalled();
        expect(enemy.despawn).not.toHaveBeenCalled();
        expect(director.cellsExplored).toBe(0);
    });
});
