// Pure geometry for the off-screen enemy spawner (#456). No Phaser here, so
// every rule the spawner relies on is unit-testable on plain numbers.

export interface Point {
    x: number;
    y: number;
}

export interface SpawnRadiusOptions {
    viewWidth: number;
    viewHeight: number;
    zoom: number;
    margin: number;
    // A fixed radius in world px; 0 (or less) means derive it from the view.
    override: number;
}

/**
 * World-space distance at which enemies spawn and beyond which they despawn.
 *
 * Half the viewport diagonal is the distance from the player (camera centre)
 * to a screen corner, so a point on that circle is off screen in every
 * direction. The view size is in screen px; dividing by zoom converts it to
 * world px.
 */
export function spawnRadius({
    viewWidth,
    viewHeight,
    zoom,
    margin,
    override,
}: SpawnRadiusOptions): number {
    if (override > 0) return override;
    return Math.hypot(viewWidth, viewHeight) / 2 / zoom + margin;
}

/**
 * The unit vector the player is travelling in, or `null` when they are slower
 * than `movingSpeed` — standing still, enemies may spawn in any direction.
 */
export function spawnDirection(velocity: Point, movingSpeed: number): Point | null {
    const speed = Math.hypot(velocity.x, velocity.y);
    if (speed === 0 || speed < movingSpeed) return null;
    return { x: velocity.x / speed, y: velocity.y / speed };
}

/**
 * A candidate spawn point exactly `radius` from `origin`: uniformly within
 * `halfAngle` radians either side of `direction`, or anywhere on the circle
 * when `direction` is `null`. `random` returns [0, 1) like Math.random and is
 * injected so tests can pin the result.
 */
export function sampleSpawnPoint(
    origin: Point,
    radius: number,
    direction: Point | null,
    halfAngle: number,
    random: () => number = Math.random
): Point {
    const angle =
        direction === null
            ? random() * Math.PI * 2
            : Math.atan2(direction.y, direction.x) + (random() * 2 - 1) * halfAngle;

    return {
        x: origin.x + Math.cos(angle) * radius,
        y: origin.y + Math.sin(angle) * radius,
    };
}

/**
 * Strictly further than `radius` apart. Strict so an enemy spawned exactly on
 * the circle does not start its despawn clock until the player moves away.
 */
export function isBeyondRadius(a: Point, b: Point, radius: number): boolean {
    return Math.hypot(a.x - b.x, a.y - b.y) > radius;
}
