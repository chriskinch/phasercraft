import type { AreaTuning } from "@config/area";
import type { EnemyType } from "@/types/game";

export interface Point {
    x: number;
    y: number;
}

export interface Vector {
    x: number;
    y: number;
}

export interface Bounds {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export interface SpawnedEnemy extends Point {
    despawn(): void;
    active?: boolean;
    alive?: boolean;
}

export interface SpawnDirectorClock {
    addEvent(config: {
        delay: number;
        loop: boolean;
        callback: () => void;
        callbackScope?: unknown;
    }): { remove(dispatchCallback?: boolean): void };
}

export interface SpawnDirectorEvents {
    on(event: string, listener: (enemy: SpawnedEnemy) => void, context?: unknown): void;
    off(event: string, listener: (enemy: SpawnedEnemy) => void, context?: unknown): void;
}

interface SpawnDirectorOptions {
    tuning: AreaTuning;
    enemyPool: EnemyType[];
    clock: SpawnDirectorClock;
    events: SpawnDirectorEvents;
    random?: () => number;
    getPlayerPosition: () => Point;
    getPlayerVelocity: () => Vector;
    getSpawnBounds: () => Bounds;
    getSpawnRadius: () => number;
    getSpawnFootprint: (multiplier: number) => number;
    isFootprintSpawnable: (point: Point, footprint: number) => boolean;
    spawnRegular: (enemyId: EnemyType, point: Point) => SpawnedEnemy;
    spawnBoss: (enemyId: EnemyType, point: Point) => SpawnedEnemy;
    syncHud: (state: { kills: number; killsRemaining: number; bossActive: boolean }) => void;
    onBossSpawned: (boss: SpawnedEnemy) => void;
    onAreaCleared: () => void;
}

const TWO_PI = Math.PI * 2;
const MOVING_CONE_ARC = Math.PI / 2;

export function sampleSpawnPoint(
    {
        origin,
        velocity,
        radius,
        bounds,
    }: { origin: Point; velocity: Vector; radius: number; bounds: Bounds },
    random: () => number
): Point {
    const speed = Math.hypot(velocity.x, velocity.y);
    const angle =
        speed <= 0.001
            ? random() * TWO_PI
            : Math.atan2(velocity.y, velocity.x) + (random() - 0.5) * MOVING_CONE_ARC;

    return {
        x: clamp(origin.x + Math.cos(angle) * radius, bounds.left, bounds.right),
        y: clamp(origin.y + Math.sin(angle) * radius, bounds.top, bounds.bottom),
    };
}

export function isBeyondRadius(subject: Point, origin: Point, radius: number): boolean {
    return Math.hypot(subject.x - origin.x, subject.y - origin.y) > radius;
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export default class SpawnDirector {
    private readonly tuning: AreaTuning;
    private readonly enemyPool: EnemyType[];
    private readonly clock: SpawnDirectorClock;
    private readonly events: SpawnDirectorEvents;
    private readonly random: () => number;
    private readonly getPlayerPosition: () => Point;
    private readonly getPlayerVelocity: () => Vector;
    private readonly getSpawnBounds: () => Bounds;
    private readonly getSpawnRadius: () => number;
    private readonly getSpawnFootprint: (multiplier: number) => number;
    private readonly isFootprintSpawnable: (point: Point, footprint: number) => boolean;
    private readonly spawnRegular: (enemyId: EnemyType, point: Point) => SpawnedEnemy;
    private readonly spawnBoss: (enemyId: EnemyType, point: Point) => SpawnedEnemy;
    private readonly syncHudState: SpawnDirectorOptions["syncHud"];
    private readonly onBossSpawned: (boss: SpawnedEnemy) => void;
    private readonly onAreaCleared: () => void;

    private timer?: { remove(dispatchCallback?: boolean): void };
    private readonly regulars = new Set<SpawnedEnemy>();
    private readonly despawnClocks = new Map<SpawnedEnemy, number>();
    private boss?: SpawnedEnemy;
    private bossId?: EnemyType;
    private kills: number = 0;
    private bossTriggered: boolean = false;
    private areaCleared: boolean = false;

    constructor(options: SpawnDirectorOptions) {
        this.tuning = options.tuning;
        this.enemyPool = options.enemyPool;
        this.clock = options.clock;
        this.events = options.events;
        this.random = options.random ?? Math.random;
        this.getPlayerPosition = options.getPlayerPosition;
        this.getPlayerVelocity = options.getPlayerVelocity;
        this.getSpawnBounds = options.getSpawnBounds;
        this.getSpawnRadius = options.getSpawnRadius;
        this.getSpawnFootprint = options.getSpawnFootprint;
        this.isFootprintSpawnable = options.isFootprintSpawnable;
        this.spawnRegular = options.spawnRegular;
        this.spawnBoss = options.spawnBoss;
        this.syncHudState = options.syncHud;
        this.onBossSpawned = options.onBossSpawned;
        this.onAreaCleared = options.onAreaCleared;
    }

    start(): void {
        this.cleanup();
        this.kills = 0;
        this.bossTriggered = false;
        this.areaCleared = false;
        this.boss = undefined;
        this.bossId = undefined;
        this.regulars.clear();
        this.despawnClocks.clear();

        this.events.on("enemy:dead", this.handleEnemyDead, this);
        this.events.on("enemy:despawned", this.handleEnemyDespawned, this);
        this.timer = this.clock.addEvent({
            delay: this.tuning.spawnIntervalMs,
            loop: true,
            callback: () => this.tick(),
        });

        this.syncHud();
    }

    tick(): void {
        if (this.areaCleared) return;

        if (this.bossTriggered) {
            if (!this.boss) this.trySpawnBoss();
            return;
        }

        if (this.regulars.size >= this.tuning.liveCap) return;
        this.trySpawnRegular();
    }

    update(delta: number): void {
        if (delta <= 0) return;

        const origin = this.getPlayerPosition();
        const radius = this.getSpawnRadius();

        this.allLiveEnemies().forEach((enemy) => {
            if (enemy.active === false || enemy.alive === false) {
                this.despawnClocks.delete(enemy);
                return;
            }

            if (!isBeyondRadius(enemy, origin, radius)) {
                this.despawnClocks.delete(enemy);
                return;
            }

            const elapsed = (this.despawnClocks.get(enemy) ?? 0) + delta;
            if (elapsed >= this.tuning.despawnDelayMs) {
                this.despawnClocks.delete(enemy);
                enemy.despawn();
                return;
            }

            this.despawnClocks.set(enemy, elapsed);
        });
    }

    cleanup(): void {
        this.events.off("enemy:dead", this.handleEnemyDead, this);
        this.events.off("enemy:despawned", this.handleEnemyDespawned, this);

        if (this.timer) {
            this.timer.remove(false);
            this.timer = undefined;
        }
    }

    private trySpawnRegular(): void {
        const point = this.findSpawnPoint(1);
        if (!point) return;

        const enemyId = this.pickEnemy();
        const enemy = this.spawnRegular(enemyId, point);
        this.regulars.add(enemy);
    }

    private trySpawnBoss(): void {
        const point = this.findSpawnPoint(3);
        if (!point) return;

        const bossId = this.bossId ?? this.pickEnemy();
        this.bossId = bossId;
        this.boss = this.spawnBoss(bossId, point);
        this.syncHud();
        this.onBossSpawned(this.boss);
    }

    private findSpawnPoint(footprintMultiplier: number): Point | undefined {
        const radius = this.getSpawnRadius();
        const origin = this.getPlayerPosition();
        const velocity = this.getPlayerVelocity();
        const bounds = this.getSpawnBounds();
        const footprint = this.getSpawnFootprint(footprintMultiplier);

        for (let attempt = 0; attempt < this.tuning.spawnAttemptsPerTick; attempt++) {
            const point = sampleSpawnPoint({ origin, velocity, radius, bounds }, this.random);
            if (!this.isFootprintSpawnable(point, footprint)) continue;
            if (this.overlapsLiveEnemy(point, footprint)) continue;
            return point;
        }

        return undefined;
    }

    private overlapsLiveEnemy(point: Point, footprint: number): boolean {
        return this.allLiveEnemies().some((enemy) => {
            const otherFootprint =
                enemy === this.boss ? this.getSpawnFootprint(3) : this.getSpawnFootprint(1);
            return Math.hypot(enemy.x - point.x, enemy.y - point.y) < footprint + otherFootprint;
        });
    }

    private allLiveEnemies(): SpawnedEnemy[] {
        const enemies = Array.from(this.regulars);
        if (this.boss) enemies.push(this.boss);
        return enemies;
    }

    private pickEnemy(): EnemyType {
        const index = Math.floor(this.random() * this.enemyPool.length);
        return this.enemyPool[index] ?? this.enemyPool[0] ?? "baby-ghoul";
    }

    private handleEnemyDead = (enemy: SpawnedEnemy): void => {
        if (enemy === this.boss) {
            this.boss = undefined;
            this.despawnClocks.delete(enemy);
            this.areaCleared = true;
            this.syncHud();
            this.onAreaCleared();
            return;
        }

        if (!this.regulars.delete(enemy)) return;

        this.despawnClocks.delete(enemy);

        if (!this.bossTriggered) {
            this.kills = Math.min(this.kills + 1, this.tuning.killsToBoss);
            if (this.kills >= this.tuning.killsToBoss) {
                this.bossTriggered = true;
                this.bossId ??= this.pickEnemy();
            }
        }

        this.syncHud();
    };

    private handleEnemyDespawned = (enemy: SpawnedEnemy): void => {
        if (enemy === this.boss) {
            this.boss = undefined;
            this.despawnClocks.delete(enemy);
            this.syncHud();
            return;
        }

        if (!this.regulars.delete(enemy)) return;
        this.despawnClocks.delete(enemy);
        this.syncHud();
    };

    private syncHud(): void {
        this.syncHudState({
            kills: this.kills,
            killsRemaining: Math.max(this.tuning.killsToBoss - this.kills, 0),
            bossActive: Boolean(this.boss),
        });
    }
}
