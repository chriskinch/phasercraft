import { CLUSTER_MEMBER_ATTEMPTS, type AreaTuning } from "@config/area";
import { clusterRadius, configWeightsAt, rollConfig, sampleInDisc } from "@helpers/spawnConfig";
import {
    isBeyondRadius,
    sampleSpawnPoint,
    spawnDirection,
    spawnRadius,
    type Point,
} from "@helpers/spawnGeometry";
import type { Rect } from "@helpers/walkability";

// Runs a combat area's population (#456): trickles enemies in off screen ahead
// of the player in clustered configurations (#595), despawns the ones left behind, and rolls for the miniboss each
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
    // Where the player entered the area: the centre of the safe start pocket.
    playerStart(): Point;
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
    // The difficulty multiplier (#596) for a spawn at this point.
    difficultyAt(point: Point): number;
    // How far this point is from the player's start: in world px, and as the
    // 0-1 fraction of the furthest spawnable distance (#596) that pack odds
    // and the safe start pocket read (#599).
    distanceFromStart(point: Point): { distance: number; fraction: number };
    // Every member of a configuration shares its centre's difficulty.
    spawnRegular(id: Id, at: Point, difficulty: number): E;
    spawnMiniboss(id: Id, at: Point, difficulty: number): E;
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
    // Beyond this, an enemy's despawn clock runs (radius + the largest cluster's diameter).
    despawnRadius: number;
    // Unit vector of the player's travel, or null while standing still.
    direction: Point | null;
    halfAngle: number;
    despawnDelayMs: number;
    // Every enemy the director tracks, how long it has been beyond the radius,
    // and the difficulty multiplier it spawned at (#596).
    enemies: { enemy: E; beyondMs: number; difficulty: number }[];
    // The centres tried on the most recent spawn, and whether any member fit there.
    attempts: { point: Point; ok: boolean }[];
    // The most recent configurations spawned (#595): centre and cluster radius.
    clusters: { centre: Point; radius: number }[];
    // Exploration cells (#594) visited this run, by top-left corner.
    exploration: { cellSize: number; cells: Point[] };
    // The safe start pocket (#599).
    safePocket: { centre: Point; radius: number };
}

// How many recent configurations the debug view keeps.
export const DEBUG_CLUSTER_HISTORY = 8;

// What the miniboss debug readout shows. Read-only; built on demand.
export interface MinibossDebugView {
    // A miniboss has been rolled and is up (or waiting for room to respawn).
    active: boolean;
    // The chance the next new cell brings it on; 0 while active.
    chance: number;
    cellsExplored: number;
}

