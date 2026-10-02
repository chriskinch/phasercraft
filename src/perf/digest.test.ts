import { describe, it, expect } from "vitest";
import { digest, fixed, fnv1a, stateString, type DigestInput } from "./digest";

const world: DigestInput = {
    player: { x: 100, y: 200.004, health: 450, alive: true },
    enemies: [{ key: "baby-ghoul", x: 12.345, y: 6, health: 80, state: "spawned/chasing/primed" }],
    loot: [{ key: "coin", x: 1, y: 2 }],
};

describe("fnv1a", () => {
    it("matches the reference vectors", () => {
        expect(fnv1a("")).toBe("811c9dc5");
        expect(fnv1a("a")).toBe("e40c292c");
        expect(fnv1a("foobar")).toBe("bf9cf968");
    });
});

describe("stateString", () => {
    it("lists player, enemies, then loot at 1/100 px", () => {
        expect(stateString(world)).toBe(
            "P:100.00,200.00,450,1|E:baby-ghoul,12.35,6.00,80,spawned/chasing/primed|L:coin,1.00,2.00"
        );
    });
});

describe("digest", () => {
    it("ignores sub-1/100px float noise", () => {
        const nudged = { ...world, player: { ...world.player, x: 100.0000001 } };
        expect(digest(nudged)).toBe(digest(world));
    });

    it("changes with any gameplay difference", () => {
        const base = digest(world);
        expect(digest({ ...world, player: { ...world.player, health: 449 } })).not.toBe(base);
        expect(digest({ ...world, enemies: [{ ...world.enemies[0], x: 13 }] })).not.toBe(base);
        expect(digest({ ...world, loot: [] })).not.toBe(base);
    });
});

describe("fixed", () => {
    it("rounds to two decimals", () => {
        expect(fixed(1.005)).toBe("1.00");
        expect(fixed(-0.126)).toBe("-0.13");
    });
});
