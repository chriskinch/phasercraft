import type { AreaTuning } from "@config/area";
import {
    isBeyondRadius,
    sampleSpawnPoint,
    spawnDirection,
    spawnRadius,
    type Point,
} from "@helpers/spawnGeometry";
import type { Rect } from "@helpers/walkability";

// Runs a combat area's population (#456): trickles enemies in off screen ahead
// of the player, despawns the ones left behind, counts kills towards the boss,
// and spawns (and if need be respawns) the boss. Pure logic — everything it
// needs from Phaser comes through a `SpawnHost`, so it is tested on fakes.

// What the director needs from a spawned enemy.
export interface SpawnedEnemy {
    x: number;
    y: number;
    // Silent removal: no loot, not a kill (see Enemy.despawn).
    despawn(): void;
}

export interface SpawnHost<E extends SpawnedEnemy, Id extends string = string> {
    playerPosition(): Point;
    playerVelocity(): Point;
    // Viewport size in screen px, and the camera zoom.
    view(): { width: number; height: number; zoom: number };
    // Whether every tile under this world rect is open, reachable land.
    isSpawnable(rect: Rect): boolean;
    // The body size a creature will have once spawned, in world px.
    footprint(id: Id, boss: boolean): { width: number; height: number };
    // Which creature to spawn next, drawn from the area's pool.
    pickRegular(): Id;
    pickBoss(): Id;
    spawnRegular(id: Id, at: Point): E;
    spawnBoss(id: Id, at: Point): E;
    // Kills left before the boss, and whether the boss has been triggered.
    onProgress(killsRemaining: number, bossActive: boolean): void;
    onAreaCleared(): void;
    random(): number;
}

interface Tracked {
    boss: boolean;
    width: number;
    height: number;
    // How long, in ms, the enemy has been continuously beyond the radius.
    beyond: number;
}

export default class SpawnDirector<E extends SpawnedEnemy, Id extends string = string> {
    private readonly tracked = new Map<E, Tracked>();
    private kills = 0;
    private boss_id: Id | null = null;
    private boss: E | null = null;
    private cleared = false;
    private stopped = false;

    constructor(
        private readonly tuning: AreaTuning,
        private readonly host: SpawnHost<E, Id>
    ) {}

    get killsRemaining(): number {
        return Math.max(this.tuning.killsToBoss - this.kills, 0);
    }

    get bossTriggered(): boolean {
        return this.boss_id !== null;
    }

    get regularsAlive(): number {
        let count = 0;
        this.tracked.forEach((t) => {
            if (!t.boss) count++;
        });
        return count;
    }

    // The distance enemies spawn at and despawn beyond, recomputed on demand
    // because the window can be resized mid-run.
    radius(): number {
        const { width, height, zoom } = this.host.view();
        return spawnRadius({
            viewWidth: width,
            viewHeight: height,
            zoom,
            margin: this.tuning.radiusMargin,
            override: this.tuning.radiusOverride,
        });
    }

    start(): void {
        this.host.onProgress(this.killsRemaining, false);
    }

    // Game over: nothing spawns, despawns or counts from here on.
    stop(): void {
        this.stopped = true;
    }

    /**
     * One pacing tick. Before the boss: one regular, if below the live cap.
     * After: the boss, if it is not already on the map (its first spawn found
     * no room, or it despawned). Never more than one spawn per tick.
     */
    tick(): void {
        if (this.stopped || this.cleared) return;

        if (this.boss_id !== null) {
            if (!this.boss) this.trySpawnBoss();
            return;
        }

        if (this.regularsAlive < this.tuning.liveCap) {
            const id = this.host.pickRegular();
            const at = this.findSpawnPoint(id, false);
            if (at) this.track(this.host.spawnRegular(id, at.point), false, at.size);
        }
    }

    /**
     * Advances every enemy's despawn clock by `delta` ms. The scene only calls
     * this from its update loop, so the clock stops whenever the scene is paused.
     */
    update(delta: number): void {
        if (this.stopped) return;

        const player = this.host.playerPosition();
        const radius = this.radius();
        const expired: E[] = [];

        this.tracked.forEach((t, enemy) => {
            t.beyond = isBeyondRadius(enemy, player, radius) ? t.beyond + delta : 0;
            if (t.beyond >= this.tuning.despawnDelayMs) expired.push(enemy);
        });

        expired.forEach((enemy) => {
            this.forget(enemy);
            enemy.despawn();
        });
    }

    /**
     * A tracked enemy died. Regulars count towards the boss until it triggers;
     * the boss's own death is the only thing that clears the area.
     */
    onEnemyDead(enemy: E): void {
        if (this.stopped || !this.tracked.has(enemy)) return;
        const was_boss = enemy === this.boss;
        this.forget(enemy);

        if (was_boss) {
            this.cleared = true;
            this.host.onAreaCleared();
            return;
        }

        if (this.boss_id !== null) return;

        this.kills++;
        if (this.kills >= this.tuning.killsToBoss) {
            this.boss_id = this.host.pickBoss();
            this.trySpawnBoss();
        }
        this.host.onProgress(this.killsRemaining, this.bossTriggered);
    }

    private trySpawnBoss(): void {
        if (this.boss_id === null) return;
        const at = this.findSpawnPoint(this.boss_id, true);
        if (!at) return;
        this.boss = this.host.spawnBoss(this.boss_id, at.point);
        this.track(this.boss, true, at.size);
    }

    /**
     * Up to `attemptsPerTick` points on the radius, in the cone ahead of the
     * player (or anywhere around a player standing still). A point is taken only
     * when the creature's whole footprint is on open, reachable land and clear
     * of every live enemy; otherwise the spawn waits for the next tick.
     */
    private findSpawnPoint(
        id: Id,
        boss: boolean
    ): { point: Point; size: { width: number; height: number } } | null {
        const player = this.host.playerPosition();
        const direction = spawnDirection(this.host.playerVelocity(), this.tuning.movingSpeed);
        const half_angle = (this.tuning.coneHalfAngleDeg * Math.PI) / 180;
        const radius = this.radius();
        const size = this.host.footprint(id, boss);

        for (let attempt = 0; attempt < this.tuning.attemptsPerTick; attempt++) {
            const point = sampleSpawnPoint(player, radius, direction, half_angle, () =>
                this.host.random()
            );
            const rect = {
                x: point.x - size.width / 2,
                y: point.y - size.height / 2,
                width: size.width,
                height: size.height,
            };
            if (this.host.isSpawnable(rect) && !this.overlapsLiveEnemy(rect)) {
                return { point, size };
            }
        }
        return null;
    }

    private overlapsLiveEnemy(rect: Rect): boolean {
        for (const [enemy, t] of this.tracked) {
            const left = enemy.x - t.width / 2;
            const top = enemy.y - t.height / 2;
            if (
                rect.x < left + t.width &&
                left < rect.x + rect.width &&
                rect.y < top + t.height &&
                top < rect.y + rect.height
            ) {
                return true;
            }
        }
        return false;
    }

    private track(enemy: E, boss: boolean, size: { width: number; height: number }): void {
        this.tracked.set(enemy, { boss, ...size, beyond: 0 });
    }

    private forget(enemy: E): void {
        this.tracked.delete(enemy);
        if (enemy === this.boss) this.boss = null;
    }
}
