import { describe, it, expect, vi } from "vitest";
import SpawnDirector, { sampleSpawnPoint, type SpawnedEnemy } from "./SpawnDirector";
import { DEFAULT_AREA_TUNING, type AreaTuning } from "@config/area";

interface FakeEvents {
    on: ReturnType<typeof vi.fn>;
    off: ReturnType<typeof vi.fn>;
    emit(event: string, enemy: SpawnedEnemy): void;
}

function makeEnemy(x: number, y: number): SpawnedEnemy {
    return { x, y, active: true, alive: true, despawn: vi.fn() };
}

function makeEvents(): FakeEvents {
    const listeners = new Map<string, Array<(enemy: SpawnedEnemy) => void>>();

    return {
        on: vi.fn((event: string, listener: (enemy: SpawnedEnemy) => void) => {
            listeners.set(event, [...(listeners.get(event) ?? []), listener]);
        }),
        off: vi.fn((event: string, listener: (enemy: SpawnedEnemy) => void) => {
            listeners.set(
                event,
                (listeners.get(event) ?? []).filter((registered) => registered !== listener)
            );
        }),
        emit(event: string, enemy: SpawnedEnemy) {
            (listeners.get(event) ?? []).forEach((listener) => listener(enemy));
        },
    };
}

function makeDirector({
    tuning = DEFAULT_AREA_TUNING,
    random = (() => {
        let i = 0;
        return () => ((i += 1) % 10) / 10;
    })(),
    isFootprintSpawnable = vi.fn(() => true),
} = {}) {
    let tick = () => undefined;
    const timer = { remove: vi.fn() };
    const clock = {
        addEvent: vi.fn(({ callback }: { callback: () => void }) => ((tick = callback), timer)),
    };
    const events = makeEvents();
    const syncHud = vi.fn();
    const onBossSpawned = vi.fn();
    const onAreaCleared = vi.fn();
    const spawnedRegulars: SpawnedEnemy[] = [];
    const spawnedBosses: SpawnedEnemy[] = [];

    const spawnRegular = vi.fn((_enemyId: string, point: { x: number; y: number }) => {
        const enemy = makeEnemy(point.x, point.y);
        spawnedRegulars.push(enemy);
        return enemy;
    });
    const spawnBoss = vi.fn((_enemyId: string, point: { x: number; y: number }) => {
        const boss = makeEnemy(point.x, point.y);
        spawnedBosses.push(boss);
        return boss;
    });

    const director = new SpawnDirector({
        tuning: tuning as AreaTuning,
        enemyPool: ["baby-ghoul", "ghoul"],
        clock,
        events,
        random,
        getPlayerPosition: () => ({ x: 100, y: 200 }),
        getPlayerVelocity: () => ({ x: 0, y: 0 }),
        getSpawnBounds: () => ({ left: 0, right: 1000, top: 0, bottom: 1000 }),
        getSpawnRadius: () => 300,
        getSpawnFootprint: (multiplier) => 10 * multiplier,
        isFootprintSpawnable,
        spawnRegular,
        spawnBoss,
        syncHud,
        onBossSpawned,
        onAreaCleared,
    });

    return {
        director,
        tick: () => tick(),
        events,
        timer,
        spawnRegular,
        spawnBoss,
        spawnedRegulars,
        spawnedBosses,
        syncHud,
        onBossSpawned,
        onAreaCleared,
        isFootprintSpawnable,
    };
}

describe("sampleSpawnPoint", () => {
    it("uses the full ring when the player is stationary", () => {
        const point = sampleSpawnPoint(
            {
                origin: { x: 50, y: 60 },
                velocity: { x: 0, y: 0 },
                radius: 300,
                bounds: { left: 0, right: 1000, top: 0, bottom: 1000 },
            },
            () => 0.25
        );

        expect(point.x).toBeCloseTo(50);
        expect(point.y).toBeCloseTo(360);
    });
});

