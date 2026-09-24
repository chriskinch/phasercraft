// Where on a biome map an enemy may spawn (#456). Pure TS over plain tile
// arrays, so the rules are unit-testable without building a Phaser tilemap;
// BiomeScene reads its layers into these arrays once per area.

export interface WalkabilityInput {
    // Map size in tiles.
    width: number;
    height: number;
    // Size of one tile in world px (the tile art times the map's render scale).
    tileWidth: number;
    tileHeight: number;
    // Row-major, `width * height` long. `water` is any tile showing water,
    // shorelines included; `solid` is any tile that blocks movement.
    water: ArrayLike<boolean>;
    solid: ArrayLike<boolean>;
    // Tile the player starts on; the reachable region is flooded from here.
    start: { x: number; y: number };
}

export interface WalkabilityGrid {
    width: number;
    height: number;
    tileWidth: number;
    tileHeight: number;
    // 1 where an enemy may stand: pure land, not solid, and reachable from the
    // player's start on foot.
    spawnable: Uint8Array;
}

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Floods the walkable tiles (anything not solid — shorelines included, since
 * the player can walk them) outward from `start`, then keeps only the pure-land
 * tiles among them. An island or a pocket walled in by trees never floods, so
 * nothing spawns where the player could not follow.
 */
export function buildWalkability(input: WalkabilityInput): WalkabilityGrid {
    const { width, height, tileWidth, tileHeight, water, solid, start } = input;
    const spawnable = new Uint8Array(width * height);
    const grid = { width, height, tileWidth, tileHeight, spawnable };

    const inBounds = (x: number, y: number) => x >= 0 && y >= 0 && x < width && y < height;
    if (!inBounds(start.x, start.y) || solid[start.y * width + start.x]) return grid;

    // Four-way, matching how a body slides along tile edges: two solid tiles
    // touching only at a corner still seal the gap between them.
    const reached = new Uint8Array(width * height);
    const queue = new Int32Array(width * height);
    let head = 0;
    let tail = 0;

    const visit = (x: number, y: number) => {
        if (!inBounds(x, y)) return;
        const i = y * width + x;
        if (reached[i] || solid[i]) return;
        reached[i] = 1;
        queue[tail++] = i;
    };

    visit(start.x, start.y);
    while (head < tail) {
        const i = queue[head++];
        const x = i % width;
        const y = (i - x) / width;
        if (!water[i]) spawnable[i] = 1;
        visit(x + 1, y);
        visit(x - 1, y);
        visit(x, y + 1);
        visit(x, y - 1);
    }

    return grid;
}

/**
 * Whether every tile a world-space rect overlaps is spawnable. A rect reaching
 * past the map edge is rejected rather than clamped back in, so an enemy is
 * never shoved onto a tile nobody checked.
 */
export function isFootprintSpawnable(grid: WalkabilityGrid, rect: Rect): boolean {
    const { width, height, tileWidth, tileHeight, spawnable } = grid;
    // A degenerate rect overlaps no tile, which would otherwise pass unchecked.
    if (rect.width <= 0 || rect.height <= 0) return false;

    const left = Math.floor(rect.x / tileWidth);
    const top = Math.floor(rect.y / tileHeight);
    // The far edge is exclusive: a rect ending exactly on a tile boundary does
    // not overlap the next tile.
    const right = Math.ceil((rect.x + rect.width) / tileWidth) - 1;
    const bottom = Math.ceil((rect.y + rect.height) / tileHeight) - 1;

    if (left < 0 || top < 0 || right >= width || bottom >= height) return false;

    for (let y = top; y <= bottom; y++) {
        for (let x = left; x <= right; x++) {
            if (!spawnable[y * width + x]) return false;
        }
    }
    return true;
}
