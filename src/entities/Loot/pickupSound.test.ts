import { describe, it, expect, vi, beforeEach } from "vitest";
import Coin from "./Coin";
import Crafting from "./Crafting";
import Gem from "./Gem";
import { playSfx } from "@services/sfx";

// Picking up any loot (coins, gems, crafting components) plays the coin sound
// once, in collect(). Constructor-free fakes on the real prototypes; the store
// write is real but harmless.
vi.mock("@services/sfx", () => ({ playSfx: vi.fn(() => true) }));

type Collectable = { value?: number; name?: string; collect(): void };

function make<T extends Collectable>(proto: object, extra: Partial<T>): T {
    const loot = Object.create(proto) as T;
    Object.assign(loot, extra, { scene: { tweens: { add: vi.fn() } } });
    return loot;
}

describe("loot pickup sound", () => {
    beforeEach(() => vi.mocked(playSfx).mockClear());

    it.each([
        ["Coin", () => make(Coin.prototype, { value: 1 })],
        ["Gem", () => make(Gem.prototype, { value: 1 })],
        ["Crafting", () => make(Crafting.prototype, { name: "bone" })],
    ])("%s plays the coin sound on collect", (_, build) => {
        build().collect();

        expect(playSfx).toHaveBeenCalledTimes(1);
        expect(playSfx).toHaveBeenCalledWith("coin");
    });
});
