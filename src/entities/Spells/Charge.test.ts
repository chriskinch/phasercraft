import { describe, it, expect, vi } from "vitest";
import Charge, { CHARGE_MIN_RANGE } from "./Charge";
import Spell from "./Spell";

vi.mock("@store", () => ({
    default: { getState: () => ({ game: { stats: { attack_power: 0 } } }) },
}));

interface TweenConfig {
    duration: number;
    onUpdate: (tween: { getValue(): number }) => void;
    onComplete: () => void;
}

function setup(enemyX = 200) {
    let config: TweenConfig | undefined;
    const tween = { remove: vi.fn() };
    const enemy = {
        alive: true,
        x: enemyX,
        y: 0,
        hit: vi.fn(),
        banes: { addEffect: vi.fn() },
    };
    const player = {
        x: 0,
        y: 0,
        dashing: false,
        destination: { x: null, y: null },
        body: { setVelocity: vi.fn() },
        walk: vi.fn(),
        idle: vi.fn(),
        setPosition: vi.fn(function (this: { x: number; y: number }, x: number, y: number) {
            this.x = x;
            this.y = y;
        }),
    };
    const spell = Object.create(Charge.prototype) as Charge;
    Object.assign(spell, {
        type: "physical",
        duration: 1,
        stun: true,
        player,
        scene: {
            tweens: {
                addCounter: vi.fn((cfg: TweenConfig) => {
                    config = cfg;
                    return tween;
                }),
            },
        },
    });
    vi.spyOn(spell, "setValue").mockReturnValue({ amount: 30, crit: false });
    return {
        spell,
        enemy,
        player,
        tween,
        step: (t: number) => config!.onUpdate({ getValue: () => t }),
        complete: () => config!.onComplete(),
        duration: () => config!.duration,
    };
}

describe("Charge", () => {
    it("dashes toward the target and stops short of it", () => {
        const { spell, enemy, player, step, duration } = setup(300);
        spell.effect(enemy as never);
        expect(player.dashing).toBe(true);
        expect(duration()).toBe(500);
        step(1);
        expect(player.x).toBe(270);
    });

    it("on arrival hits, stuns and releases the dash", () => {
        const { spell, enemy, player, tween, complete } = setup();
        spell.effect(enemy as never);
        complete();
        expect(enemy.hit).toHaveBeenCalledWith({ power: 30, type: "physical", crit: false });
        expect(enemy.banes.addEffect).toHaveBeenCalledWith(spell);
        expect(tween.remove).toHaveBeenCalled();
        expect(spell.dashTween).toBeUndefined();
        expect(player.dashing).toBe(false);
        expect(player.idle).toHaveBeenCalled();
    });

    it("aborts with no hit or stun when the target dies mid-dash", () => {
        const { spell, enemy, player, tween, step, complete } = setup();
        spell.effect(enemy as never);
        enemy.alive = false;
        step(0.5);
        expect(tween.remove).toHaveBeenCalled();
        expect(player.dashing).toBe(false);
        complete();
        expect(enemy.hit).not.toHaveBeenCalled();
        expect(enemy.banes.addEffect).not.toHaveBeenCalled();
    });

    it("cleanup releases the dash and is idempotent", () => {
        const { spell, enemy, player, tween } = setup();
        const base = vi.spyOn(Spell.prototype, "cleanup").mockImplementation(() => {});
        spell.effect(enemy as never);
        spell.cleanup();
        spell.cleanup();
        expect(tween.remove).toHaveBeenCalledTimes(1);
        expect(player.dashing).toBe(false);
        expect(player.idle).toHaveBeenCalledTimes(1);
        base.mockRestore();
    });

    it("refuses (no cost/cast) inside melee range or on a dead target", () => {
        const base = vi.spyOn(Spell.prototype, "castSpell").mockImplementation(() => {});
        const near = setup(CHARGE_MIN_RANGE - 1);
        near.spell.castSpell(near.enemy as never);
        const dead = setup();
        dead.enemy.alive = false;
        dead.spell.castSpell(dead.enemy as never);
        expect(base).not.toHaveBeenCalled();
        const far = setup();
        far.spell.castSpell(far.enemy as never);
        expect(base).toHaveBeenCalledTimes(1);
        base.mockRestore();
    });
});
