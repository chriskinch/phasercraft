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

// lodash (sample, random) captures `Math.random` when its modules load, so
// replacing `Math.random` later misses every lodash roll (#527). The hook swaps
// in a forwarding wrapper before anything else loads (see ./earlyHook), and
// seeding then changes what the wrapper forwards to.
let hooked = false;
let source: (() => number) | null = null;

export function installRandomHook(): void {
    if (hooked) return;
    hooked = true;
    const native = Math.random;
    Math.random = () => (source ? source() : native());
}

/**
 * Seeds every roll in the run (spawn picks, loot, crits, wander points).
 * Perf builds only. Returns the function that puts the original back.
 */
export function installSeededRandom(seed: number): () => void {
    const seeded = mulberry32(seed);
    if (hooked) {
        source = seeded;
        return () => {
            source = null;
        };
    }
    const original = Math.random;
    Math.random = seeded;
    return () => {
        Math.random = original;
    };
}
