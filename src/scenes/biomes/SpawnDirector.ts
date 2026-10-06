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
// of the player, despawns the ones left behind, and rolls for the miniboss each
// time the player explores new ground (#594), respawning it if it despawns.
// Pure logic — everything it needs from Phaser comes through a `SpawnHost`, so
// it is tested on fakes.

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
    footprint(id: Id, miniboss: boolean): { width: number; height: number };
    // Which creature to spawn next, drawn from the area's pool.
    pickRegular(): Id;
    pickMiniboss(): Id;
    spawnRegular(id: Id, at: Point): E;
    spawnMiniboss(id: Id, at: Point): E;
    // Clears the area. Dormant: nothing calls it since the miniboss stopped
    // clearing areas (#594); the boss epic's boss death will.
    onAreaCleared(): void;
    // Every time the miniboss appears: its first spawn, and each respawn after a
    // despawn. The scene turns this into `miniboss:spawned` (see #465).
    onMinibossSpawned(miniboss: E): void;
    random(): number;
}

// What the spawn debug overlay (#464) draws. Read-only; built on demand.
export interface SpawnDebugView<E> {
    radius: number;
    // Unit vector of the player's travel, or null while standing still.
    direction: Point | null;
    halfAngle: number;
    despawnDelayMs: number;
    // Every enemy the director tracks, and how long it has been beyond the radius.
    enemies: { enemy: E; beyondMs: number }[];
    // The candidates tried on the most recent spawn attempt, and whether each fit.
    attempts: { point: Point; ok: boolean }[];
}

// What the miniboss debug readout shows. Read-only; built on demand.
export interface MinibossDebugView {
    // A miniboss has been rolled and is up (or waiting for room to respawn).
    active: boolean;
    // The chance the next new cell brings it on; 0 while active.
    chance: number;
    cellsExplored: number;
    cellsToCertain: number;
}

interface Tracked {
    miniboss: boolean;
    width: number;
    height: number;
    // How long, in ms, the enemy has been continuously beyond the radius.
    beyond: number;
}

export default class SpawnDirector<E extends SpawnedEnemy, Id extends string = string> {
    private readonly tracked = new Map<E, Tracked>();
    // The creature the current miniboss was promoted from, from the roll that
    // brought it on until it dies; a despawned miniboss keeps it, so it respawns.
    private miniboss_id: Id | null = null;
    private miniboss: E | null = null;
    // Exploration cells ("cx,cy") the player has stepped into this run. Each
    // counts once; the first one seen (the start) is marked without counting.
    private readonly visited = new Set<string>();
    // New cells counted towards the miniboss since the last one died: frozen
    // while a miniboss is up (or waiting to respawn), back to 0 when it dies.
    private cells_explored = 0;
    private stopped = false;
    private last_attempts: { point: Point; ok: boolean }[] = [];

    constructor(
        private readonly tuning: AreaTuning,
        private readonly host: SpawnHost<E, Id>
    ) {}

    get minibossActive(): boolean {
        return this.miniboss_id !== null;
    }

    get cellsExplored(): number {
        return this.cells_explored;
    }

    /**
     * The chance the next new cell brings on the miniboss: the flat per-cell
     * chance, or certain on the `minibossCellsToCertain`-th. 0 while a miniboss
     * is already active.
     */
    get minibossChance(): number {
        if (this.minibossActive) return 0;
        const { minibossCellChance, minibossCellsToCertain } = this.tuning;
        return this.cells_explored + 1 >= minibossCellsToCertain ? 1 : minibossCellChance;
    }

