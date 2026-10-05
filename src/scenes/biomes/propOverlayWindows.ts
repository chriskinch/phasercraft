// Bookkeeping that lets BiomeScene.updatePropOverlays() skip frames where the
// overlays it would draw cannot have changed. Pure: no Phaser, so the
// change detection and the camera cull are unit-tested on their own.
//
// What the overlays draw is fully decided by, in order: which characters are
// looked around, and which tile cells each one's window covers on each prop
// layer (the prop tiles themselves never change at runtime). So the scene
// records exactly those per frame, and only redraws when they differ from the
// frame it last drew. Drawing the same inputs again would place the same pool
// sprites on the same tiles at the same depths, so the skipped frame is
// identical to a redrawn one.

// The window around a character, in tiles: 3 wide by 4 tall, the same offsets
// updatePropOverlays() has always looked at (a prop is two tiles tall and a
// character about the same).
export const WINDOW_DX = [-1, 0, 1] as const;
export const WINDOW_DY = [-2, -1, 0, 1] as const;
// Per character and prop layer: the tile column of each WINDOW_DX offset, then
// the tile row of each WINDOW_DY offset. On an orthogonal map a cell's column
// depends only on its world x and its row only on its world y, so these seven
// numbers pin down all twelve cells.
export const WINDOW_SIZE = WINDOW_DX.length + WINDOW_DY.length;

export interface Bounds {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export interface ViewRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Writes into `out` the smallest box holding both views, grown by the margins.
 *
 * The scene updates before the camera does: `worldView` is still last frame's
 * view, and the camera only scrolls to follow the player in its own preRender.
 * The view this frame will render lies between that and the view centred on
 * the player (`next`), whatever the follow lerp, so their bounding box covers it.
 */
export function cullBounds(
    out: Bounds,
    last: ViewRect,
    next: ViewRect,
    margin_x: number,
    margin_y: number
): Bounds {
    out.left = Math.min(last.x, next.x) - margin_x;
    out.top = Math.min(last.y, next.y) - margin_y;
    out.right = Math.max(last.x + last.width, next.x + next.width) + margin_x;
    out.bottom = Math.max(last.y + last.height, next.y + next.height) + margin_y;
    return out;
}

export function withinBounds(bounds: Bounds, x: number, y: number): boolean {
    return x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom;
}

/**
 * The characters and tile windows of the current frame, against those the
 * overlays were last drawn for. Buffers are swapped, not reallocated.
 */
export class OverlayWindows<T> {
    // This frame's characters, in draw order, and their windows: WINDOW_SIZE
    // numbers per character per prop layer.
    characters: T[] = [];
    cells: number[] = [];
    private drawn_characters: T[] = [];
    private drawn_cells: number[] = [];
    private valid = false;

    /** Starts a new frame's record. */
    begin(): void {
        this.characters.length = 0;
        this.cells.length = 0;
    }

    /** True when this frame's record differs from the last one drawn. */
    changed(): boolean {
        return (
            !this.valid ||
            !sameItems(this.characters, this.drawn_characters) ||
            !sameItems(this.cells, this.drawn_cells)
        );
    }

    /** Marks this frame's record as drawn. */
    commit(): void {
        const characters = this.drawn_characters;
        this.drawn_characters = this.characters;
        this.characters = characters;
        const cells = this.drawn_cells;
        this.drawn_cells = this.cells;
        this.cells = cells;
        this.valid = true;
    }

    /**
     * Forgets what was drawn, so the next frame redraws whatever it records.
     * Needed whenever the overlays' other inputs change: new prop layers, a
     * rebuilt sprite pool, or an edit to a prop layer's tiles.
     */
    invalidate(): void {
        this.valid = false;
        this.characters.length = 0;
        this.cells.length = 0;
        this.drawn_characters.length = 0;
        this.drawn_cells.length = 0;
    }
}

function sameItems<V>(a: readonly V[], b: readonly V[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
