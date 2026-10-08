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

// One creature per tick, placed exactly at the sampled centre.
const SINGLES: Partial<AreaTuning> = {
    configWeights: { group: 1, pair: 0, pack: 0 },
    groupSize: [1, 1],
    clusterBaseRadius: 0,
};

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
        difficultyAt: vi.fn(() => 1),
        // Far from the start unless a test says otherwise: no safe pocket.
        distanceFromStart: vi.fn(() => ({ distance: Infinity, fraction: 0 })),
        spawnRegular: vi.fn((id: string, at) => new FakeEnemy(at.x, at.y, id)),
        spawnMiniboss: vi.fn((id: string, at) => new FakeEnemy(at.x, at.y, `miniboss:${id}`)),
        onAreaCleared: vi.fn(),
        onMinibossSpawned: vi.fn(),
        random: seeded(),
        ...host,
    };
    // The miniboss is off unless a test turns it on, so the regular-spawn tests
    // never meet a miniboss roll. Configurations default to one lone creature
    // placed exactly on the radius; the cluster tests turn them on.
    const director = new SpawnDirector(
        {
            ...DEFAULT_AREA_TUNING,
            minibossChancePerCell: 0,
            ...SINGLES,
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

describe("SpawnDirector configurations", () => {
    const BASE = 48;

    it("ships 70/22/8 groups, pairs and packs, groups of 1-3, packs of 5-10, mixed 70%", () => {
        expect(DEFAULT_AREA_TUNING.configWeights).toEqual({ group: 70, pair: 22, pack: 8 });
        expect(DEFAULT_AREA_TUNING.groupSize).toEqual([1, 3]);
        expect(DEFAULT_AREA_TUNING.packSize).toEqual([5, 10]);
        expect(DEFAULT_AREA_TUNING.packMixedChance).toBe(0.7);
        expect(DEFAULT_AREA_TUNING.clusterBaseRadius).toBe(48);
    });

    it("ships a 25 live cap and one configuration every 3 s", () => {
        expect(DEFAULT_AREA_TUNING.liveCap).toBe(25);
        expect(DEFAULT_AREA_TUNING.spawnIntervalMs).toBe(3000);
    });

    it("spawns a whole configuration in one tick", () => {
        const { director, spawnRegular } = makeDirector({
            configWeights: { group: 0, pair: 0, pack: 1 },
            packSize: [6, 6],
            clusterBaseRadius: BASE,
            liveCap: 50,
        });

        director.tick();

        expect(spawnRegular).toHaveBeenCalledTimes(6);
    });

    it("may take the count past the live cap, but rolls nothing once it is reached", () => {
        const { director, spawnRegular } = makeDirector({
            configWeights: { group: 0, pair: 0, pack: 1 },
            packSize: [8, 8],
            clusterBaseRadius: BASE,
            liveCap: 5,
        });

        director.tick();
        director.tick();

        expect(spawnRegular).toHaveBeenCalledTimes(8);
        expect(director.regularsAlive).toBe(8);
    });

    it("draws a pair as two of one creature", () => {
        const pickRegular = vi.fn().mockReturnValueOnce("imp").mockReturnValue("ghoul");
        const { director, spawnRegular } = makeDirector(
            { configWeights: { group: 0, pair: 1, pack: 0 }, clusterBaseRadius: BASE },
            { pickRegular }
        );

        director.tick();

        expect(pickRegular).toHaveBeenCalledTimes(1);
        expect(spawnRegular.mock.calls.map((c) => c[0])).toEqual(["imp", "imp"]);
    });

    it("scatters every member in the cluster's disc, wholly beyond the spawn radius", () => {
        const { director, player, regulars } = makeDirector({
            configWeights: { group: 0, pair: 0, pack: 1 },
            packSize: [10, 10],
            clusterBaseRadius: BASE,
            liveCap: 100,
        });
        const spread = BASE * Math.sqrt(10);

        for (let i = 0; i < 5; i++) director.tick();

        expect(regulars().length).toBeGreaterThan(20);
        regulars().forEach((enemy) => {
            const d = distance(enemy, player);
            expect(d).toBeGreaterThanOrEqual(RADIUS - 1e-9);
            expect(d).toBeLessThanOrEqual(RADIUS + 2 * spread + 1e-9);
        });
    });

    it("keeps members of one configuration from overlapping each other", () => {
        const { director, regulars } = makeDirector({
            configWeights: { group: 0, pair: 0, pack: 1 },
            packSize: [10, 10],
            clusterBaseRadius: BASE,
            liveCap: 100,
        });

        director.tick();

        const members = regulars();
        members.forEach((a, i) =>
            members.slice(i + 1).forEach((b) => {
                const apart = Math.abs(a.x - b.x) >= 32 || Math.abs(a.y - b.y) >= 32;
                expect(apart).toBe(true);
            })
        );
    });

    it("spawns what fits when some members find no room, from the best centre", () => {
        // Every other footprint check fails: each member gets a spot within its tries.
        let n = 0;
        const isSpawnable = vi.fn(() => n++ % 2 === 1);
        const { director, spawnRegular } = makeDirector(
            {
                configWeights: { group: 0, pair: 0, pack: 1 },
                packSize: [5, 5],
                clusterBaseRadius: BASE,
                liveCap: 50,
            },
            { isSpawnable }
        );

        director.tick();

        expect(spawnRegular.mock.calls.length).toBeGreaterThan(0);
        expect(spawnRegular.mock.calls.length).toBeLessThanOrEqual(5);
    });

    it("spawns nothing, and tries every centre, when no member fits anywhere", () => {
        const { director, spawnRegular } = makeDirector(
            {
                configWeights: { group: 0, pair: 1, pack: 0 },
                clusterBaseRadius: BASE,
                attemptsPerTick: 5,
            },
            { isSpawnable: vi.fn(() => false) }
        );

        director.tick();

        expect(spawnRegular).not.toHaveBeenCalled();
        expect(director.debugView().attempts).toHaveLength(5);
    });

    it("despawns beyond the spawn radius plus the largest cluster's diameter", () => {
        const { director } = makeDirector({ clusterBaseRadius: BASE, packSize: [5, 9] });

        expect(director.despawnRadius()).toBeCloseTo(RADIUS + 2 * BASE * 3);
        expect(director.debugView().despawnRadius).toBeCloseTo(RADIUS + 2 * BASE * 3);
    });

    it("places every member of the largest pack within the despawn radius", () => {
        const { director, player, regulars } = makeDirector({
            configWeights: { group: 0, pair: 0, pack: 1 },
            packSize: [10, 10],
            clusterBaseRadius: BASE,
            liveCap: 1000,
            despawnDelayMs: 1,
        });

        for (let i = 0; i < 20; i++) director.tick();
        director.update(1000);

        expect(regulars().length).toBeGreaterThan(100);
        regulars().forEach((enemy) => {
            expect(distance(enemy, player)).toBeLessThanOrEqual(director.despawnRadius());
            expect(enemy.despawn).not.toHaveBeenCalled();
        });
    });
});

// Distances from a start point; the fraction is left at the start's 0.
const fromStart = (start: { x: number; y: number }) =>
    vi.fn((p: { x: number; y: number }) => ({ distance: distance(p, start), fraction: 0 }));

// Ticks `ticks` times; each configuration that spawned, by centre and head count.
function spawnedConfigs(d: ReturnType<typeof makeDirector>, ticks: number) {
    const configs: { centre: { x: number; y: number }; count: number }[] = [];
    for (let i = 0; i < ticks; i++) {
        const before = d.spawnRegular.mock.calls.length;
        d.director.tick();
        const count = d.spawnRegular.mock.calls.length - before;
        if (count > 0)
            configs.push({ centre: vi.mocked(d.host.difficultyAt).mock.lastCall![0], count });
    }
    return configs;
}

describe("SpawnDirector pack odds and safe pocket", () => {
    it("ships packs at 20 at the far edge and a 1500 px safe pocket", () => {
        expect(DEFAULT_AREA_TUNING.packWeightAtEdge).toBe(20);
        expect(DEFAULT_AREA_TUNING.safeStartRadius).toBe(1500);
    });

    it("reads the pack odds at a trial centre on the ring, ahead of a moving player", () => {
        const distanceFromStart = vi.fn((_p: { x: number; y: number }) => ({
            distance: Infinity,
            fraction: 1,
        }));
        const { director, player, velocity, spawnRegular } = makeDirector(
            {
                configWeights: { group: 1, pair: 0, pack: 0 },
                packWeightAtEdge: 1,
                packSize: [4, 4],
                clusterBaseRadius: 48,
                liveCap: 50,
            },
            { distanceFromStart }
        );
        velocity.x = 100;

        director.tick();

        const trial = distanceFromStart.mock.calls[0][0];
        expect(distance(trial, player)).toBeCloseTo(RADIUS);
        expect(Math.abs(offAngle(player, trial, velocity))).toBeLessThanOrEqual(Math.PI / 4);
        // At the far edge the whole group share has gone to packs.
        expect(spawnRegular).toHaveBeenCalledTimes(4);
    });

    it("still spawns packs outside the pocket for a player standing inside it", () => {
        // The player stands 200 px inside the pocket's edge; the ring reaches out of it.
        const start = { x: 5000 - 1300, y: 5000 };
        const d = makeDirector(
            {
                configWeights: { group: 0, pair: 0, pack: 1 },
                packSize: [5, 5],
                clusterBaseRadius: 48,
                liveCap: 1000,
            },
            { distanceFromStart: fromStart(start) }
        );

        // Groups here are lone creatures: anything bigger is a pack.
        const packs = spawnedConfigs(d, 40).filter((c) => c.count > 1);

        expect(packs.length).toBeGreaterThan(0);
        packs.forEach(({ centre }) => expect(distance(centre, start)).toBeGreaterThanOrEqual(1500));
    });

    it("rolls no packs while the trial centre is inside the pocket", () => {
        const { director, spawnRegular } = makeDirector(
            {
                configWeights: { group: 1, pair: 0, pack: 1000 },
                packSize: [6, 6],
                liveCap: 100,
            },
            { distanceFromStart: fromStart({ x: 5000, y: 5000 }) }
        );

        for (let i = 0; i < 10; i++) director.tick();

        expect(spawnRegular).toHaveBeenCalledTimes(10);
    });

    it("never centres a pack inside the pocket, though groups may be", () => {
        // The player stands just outside the pocket; the ring around them dips into it.
        const start = { x: 5000 - 1600, y: 5000 };
        const run = (configWeights: AreaTuning["configWeights"]) =>
            spawnedConfigs(
                makeDirector(
                    { configWeights, packSize: [3, 3], clusterBaseRadius: 48, liveCap: 1000 },
                    { distanceFromStart: fromStart(start) }
                ),
                40
            );

        // Groups here are lone creatures: anything bigger is a pack.
        const packs = run({ group: 0, pair: 0, pack: 1 }).filter((c) => c.count > 1);
        expect(packs.length).toBeGreaterThan(0);
        packs.forEach(({ centre }) => expect(distance(centre, start)).toBeGreaterThanOrEqual(1500));

        const groups = run({ group: 1, pair: 0, pack: 0 });
        expect(groups.some(({ centre }) => distance(centre, start) < 1500)).toBe(true);
    });

    it("never counts or rolls a cell centred inside the pocket", () => {
        const random = vi.fn(() => 0.5);
        const { director, player } = makeDirector(
            { minibossChancePerCell: 1, liveCap: 0 },
            { random, distanceFromStart: fromStart({ x: 5000, y: 5000 }) }
        );

        // Cells 10-12 east of the start cell are centred 376-1406 px out.
        explore(director, player, 3);
        expect(director.cellsExplored).toBe(0);
        expect(random).not.toHaveBeenCalled();
        expect(director.minibossActive).toBe(false);

        // Cell 13 is centred ~1912 px out: it counts, and a certain roll hits.
        explore(director, player, 1);
        expect(random).toHaveBeenCalledTimes(1);
        expect(director.minibossActive).toBe(true);
    });
});

describe("SpawnDirector difficulty", () => {
    it("gives every member of a configuration its centre's difficulty", () => {
        const difficultyAt = vi.fn(() => 2.5);
        const { director, spawnRegular } = makeDirector(
            {
                configWeights: { group: 0, pair: 0, pack: 1 },
                packSize: [5, 5],
                clusterBaseRadius: 48,
                liveCap: 50,
            },
            { difficultyAt }
        );

        director.tick();

        expect(difficultyAt).toHaveBeenCalledTimes(1);
        const centre = (difficultyAt.mock.calls[0] as unknown[])[0] as { x: number; y: number };
        expect(Math.hypot(centre.x - 5000, centre.y - 5000)).toBeCloseTo(
            RADIUS + 48 * Math.sqrt(5)
        );
        expect(spawnRegular).toHaveBeenCalledTimes(5);
        spawnRegular.mock.calls.forEach((call) => expect(call[2]).toBe(2.5));
    });

    it("asks nothing when nothing fits", () => {
        const difficultyAt = vi.fn(() => 2);
        const { director } = makeDirector({}, { difficultyAt, isSpawnable: vi.fn(() => false) });

        director.tick();

        expect(difficultyAt).not.toHaveBeenCalled();
    });

    it("rolls a miniboss's difficulty where it spawns, afresh on a respawn", () => {
        const difficultyAt = vi.fn().mockReturnValueOnce(3).mockReturnValue(4);
        const { director, player, spawnMiniboss } = makeDirector(
            { minibossChancePerCell: 1, despawnDelayMs: 10 },
            { difficultyAt }
        );
        director.update(16);
        player.x += DEFAULT_AREA_TUNING.explorationCellSize;
        director.update(16);
        director.tick();

        player.x += 5000;
        director.update(10);
        director.tick();

        expect(spawnMiniboss.mock.calls.map((c) => c[2])).toEqual([3, 4]);
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
    it("ships at 1% per new cell, 512 px cells", () => {
        expect(DEFAULT_AREA_TUNING.minibossChancePerCell).toBe(0.01);
        expect(DEFAULT_AREA_TUNING.explorationCellSize).toBe(512);
    });

    it("never rolls for a player standing still, however long", () => {
        const random = vi.fn(() => 0);
        const { director } = makeDirector({ minibossChancePerCell: 1, liveCap: 0 }, { random });

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

    it("rolls N% on the Nth new cell, against the host's random source", () => {
        const random = vi.fn(() => 0.025);
        const { director, player, host } = makeDirector(
            { minibossChancePerCell: 0.01, liveCap: 0 },
            { random }
        );

        // 1% and 2% miss a 0.025 roll; 3% hits it.
        explore(director, player, 2);
        expect(host.pickMiniboss).not.toHaveBeenCalled();
        expect(director.minibossChance).toBeCloseTo(0.03);

        explore(director, player, 1);
        expect(random).toHaveBeenCalledTimes(3);
        expect(host.pickMiniboss).toHaveBeenCalledTimes(1);
        expect(director.minibossActive).toBe(true);
    });

    it("climbs with exploring and caps at certain", () => {
        const { director, player } = makeDirector(
            { minibossChancePerCell: 0.01, liveCap: 0 },
            { random: () => 0.999 }
        );
        expect(director.minibossChance).toBeCloseTo(0.01);

        explore(director, player, 9);
        expect(director.minibossChance).toBeCloseTo(0.1);

        player.y += CELL;
        explore(director, player, 89);
        expect(director.cellsExplored).toBe(99);
        expect(director.minibossChance).toBe(1);
    });

    it("misses when the roll is at or above the chance", () => {
        const { director, player, host } = makeDirector(
            { minibossChancePerCell: 0.5, liveCap: 0 },
            { random: () => 0.5 }
        );

        explore(director, player, 1);

        expect(host.pickMiniboss).not.toHaveBeenCalled();
        expect(director.minibossChance).toBe(1);
    });

    it("resets the count when the miniboss is rolled, and holds it at 0 while it is up", () => {
        const { director, player, minibosses } = makeDirector(
            { minibossChancePerCell: 0.25 },
            { random: () => 0.99 }
        );
        explore(director, player, 4);
        expect(director.cellsExplored).toBe(0);
        director.tick();
        expect(minibosses()).toHaveLength(1);

        explore(director, player, 3);
        expect(director.cellsExplored).toBe(0);
        expect(director.minibossChance).toBe(0);
    });
});

describe("SpawnDirector.minibossDebugView", () => {
    it("reports the next cell's chance and the count", () => {
        const { director, player } = makeDirector(
            { minibossChancePerCell: 0.01, liveCap: 0 },
            { random: () => 0.99 }
        );
        explore(director, player, 3);

        expect(director.minibossDebugView()).toEqual({
            active: false,
            chance: 0.04,
            cellsExplored: 3,
        });
    });

    it("reports an active miniboss at no chance", () => {
        const { director, player } = makeDirector({ minibossChancePerCell: 1, liveCap: 0 });
        explore(director, player, 1);

        expect(director.minibossDebugView()).toMatchObject({ active: true, chance: 0 });
    });
});

describe("SpawnDirector miniboss", () => {
    // Certain on the first new cell; the odds themselves are covered above.
    const certain = { minibossChancePerCell: 1 };

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

    it("counts no cells while one is up; cells crossed then never count", () => {
        const { director, player, minibosses } = makeDirector(certain);
        explore(director, player, 1);
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

    it("lets exploring count again once killed, and clears nothing", () => {
        const { director, player, host, spawnRegular, spawnMiniboss, minibosses } = makeDirector(
            { minibossChancePerCell: 0.5 },
            { random: () => 0.99 }
        );
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
            minibossChancePerCell: 1,
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