describe("SpawnDirector", () => {
    it("respects the live cap", () => {
        const { director, tick, spawnRegular } = makeDirector();
        director.start();

        for (let i = 0; i < DEFAULT_AREA_TUNING.liveCap + 2; i++) tick();

        expect(spawnRegular).toHaveBeenCalledTimes(DEFAULT_AREA_TUNING.liveCap);
    });

    it("skips a tick when no valid spawn point exists", () => {
        const isFootprintSpawnable = vi.fn(() => false);
        const { director, tick, spawnRegular } = makeDirector({ isFootprintSpawnable });
        director.start();

        tick();

        expect(spawnRegular).not.toHaveBeenCalled();
        expect(isFootprintSpawnable).toHaveBeenCalledTimes(
            DEFAULT_AREA_TUNING.spawnAttemptsPerTick
        );
    });

    it("accrues and resets despawn clocks", () => {
        const { director, tick, spawnedRegulars } = makeDirector();
        director.start();
        tick();
        const enemy = spawnedRegulars[0];
        enemy.x = 500;
        enemy.y = 200;

        director.update(10000);
        director.update(9000);
        expect(enemy.despawn).not.toHaveBeenCalled();

        enemy.x = 150;
        director.update(2000);
        expect(enemy.despawn).not.toHaveBeenCalled();

        enemy.x = 500;
        director.update(20000);
        expect(enemy.despawn).toHaveBeenCalledTimes(1);
    });

    it("does not count despawns as kills", () => {
        const tuning: AreaTuning = { ...DEFAULT_AREA_TUNING, killsToBoss: 2 };
        const { director, tick, spawnedRegulars, events, syncHud } = makeDirector({ tuning });
        director.start();
        tick();

        events.emit("enemy:despawned", spawnedRegulars[0]);
        tick();

        expect(syncHud).toHaveBeenLastCalledWith({
            bossActive: false,
            kills: 0,
            killsRemaining: 2,
        });
    });

    it("triggers the boss at kill count and stops regular spawning", () => {
        const tuning: AreaTuning = { ...DEFAULT_AREA_TUNING, killsToBoss: 2 };
        const { director, tick, spawnedRegulars, events, spawnRegular, spawnBoss } = makeDirector({
            tuning,
        });
        director.start();

        tick();
        events.emit("enemy:dead", spawnedRegulars[0]);
        tick();
        events.emit("enemy:dead", spawnedRegulars[1]);
        tick();
        tick();

        expect(spawnRegular).toHaveBeenCalledTimes(2);
        expect(spawnBoss).toHaveBeenCalledTimes(1);
    });

    it("does not clear the area when a regular dies after the boss has spawned", () => {
        const tuning: AreaTuning = { ...DEFAULT_AREA_TUNING, killsToBoss: 1, liveCap: 2 };
        const { director, tick, spawnedRegulars, spawnedBosses, events, onAreaCleared } =
            makeDirector({
                tuning,
            });
        director.start();

        tick();
        tick();
        events.emit("enemy:dead", spawnedRegulars[0]);
        tick();
        events.emit("enemy:dead", spawnedRegulars[1]);

        expect(spawnedBosses).toHaveLength(1);
        expect(onAreaCleared).not.toHaveBeenCalled();
    });

    it("respawns the boss after a despawn using the same creature id", () => {
        const tuning: AreaTuning = { ...DEFAULT_AREA_TUNING, killsToBoss: 1 };
        const { director, tick, spawnedRegulars, spawnedBosses, events, spawnBoss, onBossSpawned } =
            makeDirector({ tuning });
        director.start();

        tick();
        events.emit("enemy:dead", spawnedRegulars[0]);
        tick();
        const firstBoss = spawnedBosses[0];

        events.emit("enemy:despawned", firstBoss);
        tick();

        expect(spawnBoss).toHaveBeenCalledTimes(2);
        expect(spawnBoss.mock.calls[0][0]).toBe(spawnBoss.mock.calls[1][0]);
        expect(spawnedBosses[1]).not.toBe(firstBoss);
        expect(onBossSpawned).toHaveBeenCalledTimes(2);
    });

    it("updates HUD values for kills remaining and boss activity", () => {
        const tuning: AreaTuning = { ...DEFAULT_AREA_TUNING, killsToBoss: 2 };
        const { director, tick, spawnedRegulars, events, syncHud } = makeDirector({ tuning });
        director.start();

        expect(syncHud).toHaveBeenLastCalledWith({
            bossActive: false,
            kills: 0,
            killsRemaining: 2,
        });

        tick();
        events.emit("enemy:dead", spawnedRegulars[0]);
        expect(syncHud).toHaveBeenLastCalledWith({
            bossActive: false,
            kills: 1,
            killsRemaining: 1,
        });

        tick();
        events.emit("enemy:dead", spawnedRegulars[1]);
        expect(syncHud).toHaveBeenLastCalledWith({
            bossActive: false,
            kills: 2,
            killsRemaining: 0,
        });

        tick();
        expect(syncHud).toHaveBeenLastCalledWith({ bossActive: true, kills: 2, killsRemaining: 0 });
    });

    it("releases its timer and listeners during cleanup", () => {
        const { director, events, timer } = makeDirector();
        director.start();

        director.cleanup();

        expect(timer.remove).toHaveBeenCalledWith(false);
        expect(events.off).toHaveBeenCalledWith("enemy:dead", expect.any(Function), director);
        expect(events.off).toHaveBeenCalledWith("enemy:despawned", expect.any(Function), director);
    });
});
