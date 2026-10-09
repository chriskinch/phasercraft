import type { GameObjects, Scene } from "phaser";
import { FONTS, pixelFontSize } from "@config/fonts";
import type { Point } from "@helpers/spawnGeometry";
import type { SpawnDebugView } from "./SpawnDirector";

// Draws what the spawn director is doing (#464): the spawn radius, the (faint)
// despawn radius beyond it, the cone enemies spawn in, the last spawn's centres, and a despawn
// countdown over every enemy whose clock is running. Also (#600) the recent
// configurations' cluster circles, each enemy's difficulty multiplier under its
// feet, the exploration cells visited and the safe start pocket. Only built when
// Debug mode and its spawn overlay toggle are both on, so it costs nothing otherwise.

// What the overlay needs from an enemy: where to put its countdown.
export interface OverlayEnemy {
    x: number;
    y: number;
    height: number;
}

// Where it reads the director's state from, each frame.
export interface SpawnDebugSource<E extends OverlayEnemy> {
    debugView(): SpawnDebugView<E>;
}

const RADIUS_COLOUR = 0x00e5ff;
const CONE_COLOUR = 0xffe600;
const ACCEPTED_COLOUR = 0x00ff66;
const REJECTED_COLOUR = 0xff3355;
const CLUSTER_COLOUR = 0xff66ff;
const CELL_COLOUR = 0xffffff;
const POCKET_COLOUR = 0x66ff99;
const MARK_SIZE = 6;
// Above every character (their depth is their y, at most the map height).
const DEPTH = 10000;

/** The two cone edges, as points on the radius either side of `direction`. */
export function coneEdges(
    origin: Point,
    direction: Point,
    halfAngle: number,
    radius: number
): [Point, Point] {
    const centre = Math.atan2(direction.y, direction.x);
    const edge = (angle: number) => ({
        x: origin.x + Math.cos(angle) * radius,
        y: origin.y + Math.sin(angle) * radius,
    });
    return [edge(centre - halfAngle), edge(centre + halfAngle)];
}

/** An enemy's difficulty multiplier, e.g. "x1.85". */
export function multiplierLabel(difficulty: number): string {
    return `x${difficulty.toFixed(2)}`;
}

/** Seconds left before despawning, one decimal; null while the clock is idle. */
export function countdownLabel(beyondMs: number, delayMs: number): string | null {
    if (beyondMs <= 0) return null;
    return `${(Math.max(delayMs - beyondMs, 0) / 1000).toFixed(1)}s`;
}

export default class SpawnDebugOverlay<E extends OverlayEnemy> {
    private graphics: GameObjects.Graphics | null;
    private readonly labels = new Map<E, GameObjects.BitmapText>();
    private readonly multipliers = new Map<E, GameObjects.BitmapText>();

    constructor(
        private readonly scene: Scene,
        private readonly source: SpawnDebugSource<E>
    ) {
        this.graphics = scene.add.graphics().setDepth(DEPTH);
    }

