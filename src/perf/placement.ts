import type { Rect } from "@helpers/walkability";

export interface Point {
    x: number;
    y: number;
}

export interface RingOptions {
    centre: Point;
    count: number;
    // Annulus to place in. Kept inside the enemies' aggro radius so every one
    // of them engages the player.
    minRadius: number;
    maxRadius: number;
    size: { width: number; height: number };
    random: () => number;
    // Whether a footprint rect can hold an enemy (open, reachable land).
    accept: (rect: Rect) => boolean;
    maxAttempts?: number;
}

const overlaps = (a: Rect, b: Rect): boolean =>
    a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

const rectAt = (point: Point, size: { width: number; height: number }): Rect => ({
    x: point.x - size.width / 2,
    y: point.y - size.height / 2,
    width: size.width,
    height: size.height,
});

/**
 * Deterministic (for a seeded `random`) enemy placement around the player:
 * rejection-samples the annulus until `count` accepted, non-overlapping
 * footprints are found or the attempts run out. Returns centre points, the
 * same convention the spawn director hands to `spawnEnemy`.
 */
export function ringPlacements(options: RingOptions): Point[] {
    const { centre, count, minRadius, maxRadius, size, random, accept } = options;
    const max_attempts = options.maxAttempts ?? count * 50;
    const placed: Point[] = [];
    const rects: Rect[] = [];

    for (let attempt = 0; attempt < max_attempts && placed.length < count; attempt++) {
        const angle = random() * Math.PI * 2;
        const radius = minRadius + random() * (maxRadius - minRadius);
        const point = {
            x: centre.x + Math.cos(angle) * radius,
            y: centre.y + Math.sin(angle) * radius,
        };
        const rect = rectAt(point, size);
        if (!accept(rect) || rects.some((other) => overlaps(rect, other))) continue;
        placed.push(point);
        rects.push(rect);
    }
    return placed;
}

// Index of the point nearest `from`, or -1 for an empty list.
export function nearestIndex(from: Point, points: readonly Point[]): number {
    let best = -1;
    let best_distance = Infinity;
    points.forEach((point, index) => {
        const distance = (point.x - from.x) ** 2 + (point.y - from.y) ** 2;
        if (distance < best_distance) {
            best = index;
            best_distance = distance;
        }
    });
    return best;
}
