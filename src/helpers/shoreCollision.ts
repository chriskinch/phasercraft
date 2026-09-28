// Shoreline tiles are drawn per corner: each quadrant of a terrain cell is
// either water or ground, recorded by the map generator as a `waterCorners`
// bitmask (NW=1, NE=2, SW=4, SE=8). Arcade can only collide with whole tiles,
// so BiomeScene collides against a hidden grid at half-tile resolution built
// from those masks — a water quadrant blocks, a ground quadrant stays open.

export const NW = 1;
export const NE = 2;
export const SW = 4;
export const SE = 8;

/**
 * Expands per-tile corner masks (`width * height`, row-major; 0/undefined for
 * no water) into a `2*width` by `2*height` grid of solid half-tile cells.
 */
export function shoreCells(
    width: number,
    height: number,
    masks: ReadonlyArray<number | undefined>
): boolean[] {
    const half_w = width * 2;
    const cells = new Array<boolean>(half_w * height * 2).fill(false);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const mask = masks[y * width + x];
            if (!mask) continue;
            const top = y * 2 * half_w + x * 2;
            const bottom = top + half_w;
            if (mask & NW) cells[top] = true;
            if (mask & NE) cells[top + 1] = true;
            if (mask & SW) cells[bottom] = true;
            if (mask & SE) cells[bottom + 1] = true;
        }
    }
    return cells;
}
