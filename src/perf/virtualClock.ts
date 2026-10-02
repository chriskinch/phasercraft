// Virtual wall clock for fixed-step perf runs (#527). Phaser's TweenManager
// times itself off `Date.now()` rather than the game loop's delta, so a
// fixed-step simulation still drifts with real time unless `Date.now` moves
// with the steps too. Perf builds only.
export interface VirtualClock {
    now(): number;
    advance(ms: number): void;
    restore(): void;
}

export function installVirtualDateNow(start: number): VirtualClock {
    const original = Date.now;
    let now = start;
    Date.now = () => now;
    return {
        now: () => now,
        advance: (ms) => {
            now += ms;
        },
        restore: () => {
            Date.now = original;
        },
    };
}
