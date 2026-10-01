import { describe, it, expect, vi } from "vitest";
import BattleStomp from "./BattleStomp";

vi.mock("@store", () => ({
    default: { getState: () => ({ game: { stats: { attack_power: 0 } } }) },
}));

// Constructor-free fake on the real prototype, like the other Spell tests.

interface FakeEnemy {
    active: boolean;
    body: {
        position: { clone(): { subtract(p: { x: number; y: number }): { x: number; y: number } } };
    };
    health: { adjustValue: ReturnType<typeof vi.fn> };
    banes: { addEffect: ReturnType<typeof vi.fn>; contains: ReturnType<typeof vi.fn> };
    monster: { setTint: ReturnType<typeof vi.fn>; clearTint: ReturnType<typeof vi.fn> };
    vector?: { range: number };
}

function makeEnemy(x: number): FakeEnemy {
    return {
        active: true,
        body: { position: { clone: () => ({ subtract: (p) => ({ x: x - p.x, y: -p.y }) }) } },
        health: { adjustValue: vi.fn() },
        banes: { addEffect: vi.fn(), contains: vi.fn(() => false) },
        monster: { setTint: vi.fn(), clearTint: vi.fn() },
    };
}

function setup(enemies: FakeEnemy[]) {
    let fire: (() => void) | undefined;
    const timer = { remove: vi.fn() };
    const spell = Object.create(BattleStomp.prototype) as BattleStomp;
    Object.assign(spell, {
        type: "physical",
        range: 100,
        cap: 5,
        duration: 2,
        slowed: [],
        player: { x: 0, y: 0, body: { position: { x: 0, y: 0 } }, isCritical: () => false },
        scene: {
            enemies: { getChildren: () => enemies },
            time: {
                addEvent: vi.fn((cfg: { callback: () => void; callbackScope: unknown }) => {
                    fire = () => cfg.callback.call(cfg.callbackScope);
                    return timer;
                }),
            },
        },
    });
    vi.spyOn(spell, "setValue").mockReturnValue({ amount: 25, crit: false } as ReturnType<
        BattleStomp["setValue"]
    >);
    return { spell, timer, fire: () => fire!() };
}

describe("BattleStomp.effect", () => {
    it("damages and stuns in-range enemies only", () => {
        const near = makeEnemy(50);
        const far = makeEnemy(150);
        const { spell } = setup([near, far]);

        spell.effect();

        expect(near.health.adjustValue).toHaveBeenCalledWith(-25, "physical", false);
        expect(near.banes.addEffect).toHaveBeenCalledWith(spell);
        expect(far.health.adjustValue).not.toHaveBeenCalled();
        expect(far.banes.addEffect).not.toHaveBeenCalled();
    });

    it("caps total damage against packs larger than the cap", () => {
        const pack = Array.from({ length: 10 }, (_, i) => makeEnemy(10 + i));
        const { spell } = setup(pack);

        spell.effect();

        pack.forEach((e) => {
            expect(e.health.adjustValue).toHaveBeenCalledWith(-12.5, "physical", false);
            expect(e.banes.addEffect).toHaveBeenCalledWith(spell);
        });
    });

    it("clears tints when the stun expires", () => {
        const near = makeEnemy(50);
        const { spell, fire } = setup([near]);

        spell.effect();
        fire();

        expect(near.monster.clearTint).toHaveBeenCalled();
        expect(spell.timer).toBeUndefined();
    });

    it("cleanup removes the pending tint timer", () => {
        const { spell, timer } = setup([makeEnemy(50)]);
        const superCleanup = vi
            .spyOn(Object.getPrototypeOf(BattleStomp.prototype), "cleanup")
            .mockImplementation(() => {});

        spell.effect();
        spell.cleanup();

        expect(timer.remove).toHaveBeenCalled();
        expect(spell.timer).toBeUndefined();
        expect(superCleanup).toHaveBeenCalled();
    });
});
