// Shoreline tiles are drawn per corner: each corner of a terrain cell is either
// water or ground, recorded by the map generator as a `waterCorners` bitmask
// (NW=1, NE=2, SW=4, SE=8). Arcade can only collide with whole tiles, so
// BiomeScene blocks shorelines with a hidden, finer collision grid built here.
//
// The rects do not stop at the corner midlines: the art draws a rim between
// water and grass — a grass lip on north shores, a dirt cliff face on south
// ones, a bank on east and west — and a character standing on it reads as
// hovering over the water or standing on the cliff. So each edge is pulled in
// to where the grass starts: a quarter tile past the midline. Measured on the
// 16px shoreline tiles; the forest, desert and tundra sheets share the geometry.
//
// Every edge then lies a quarter tile in from a tile boundary, so a grid of
// half-tile cells shifted by a quarter tile puts a cell edge exactly on each.
// (Static bodies would follow the art to the pixel, but Arcade never separates
// two immovable bodies, and the player's body is immovable.)

export const NW = 1;
export const NE = 2;
export const SW = 4;
export const SE = 8;

/** Tile art size the edges below are measured in. */
export const SHORE_ART_SIZE = 16;

/**
 * Where the blocked area ends, in art px from the tile's top/left, by which
 * side the water is on. Water to the north blocks rows 0-11 (the lip row 12 is
 * walkable); water to the south blocks from row 4 (the cliff face starts at 3,
 * under a notched lip).
 */
export const SHORE_EDGE = {
    waterNorth: 12,
    waterSouth: 4,
    waterWest: 12,
    waterEast: 4,
} as const;

const bit = (mask: number, corner: number) => (mask & corner ? 1 : 0);

/**
 * The vertical and horizontal split lines for a mask, in art px. The side with
 * more water corners decides; a tie (a straight north/south edge has one water
 * corner either side of the vertical line) leaves the midline, where it has no
 * effect since both quadrants on that axis match.
 */
function splits(mask: number): { xs: number; ys: number } {
    const west = bit(mask, NW) + bit(mask, SW);
    const east = bit(mask, NE) + bit(mask, SE);
    const north = bit(mask, NW) + bit(mask, NE);
    const south = bit(mask, SW) + bit(mask, SE);
    const mid = SHORE_ART_SIZE / 2;
    return {
        xs: west > east ? SHORE_EDGE.waterWest : east > west ? SHORE_EDGE.waterEast : mid,
        ys: north > south ? SHORE_EDGE.waterNorth : south > north ? SHORE_EDGE.waterSouth : mid,
    };
}

/** Whether art pixel (px, py) of a shoreline tile with this mask is blocked. */
export function isShoreBlocked(mask: number, px: number, py: number): boolean {
    if (!mask) return false;
    const { xs, ys } = splits(mask);
    const corner = py < ys ? (px < xs ? NW : NE) : px < xs ? SW : SE;
    return (mask & corner) !== 0;
}

/** Art px per collision cell (half a tile) and the grid's offset (a quarter tile). */
export const SHORE_CELL = SHORE_ART_SIZE / 2;
export const SHORE_OFFSET = SHORE_ART_SIZE / 4;

export interface ShoreGrid {
    cols: number;
    rows: number;
    // Row-major, `cols * rows`. Cell (cx, cy) covers art px
    // [cx * SHORE_CELL - SHORE_OFFSET, +SHORE_CELL) on each axis.
    cells: boolean[];
}

/**
 * Lays a `width * height` map of corner masks (row-major; 0/undefined for
 * none) out as blocked cells of the offset half-tile grid. Each cell spans two
 * quarter-tile strips per axis, possibly of neighbouring tiles; it is blocked if
 * any of them is. The edges only ever fall on quarter-tile lines, so the halves
 * of a cell agree wherever it matters.
 */
export function shoreGrid(
    width: number,
    height: number,
    masks: ReadonlyArray<number | undefined>
): ShoreGrid {
    const quarter = SHORE_OFFSET;
    const quarters_w = width * 4;
    const quarters_h = height * 4;
    const blockedQuarter = (qx: number, qy: number): boolean => {
        if (qx < 0 || qy < 0 || qx >= quarters_w || qy >= quarters_h) return false;
        const mask = masks[Math.floor(qy / 4) * width + Math.floor(qx / 4)];
        if (!mask) return false;
        // Sample the strip's centre pixel within its tile.
        return isShoreBlocked(
            mask,
            (qx % 4) * quarter + quarter / 2,
            (qy % 4) * quarter + quarter / 2
        );
    };

    const cols = width * 2 + 1;
    const rows = height * 2 + 1;
    const cells = new Array<boolean>(cols * rows).fill(false);
    for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
            // Cell cx covers quarter strips 2cx-1 and 2cx.
            cells[cy * cols + cx] =
                blockedQuarter(cx * 2 - 1, cy * 2 - 1) ||
                blockedQuarter(cx * 2, cy * 2 - 1) ||
                blockedQuarter(cx * 2 - 1, cy * 2) ||
                blockedQuarter(cx * 2, cy * 2);
        }
    }
    return { cols, rows, cells };
}
