import { describe, it, expect } from "vitest";
import Banes from "./Banes";
import type { StatusEffect } from "./StatusEffects";
import type Enemy from "@entities/Enemy/Enemy";

// Constructor-free fake on the real prototype.
function makeBanes(): Banes {
    const banes = Object.create(Banes.prototype) as Banes;
    banes.entity = { base_stats: { speed: 100 }, stats: { speed: 100 } } as unknown as Enemy;
    return banes;
}

const bane = (extra: Partial<StatusEffect>) =>
    ({ name: "b", duration: 1, value: {}, ...extra }) as StatusEffect;

describe("Banes.calculate stun", () => {
    it("is stunned while any active bane stuns, and recovers when it expires", () => {
        const banes = makeBanes();
        const slow = bane({ value: { speed: (bs: number) => -bs * 0.5 } });
        const stun = bane({ stun: true });

        banes.calculate([slow, stun]);
        expect(banes.stunned).toBe(true);
        expect(banes.entity.stats.speed).toBe(50);

        banes.calculate([slow]);
        expect(banes.stunned).toBe(false);
    });
});
