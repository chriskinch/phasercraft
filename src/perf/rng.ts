// Seeded RNG for perf runs (#526): mulberry32, small and fast with a full
// 2^32 period, plenty for spawn placement and gameplay rolls.
export function mulberry32(seed: number): () => number {
    let state = seed >>> 0;
    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Swaps `Math.random` for a seeded generator so every roll in the run (spawn
 * picks, loot, crits, wander points) repeats. Perf builds only. Returns the
 * function that puts the original back.
 */
export function installSeededRandom(seed: number): () => void {
    const original = Math.random;
    Math.random = mulberry32(seed);
    return () => {
        Math.random = original;
    };
}