    get regularsAlive(): number {
        let count = 0;
        this.tracked.forEach((t) => {
            if (!t.miniboss) count++;
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

    debugView(): SpawnDebugView<E> {
        const enemies: { enemy: E; beyondMs: number }[] = [];
        this.tracked.forEach((t, enemy) => enemies.push({ enemy, beyondMs: t.beyond }));
        return {
            radius: this.radius(),
            direction: spawnDirection(this.host.playerVelocity(), this.tuning.movingSpeed),
            halfAngle: (this.tuning.coneHalfAngleDeg * Math.PI) / 180,
            despawnDelayMs: this.tuning.despawnDelayMs,
            enemies,
            attempts: [...this.last_attempts],
        };
    }

    minibossDebugView(): MinibossDebugView {
        return {
            active: this.minibossActive,
            chance: this.minibossChance,
            cellsExplored: this.cells_explored,
            cellsToCertain: this.tuning.minibossCellsToCertain,
        };
    }

    // Game over: nothing spawns, despawns or explores from here on.
    stop(): void {
        this.stopped = true;
    }

    /**
     * One pacing tick, never more than one spawn. A miniboss that has been
     * rolled but is not on the map (just rolled, its first spawn found no room,
     * or it despawned) takes the tick in place of a regular. Otherwise one
     * regular, if below the live cap.
     */
    tick(): void {
        if (this.stopped) return;

        if (this.minibossActive && !this.miniboss) {
            this.trySpawnMiniboss();
            return;
        }

        if (this.regularsAlive < this.tuning.liveCap) {
            const id = this.host.pickRegular();
            const at = this.findSpawnPoint(id, false);
            if (at) this.track(this.host.spawnRegular(id, at.point), false, at.size);
        }
    }

    /**
     * Notes the player's exploration cell (rolling for the miniboss on new
     * ground), and advances every enemy's despawn clock by `delta` ms. The
     * scene only calls this from its update loop, so the clocks stop whenever
     * the scene is paused.
     */
    update(delta: number): void {
        if (this.stopped) return;

        const player = this.host.playerPosition();
        this.explore(player);

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
     * A tracked enemy died. The miniboss's death restarts its exploration
     * count from 0; nothing clears the area (that waits on the boss epic).
     */
    onEnemyDead(enemy: E): void {
        if (this.stopped || !this.tracked.has(enemy)) return;
        const was_miniboss = enemy === this.miniboss;
        this.forget(enemy);

        if (was_miniboss) {
            this.miniboss_id = null;
            this.cells_explored = 0;
        }
    }

    /**
     * Marks the player's cell visited. The first time a cell is entered (the
     * start cell aside) with no miniboss active, it counts and rolls: a hit
     * picks the miniboss, which the next tick brings on. Cells crossed while a
     * miniboss is up are still marked, so they never count later.
     */
    private explore(player: Point): void {
        const size = this.tuning.explorationCellSize;
        const cell = `${Math.floor(player.x / size)},${Math.floor(player.y / size)}`;
        if (this.visited.has(cell)) return;
        const first = this.visited.size === 0;
        this.visited.add(cell);
        if (first || this.minibossActive) return;

        // Read before counting: the chance is for this, the next, cell.
        const chance = this.minibossChance;
        this.cells_explored++;
        // No roll at all at 0%, so tuning it off leaves the random sequence (and
        // every spawn point drawn from it) untouched.
        if (chance > 0 && this.host.random() < chance) {
            this.miniboss_id = this.host.pickMiniboss();
        }
    }

    private trySpawnMiniboss(): void {
        if (this.miniboss_id === null) return;
        const at = this.findSpawnPoint(this.miniboss_id, true);
        if (!at) return;
        this.miniboss = this.host.spawnMiniboss(this.miniboss_id, at.point);
        this.track(this.miniboss, true, at.size);
        this.host.onMinibossSpawned(this.miniboss);
    }

    /**
     * Up to `attemptsPerTick` points on the radius, in the cone ahead of the
     * player (or anywhere around a player standing still). A point is taken only
     * when the creature's whole footprint is on open, reachable land and clear
     * of every live enemy; otherwise the spawn waits for the next tick.
     */
    private findSpawnPoint(
        id: Id,
        miniboss: boolean
    ): { point: Point; size: { width: number; height: number } } | null {
        const player = this.host.playerPosition();
        const direction = spawnDirection(this.host.playerVelocity(), this.tuning.movingSpeed);
        const half_angle = (this.tuning.coneHalfAngleDeg * Math.PI) / 180;
        const radius = this.radius();
        const size = this.host.footprint(id, miniboss);
        this.last_attempts = [];

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
            const ok = this.host.isSpawnable(rect) && !this.overlapsLiveEnemy(rect);
            this.last_attempts.push({ point, ok });
            if (ok) return { point, size };
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

    private track(enemy: E, miniboss: boolean, size: { width: number; height: number }): void {
        this.tracked.set(enemy, { miniboss, ...size, beyond: 0 });
    }

    private forget(enemy: E): void {
        this.tracked.delete(enemy);
        if (enemy === this.miniboss) this.miniboss = null;
    }
}
