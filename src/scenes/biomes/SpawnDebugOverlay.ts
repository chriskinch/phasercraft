import type { GameObjects, Scene } from "phaser";
import type { Point } from "@helpers/spawnGeometry";
import type { SpawnDebugView } from "./SpawnDirector";

// Draws what the spawn director is doing (#464): the spawn/despawn radius, the
// cone enemies spawn in, the last spawn attempt's candidates, and a despawn
// countdown over every enemy whose clock is running. Only built when Debug mode
// and its spawn overlay toggle are both on, so it costs nothing otherwise.

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

/** Seconds left before despawning, one decimal; null while the clock is idle. */
export function countdownLabel(beyondMs: number, delayMs: number): string | null {
    if (beyondMs <= 0) return null;
    return `${(Math.max(delayMs - beyondMs, 0) / 1000).toFixed(1)}s`;
}

export default class SpawnDebugOverlay<E extends OverlayEnemy> {
    private graphics: GameObjects.Graphics | null;
    private readonly labels = new Map<E, GameObjects.Text>();

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

        // The radius: thicker while standing still, when the whole ring is live.
        graphics.lineStyle(view.direction ? 2 : 4, RADIUS_COLOUR, 0.8);
        graphics.strokeCircle(player.x, player.y, view.radius);

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
                    .text(0, 0, "", {
                        fontFamily: "VT323",
                        fontSize: "16px",
                        color: "#ffe600",
                        stroke: "#000",
                        strokeThickness: 4,
                    })
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
    }
}
