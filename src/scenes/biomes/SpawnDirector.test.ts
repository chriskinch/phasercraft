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
    // The miniboss ramp is off unless a test turns it on, so the regular-spawn
    // tests never meet a miniboss roll.
    const director = new SpawnDirector(
        {
            ...DEFAULT_AREA_TUNING,
            minibossBaseChance: 0,
            minibossRampMs: Infinity,
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

const MINUTE = 60 * 1000;

describe("SpawnDirector miniboss ramp", () => {
    const ramp = { minibossBaseChance: 0.01, minibossRampMs: 10 * MINUTE };

    it("starts at the base chance on entering the area", () => {
        const { director } = makeDirector(ramp);

        expect(director.minibossChance).toBeCloseTo(0.01);
    });

    it("rises linearly with time on the map", () => {
        const { director } = makeDirector(ramp);

        director.update(5 * MINUTE);

        expect(director.minibossChance).toBeCloseTo(0.01 + 0.99 / 2);
    });

    it("is certain once the ramp has run, and stays certain", () => {
        const { director } = makeDirector(ramp);

        director.update(10 * MINUTE);
        expect(director.minibossChance).toBe(1);

        director.update(10 * MINUTE);
        expect(director.minibossChance).toBe(1);
    });

    it("ships at 1% rising to certain over 10 minutes", () => {
        expect(DEFAULT_AREA_TUNING.minibossBaseChance).toBe(0.01);
        expect(DEFAULT_AREA_TUNING.minibossRampMs).toBe(10 * MINUTE);
    });

    it("rolls once per tick while no miniboss is active", () => {
        const random = vi.fn(() => 0.99);
        // No regulars, so every random() call is a roll.
        const { director } = makeDirector({ minibossBaseChance: 0.5, liveCap: 0 }, { random });

        for (let i = 0; i < 5; i++) director.tick();

        expect(random).toHaveBeenCalledTimes(5);
    });

    it("rolls against the host's random source", () => {
        const hit = makeDirector({ minibossBaseChance: 0.5 }, { random: () => 0.49 });
        const miss = makeDirector({ minibossBaseChance: 0.5 }, { random: () => 0.5 });

        hit.director.tick();
        miss.director.tick();

        expect(hit.spawnMiniboss).toHaveBeenCalledTimes(1);
        expect(miss.spawnMiniboss).not.toHaveBeenCalled();
    });
});

describe("SpawnDirector miniboss", () => {
    // Certain on the first tick; the ramp itself is covered above.
    const certain = { minibossBaseChance: 1 };

    it("comes on in place of the tick's regular, drawn from the host's pool", () => {
        const { director, host, spawnRegular, spawnMiniboss } = makeDirector(certain);

        director.tick();

        expect(host.pickMiniboss).toHaveBeenCalledTimes(1);
        expect(spawnMiniboss).toHaveBeenCalledTimes(1);
        expect(spawnMiniboss.mock.calls[0][0]).toBe("ghoul");
        expect(host.footprint).toHaveBeenLastCalledWith("ghoul", true);
        expect(spawnRegular).not.toHaveBeenCalled();
        expect(director.minibossActive).toBe(true);
    });

    it("is one at a time: no roll while one is up, and regulars keep coming", () => {
        const { director, spawnRegular, spawnMiniboss } = makeDirector({ ...certain, liveCap: 5 });
        director.tick();

        for (let i = 0; i < 10; i++) director.tick();

        expect(spawnMiniboss).toHaveBeenCalledTimes(1);
        expect(spawnRegular).toHaveBeenCalledTimes(5);
        expect(director.minibossChance).toBe(0);
    });

    it("freezes the ramp while one is up", () => {
        const { director, minibosses } = makeDirector(
            {
                minibossBaseChance: 0.5,
                minibossRampMs: 10 * MINUTE,
            },
            { random: () => 0 }
        );
        director.update(2 * MINUTE);
        director.tick();

        director.update(5 * MINUTE);
        director.onEnemyDead(minibosses()[0]);

        // Back to the base, not base + 7 minutes' worth.
        expect(director.minibossChance).toBeCloseTo(0.5);
        director.update(2 * MINUTE);
        expect(director.minibossChance).toBeCloseTo(0.5 + 0.5 * 0.2);
    });

    it("restarts the ramp from its base chance when killed, and clears nothing", () => {
        const { director, host, spawnRegular, spawnMiniboss, minibosses } = makeDirector({
            minibossBaseChance: 0,
            minibossRampMs: 10 * MINUTE,
        });
        director.update(10 * MINUTE);
        director.tick();
        expect(spawnMiniboss).toHaveBeenCalledTimes(1);

        director.onEnemyDead(minibosses()[0]);

        expect(director.minibossActive).toBe(false);
        expect(director.minibossChance).toBe(0);
        expect(host.onAreaCleared).not.toHaveBeenCalled();
        // The area carries on: the next tick brings a regular, not another miniboss.
        director.tick();
        expect(spawnRegular).toHaveBeenCalledTimes(1);
        expect(spawnMiniboss).toHaveBeenCalledTimes(1);
    });

    it("rolls again once the ramp has run after a kill", () => {
        const { director, spawnMiniboss, minibosses } = makeDirector({
            minibossBaseChance: 0,
            minibossRampMs: 10 * MINUTE,
        });
        director.update(10 * MINUTE);
        director.tick();
        director.onEnemyDead(minibosses()[0]);

        director.update(10 * MINUTE);
        director.tick();

        expect(spawnMiniboss).toHaveBeenCalledTimes(2);
    });

    it("ignores the death of an enemy it did not spawn", () => {
        const { director } = makeDirector(certain);
        director.tick();

        director.onEnemyDead(new FakeEnemy(0, 0, "stray"));

        expect(director.minibossActive).toBe(true);
    });

    it("leaves the ramp running when a regular dies", () => {
        const { director, regulars } = makeDirector({
            minibossBaseChance: 0,
            minibossRampMs: 10 * MINUTE,
        });
        director.tick();
        director.update(5 * MINUTE);

        director.onEnemyDead(regulars()[0]);

        expect(director.minibossChance).toBeCloseTo(0.5);
    });

    it("retries on later ticks when there is no room at first, still in place of regulars", () => {
        const isSpawnable = vi.fn(() => false);
        const { director, spawnRegular, spawnMiniboss } = makeDirector(certain, { isSpawnable });
        director.tick();
        director.tick();
        expect(spawnMiniboss).not.toHaveBeenCalled();
        expect(spawnRegular).not.toHaveBeenCalled();

        isSpawnable.mockReturnValue(true);
        director.tick();

        expect(spawnMiniboss).toHaveBeenCalledTimes(1);
        // Picked once, on the roll; the retries reuse it.
        expect(spawnMiniboss.mock.calls[0][0]).toBe("ghoul");
    });

    it("announces it every time it appears: first spawn, retry and respawn", () => {
        const isSpawnable = vi.fn(() => false);
        const { director, host, player, minibosses } = makeDirector(
            { ...certain, despawnDelayMs: 10 },
            { isSpawnable }
        );

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

    it("keeps the ramp frozen while a despawned miniboss waits to respawn", () => {
        const { director, player } = makeDirector(
            {
                minibossBaseChance: 1,
                minibossRampMs: 10 * MINUTE,
                despawnDelayMs: 10,
            },
            { isSpawnable: vi.fn().mockReturnValueOnce(true).mockReturnValue(false) }
        );
        director.tick();
        player.x += 5000;
        director.update(10);

        director.update(10 * MINUTE);

        expect(director.minibossActive).toBe(true);
        expect(director.minibossChance).toBe(0);
    });

    it("ignores a stale death for a despawned miniboss's predecessor", () => {
        const { director, player, minibosses } = makeDirector({
            ...certain,
            despawnDelayMs: 10,
        });
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
    it("freezes spawning, despawning and the miniboss ramp", () => {
        const { director, player, spawnRegular, spawnMiniboss, regulars } = makeDirector({
            despawnDelayMs: 10,
            minibossBaseChance: 0,
            minibossRampMs: 10 * MINUTE,
        });
        director.tick();
        const enemy = regulars()[0];

        director.stop();
        director.update(10 * MINUTE);
        director.tick();
        player.x += 2000;
        director.update(1000);

        expect(spawnRegular).toHaveBeenCalledTimes(1);
        expect(spawnMiniboss).not.toHaveBeenCalled();
        expect(enemy.despawn).not.toHaveBeenCalled();
        expect(director.minibossChance).toBe(0);
    });
});