interface Tracked {
    miniboss: boolean;
    difficulty: number;
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
    // New cells counted towards the miniboss since the last one was rolled:
    // reset to 0 on the roll, and held there while it is up (or waiting to
    // respawn).
    private cells_explored = 0;
    private stopped = false;
    private last_attempts: { point: Point; ok: boolean }[] = [];
    private recent_clusters: { centre: Point; radius: number }[] = [];

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
     * The chance the next new cell brings on the miniboss: `minibossChancePerCell`
     * for every cell counted since the last one, that cell included, capped at
     * certain. 0 while a miniboss is already active.
     */
    get minibossChance(): number {
        if (this.minibossActive) return 0;
        return Math.min(this.tuning.minibossChancePerCell * (this.cells_explored + 1), 1);
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

    /**
     * The spawn radius plus the diameter of the largest possible cluster: its
     * centre sits a cluster radius beyond the spawn radius and members scatter
     * up to another radius out, so no member starts out despawning.
     */
    despawnRadius(): number {
        const { clusterBaseRadius, packSize } = this.tuning;
        return this.radius() + 2 * clusterRadius(Math.max(...packSize), clusterBaseRadius);
    }

    debugView(): SpawnDebugView<E> {
        const enemies: SpawnDebugView<E>["enemies"] = [];
        this.tracked.forEach((t, enemy) =>
            enemies.push({ enemy, beyondMs: t.beyond, difficulty: t.difficulty })
        );
        const size = this.tuning.explorationCellSize;
        const cells = [...this.visited].map((key) => {
            const [cx, cy] = key.split(",").map(Number);
            return { x: cx * size, y: cy * size };
        });
        return {
            radius: this.radius(),
            despawnRadius: this.despawnRadius(),
            direction: spawnDirection(this.host.playerVelocity(), this.tuning.movingSpeed),
            halfAngle: (this.tuning.coneHalfAngleDeg * Math.PI) / 180,
            despawnDelayMs: this.tuning.despawnDelayMs,
            enemies,
            attempts: [...this.last_attempts],
            clusters: [...this.recent_clusters],
            exploration: { cellSize: size, cells },
            safePocket: { centre: this.host.playerStart(), radius: this.tuning.safeStartRadius },
        };
    }

    minibossDebugView(): MinibossDebugView {
        return {
            active: this.minibossActive,
            chance: this.minibossChance,
            cellsExplored: this.cells_explored,
        };
    }

    // Game over: nothing spawns, despawns or explores from here on.
    stop(): void {
        this.stopped = true;
    }

    /**
     * One pacing tick. A miniboss that has been rolled but is not on the map
     * (just rolled, its first spawn found no room, or it despawned) takes the
     * tick. Otherwise, below the live cap, one configuration of regulars.
     */
    tick(): void {
        if (this.stopped) return;

        if (this.minibossActive && !this.miniboss) {
            this.trySpawnMiniboss();
            return;
        }

        if (this.regularsAlive < this.tuning.liveCap) this.spawnConfiguration();
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

        const radius = this.despawnRadius();
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
     * A tracked enemy died. The miniboss's death lets exploring count again;
     * nothing clears the area (that waits on the boss epic).
     */
    onEnemyDead(enemy: E): void {
        if (this.stopped || !this.tracked.has(enemy)) return;
        const was_miniboss = enemy === this.miniboss;
        this.forget(enemy);

        if (was_miniboss) this.miniboss_id = null;
    }

    /**
     * Marks the player's cell visited. The first time a cell is entered (the
     * start cell, and any cell centred inside the safe start pocket, aside)
     * with no miniboss active, it counts and rolls: a hit
     * picks the miniboss, which the next tick brings on, and resets the count.
     * Cells crossed while a miniboss is up are still marked, so they never
     * count later.
     */
    private explore(player: Point): void {
        const size = this.tuning.explorationCellSize;
        const cx = Math.floor(player.x / size);
        const cy = Math.floor(player.y / size);
        const cell = `${cx},${cy}`;
        if (this.visited.has(cell)) return;
        const first = this.visited.size === 0;
        this.visited.add(cell);
        if (first || this.minibossActive) return;
        if (this.inSafePocket({ x: (cx + 0.5) * size, y: (cy + 0.5) * size })) return;

        // Read before counting: the chance is for this, the next, cell.
        const chance = this.minibossChance;
        this.cells_explored++;
        // No roll at all at 0%, so tuning it off leaves the random sequence (and
        // every spawn point drawn from it) untouched.
        if (chance > 0 && this.host.random() < chance) {
            this.miniboss_id = this.host.pickMiniboss();
            this.cells_explored = 0;
        }
    }

    /**
     * Rolls the next configuration and spawns as many of its members as fit.
     * The kind is rolled before a centre exists (the centre's distance depends
     * on the head count), so the pack odds and the safe pocket (#599) are read
     * at a trial centre sampled on the spawn ring the same way the real ones
     * are. A pack whose real centre lands in the pocket is still turned away
     * by `placeCluster`.
     */
    private spawnConfiguration(): void {
        const random = () => this.host.random();
        const trial = sampleSpawnPoint(
            this.host.playerPosition(),
            this.radius(),
            spawnDirection(this.host.playerVelocity(), this.tuning.movingSpeed),
            (this.tuning.coneHalfAngleDeg * Math.PI) / 180,
            random
        );
        const { distance, fraction } = this.host.distanceFromStart(trial);
        const configWeights = configWeightsAt(
            this.tuning.configWeights,
            this.tuning.packWeightAtEdge,
            fraction,
            distance < this.tuning.safeStartRadius
        );
        const { kind, ids } = rollConfig(
            { ...this.tuning, configWeights },
            () => this.host.pickRegular(),
            random
        );
        const { centre, members } = this.placeCluster(ids, kind === "pack");
        if (!centre || members.length === 0) return;
        const difficulty = this.host.difficultyAt(centre);
        for (const { id, point, size } of members) {
            this.track(this.host.spawnRegular(id, point, difficulty), false, size, difficulty);
        }
        const radius = clusterRadius(ids.length, this.tuning.clusterBaseRadius);
        this.recent_clusters = [...this.recent_clusters, { centre, radius }].slice(
            -DEBUG_CLUSTER_HISTORY
        );
    }

    /**
     * Up to `attemptsPerTick` centres, each far enough out (spawn radius +
     * cluster radius) that the whole cluster is off screen, in the cone ahead
     * of the player (or anywhere around a player standing still). Members
     * scatter in the cluster's disc around a centre; each one needs its whole
     * footprint on open, reachable land, clear of live enemies and of the
     * members already placed, within `CLUSTER_MEMBER_ATTEMPTS` tries. The
     * centre that fits the most members wins (stopping early once all fit);
     * the rest of the configuration is dropped. Nothing fits: nothing spawns.
     * A pack's centre may not lie inside the safe start pocket (#599).
     */
    private placeCluster(
        ids: Id[],
        outsidePocket: boolean
    ): {
        centre: Point | null;
        members: { id: Id; point: Point; size: Size }[];
    } {
        const random = () => this.host.random();
        const player = this.host.playerPosition();
        const direction = spawnDirection(this.host.playerVelocity(), this.tuning.movingSpeed);
        const half_angle = (this.tuning.coneHalfAngleDeg * Math.PI) / 180;
        const spread = clusterRadius(ids.length, this.tuning.clusterBaseRadius);
        const ring = this.radius() + spread;
        // No spread, no point trying a member twice at the same spot.
        const tries = spread > 0 ? CLUSTER_MEMBER_ATTEMPTS : 1;
        const sizes = ids.map((id) => this.host.footprint(id, false));
        let best: { id: Id; point: Point; size: Size }[] = [];
        let best_centre: Point | null = null;
        this.last_attempts = [];

        for (let attempt = 0; attempt < this.tuning.attemptsPerTick; attempt++) {
            const centre = sampleSpawnPoint(player, ring, direction, half_angle, random);
            if (outsidePocket && this.inSafePocket(centre)) {
                this.last_attempts.push({ point: centre, ok: false });
                continue;
            }
            const placed: { id: Id; point: Point; size: Size; rect: Rect }[] = [];

            ids.forEach((id, i) => {
                const size = sizes[i];
                for (let t = 0; t < tries; t++) {
                    const point = spread > 0 ? sampleInDisc(centre, spread, random) : centre;
                    const rect = footprintRect(point, size);
                    const clear =
                        this.host.isSpawnable(rect) &&
                        !this.overlapsLiveEnemy(rect) &&
                        !placed.some((p) => overlaps(rect, p.rect));
                    if (clear) {
                        placed.push({ id, point, size, rect });
                        return;
                    }
                }
            });

            this.last_attempts.push({ point: centre, ok: placed.length > 0 });
            if (placed.length > best.length) {
                best = placed;
                best_centre = centre;
            }
            if (best.length === ids.length) break;
        }
        return {
            centre: best_centre,
            members: best.map(({ id, point, size }) => ({ id, point, size })),
        };
    }

    private trySpawnMiniboss(): void {
        if (this.miniboss_id === null) return;
        const at = this.findSpawnPoint(this.miniboss_id, true);
        if (!at) return;
        const difficulty = this.host.difficultyAt(at.point);
        this.miniboss = this.host.spawnMiniboss(this.miniboss_id, at.point, difficulty);
        this.track(this.miniboss, true, at.size, difficulty);
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
            const rect = footprintRect(point, size);
            const ok = this.host.isSpawnable(rect) && !this.overlapsLiveEnemy(rect);
            this.last_attempts.push({ point, ok });
            if (ok) return { point, size };
        }
        return null;
    }

    private inSafePocket(point: Point): boolean {
        return this.host.distanceFromStart(point).distance < this.tuning.safeStartRadius;
    }

    private overlapsLiveEnemy(rect: Rect): boolean {
        for (const [enemy, t] of this.tracked) {
            if (overlaps(rect, footprintRect(enemy, t))) return true;
        }
        return false;
    }

    private track(
        enemy: E,
        miniboss: boolean,
        size: { width: number; height: number },
        difficulty: number
    ): void {
        this.tracked.set(enemy, { miniboss, difficulty, ...size, beyond: 0 });
    }

    private forget(enemy: E): void {
        this.tracked.delete(enemy);
        if (enemy === this.miniboss) this.miniboss = null;
    }
}

type Size = { width: number; height: number };

// A creature's body, centred on `point`.
function footprintRect(point: Point, size: Size): Rect {
    return {
        x: point.x - size.width / 2,
        y: point.y - size.height / 2,
        width: size.width,
        height: size.height,
    };
}

function overlaps(a: Rect, b: Rect): boolean {
    return (
        a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height
    );
}
