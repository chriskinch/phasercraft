import { describe, it, expect, vi } from "vitest";
import BattleStomp from "./BattleStomp";
import { playSfx } from "@services/sfx";

vi.mock("@services/sfx", () => ({ playSfx: vi.fn(() => true) }));

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

    it("does not tint stunned enemies", () => {
        const near = makeEnemy(50);
        const { spell } = setup([near]);

        spell.effect();

        expect(near.monster.setTint).not.toHaveBeenCalled();
    });
});

describe("BattleStomp shockwave VFX", () => {
    function setupVfx() {
        const calls: Array<() => void> = [];
        const timers: Array<{ remove: ReturnType<typeof vi.fn> }> = [];
        const emitters: Array<{
            destroy: ReturnType<typeof vi.fn>;
            explode: ReturnType<typeof vi.fn>;
        }> = [];
        const spell = Object.create(BattleStomp.prototype) as BattleStomp;
        Object.assign(spell, {
            range: 100,
            emitters: [],
            vfxTimers: [],
            player: { x: 0, y: 0 },
            scene: {
                textures: { exists: () => true },
                add: {
                    particles: vi.fn(() => {
                        const e = { destroy: vi.fn(), explode: vi.fn(), setDepth: vi.fn() };
                        emitters.push(e);
                        return e;
                    }),
                },
                time: {
                    delayedCall: vi.fn(
                        (_d: number, cb: () => void, _a?: unknown[], ctx?: unknown) => {
                            calls.push(() => cb.call(ctx));
                            const t = { remove: vi.fn() };
                            timers.push(t);
                            return t;
                        }
                    ),
                },
            },
        });
        return { spell, calls, timers, emitters };
    }

    it("bursts one full-radius ring with a bang and tears it down when done", () => {
        const { spell, calls, timers, emitters } = setupVfx();

        spell.startAnimation();

        expect(playSfx).toHaveBeenCalledWith("explosion");
        expect(emitters).toHaveLength(1);
        expect(emitters[0].explode).toHaveBeenCalled();

        calls[calls.length - 1]();

        emitters.forEach((e) => expect(e.destroy).toHaveBeenCalled());
        timers.forEach((t) => expect(t.remove).toHaveBeenCalled());
        expect(spell.emitters).toEqual([]);
    });

    it("cleanup releases pending rings and live emitters", () => {
        const { spell, calls, timers, emitters } = setupVfx();
        vi.spyOn(Object.getPrototypeOf(BattleStomp.prototype), "cleanup").mockImplementation(
            () => {}
        );

        spell.startAnimation();
        spell.cleanup();

        expect(emitters[0].destroy).toHaveBeenCalled();
        timers.forEach((t) => expect(t.remove).toHaveBeenCalled());
    });
});
