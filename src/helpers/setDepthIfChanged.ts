export interface DepthTarget {
    readonly depth: number;
    setDepth(value: number): unknown;
}

/**
 * `setDepth`, skipped when the depth would not change.
 *
 * Phaser 4's `depth` setter (GameObjects.Components.Depth) calls
 * `displayList.queueDepthSort()` unconditionally — the same value still
 * flags the whole display list for a re-sort before the next render. A
 * per-frame `setDepth(this.y)` on a stationary object therefore costs a
 * full sort for nothing.
 *
 * Skipping the no-op write cannot change draw order: DisplayList.depthSort
 * is a stable sort on `_depth`, so re-sorting a list whose depths have not
 * changed since its last sort leaves it exactly as it was, ties included.
 */
export function setDepthIfChanged(target: DepthTarget, depth: number): void {
    if (target.depth !== depth) target.setDepth(depth);
}