    /** Redraws everything around `player`. Called once a frame by the scene. */
    draw(player: Point): void {
        const graphics = this.graphics;
        if (!graphics) return;
        const view = this.source.debugView();

        graphics.clear();

        // Visited exploration cells, faintly, under everything else.
        const { cellSize, cells } = view.exploration;
        graphics.fillStyle(CELL_COLOUR, 0.06);
        graphics.lineStyle(1, CELL_COLOUR, 0.15);
        for (const cell of cells) {
            graphics.fillRect(cell.x, cell.y, cellSize, cellSize);
            graphics.strokeRect(cell.x, cell.y, cellSize, cellSize);
        }

        graphics.lineStyle(2, POCKET_COLOUR, 0.6);
        graphics.strokeCircle(
            view.safePocket.centre.x,
            view.safePocket.centre.y,
            view.safePocket.radius
        );

        graphics.lineStyle(2, CLUSTER_COLOUR, 0.8);
        for (const { centre, radius } of view.clusters) {
            graphics.strokeCircle(centre.x, centre.y, radius);
        }

        // The radius: thicker while standing still, when the whole ring is live.
        graphics.lineStyle(view.direction ? 2 : 4, RADIUS_COLOUR, 0.8);
        graphics.strokeCircle(player.x, player.y, view.radius);
        graphics.lineStyle(1, RADIUS_COLOUR, 0.4);
        graphics.strokeCircle(player.x, player.y, view.despawnRadius);

        if (view.direction) {
            const [a, b] = coneEdges(player, view.direction, view.halfAngle, view.radius);
            const centre = Math.atan2(view.direction.y, view.direction.x);
            graphics.lineStyle(3, CONE_COLOUR, 0.9);
            graphics.lineBetween(player.x, player.y, a.x, a.y);
            graphics.lineBetween(player.x, player.y, b.x, b.y);
            graphics.beginPath();
            graphics.arc(
                player.x,
                player.y,
                view.radius,
                centre - view.halfAngle,
                centre + view.halfAngle
            );
            graphics.strokePath();
        }

        for (const { point, ok } of view.attempts) {
            graphics.lineStyle(2, ok ? ACCEPTED_COLOUR : REJECTED_COLOUR, 1);
            graphics.lineBetween(
                point.x - MARK_SIZE,
                point.y - MARK_SIZE,
                point.x + MARK_SIZE,
                point.y + MARK_SIZE
            );
            graphics.lineBetween(
                point.x - MARK_SIZE,
                point.y + MARK_SIZE,
                point.x + MARK_SIZE,
                point.y - MARK_SIZE
            );
        }

        this.drawCountdowns(view);
        this.drawMultipliers(view);
    }

    // One multiplier label under each tracked enemy's feet; untracked enemies'
    // labels are destroyed.
    private drawMultipliers(view: SpawnDebugView<E>): void {
        const live = new Set<E>();

        for (const { enemy, difficulty } of view.enemies) {
            live.add(enemy);
            let label = this.multipliers.get(enemy);
            if (!label) {
                label = this.scene.add
                    .bitmapText(0, 0, FONTS.outline, "", pixelFontSize(1))
                    .setTint(CLUSTER_COLOUR)
                    .setOrigin(0.5, 0)
                    .setDepth(DEPTH);
                this.multipliers.set(enemy, label);
            }
            label.setText(multiplierLabel(difficulty)).setPosition(enemy.x, enemy.y);
        }

        this.multipliers.forEach((label, enemy) => {
            if (live.has(enemy)) return;
            label.destroy();
            this.multipliers.delete(enemy);
        });
    }

    // One label per enemy with a running clock; enemies no longer tracked
    // (dead or despawned) have theirs destroyed.
    private drawCountdowns(view: SpawnDebugView<E>): void {
        const live = new Set<E>();

        for (const { enemy, beyondMs } of view.enemies) {
            live.add(enemy);
            const text = countdownLabel(beyondMs, view.despawnDelayMs);
            let label = this.labels.get(enemy);

            if (text === null) {
                label?.setVisible(false);
                continue;
            }
            if (!label) {
                label = this.scene.add
                    .bitmapText(0, 0, FONTS.outline, "", pixelFontSize(2))
                    .setTint(0xffe600)
                    .setOrigin(0.5, 1)
                    .setDepth(DEPTH);
                this.labels.set(enemy, label);
            }
            label
                .setText(text)
                .setPosition(enemy.x, enemy.y - enemy.height)
                .setVisible(true);
        }

        this.labels.forEach((label, enemy) => {
            if (live.has(enemy)) return;
            label.destroy();
            this.labels.delete(enemy);
        });
    }

    /** Destroys everything the overlay drew. Idempotent. */
    cleanup(): void {
        this.graphics?.destroy();
        this.graphics = null;
        this.labels.forEach((label) => label.destroy());
        this.labels.clear();
        this.multipliers.forEach((label) => label.destroy());
        this.multipliers.clear();
    }
}
