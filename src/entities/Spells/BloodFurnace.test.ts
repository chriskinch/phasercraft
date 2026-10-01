import { describe, it, expect, vi } from "vitest";
import BloodFurnace from "./BloodFurnace";
import type { SpellOptions } from "@/types/game";

// Spell base (a Phaser Sprite) replaced with a plain class at the entity seam.
vi.mock("./Spell", () => ({
    default: class {
        constructor(config: Record<string, unknown>) {
            Object.assign(this, config);
        }
        cleanup(): void {}
    },
}));

type Timer = {
    delay: number;
    repeat?: number;
    callback: () => void;
    callbackScope: unknown;
    remove: ReturnType<typeof vi.fn>;
};

const setup = (hp = 1000) => {
    const timers: Timer[] = [];
    const scene = {
        time: {
            addEvent: vi.fn((cfg: Omit<Timer, "remove">) => {
                const t = { ...cfg, remove: vi.fn() };
                timers.push(t);
                return t;
            }),
        },
        events: { once: vi.fn(), off: vi.fn() },
    };
    const health = {
        value: hp,
        getValue: () => health.value,
        adjustValue: vi.fn((a: number) => (health.value += a)),
    };
    const resource = { value: 0, adjustValue: vi.fn((a: number) => (resource.value += a)) };
    const player = { alive: true, health, resource };
    const spell = new BloodFurnace({} as SpellOptions);
    Object.assign(spell, { scene, player });
    const fire = (t: Timer) => t.callback.call(t.callbackScope);
    return { spell, scene, timers, health, resource, player, fire };
};

describe("BloodFurnace", () => {
    it("declares self target, zero cost, duration and cooldown", () => {
        const { spell } = setup();
        expect(spell.targetKind).toBe("self");
        expect(spell.cost.mana).toBe(0);
        expect(spell.duration).toBe(5);
        expect(spell.cooldown).toBe(15);
    });

    it("each tick drains health and restores mana", () => {
        const { spell, timers, health, resource, fire } = setup();
        spell.effect();
        const [tick] = timers;
        expect(tick.delay).toBe(500);
        expect(tick.repeat).toBe(9);
        fire(tick);
        fire(tick);
        expect(health.value).toBe(940);
        expect(resource.value).toBe(50);
        expect(health.adjustValue).toHaveBeenCalledWith(-30, "physical", false);
    });

    it("stops at duration end and releases timers", () => {
        const { spell, timers, scene, fire } = setup();
        spell.effect();
        fire(timers[1]);
        expect(timers[0].remove).toHaveBeenCalled();
        expect(timers[1].remove).toHaveBeenCalled();
        expect(scene.events.off).toHaveBeenCalledWith("player:dead", spell.endFurnace, spell);
        expect(spell.tickTimer).toBeUndefined();
    });

    it("never kills the player: stops instead of a lethal tick", () => {
        const { spell, timers, health, resource, fire } = setup(30);
        spell.effect();
        fire(timers[0]);
        expect(health.adjustValue).not.toHaveBeenCalled();
        expect(resource.value).toBe(0);
        expect(timers[0].remove).toHaveBeenCalled();
    });

    it("stops on player death", () => {
        const { spell, timers, scene, player, health, fire } = setup();
        spell.effect();
        expect(scene.events.once).toHaveBeenCalledWith("player:dead", spell.endFurnace, spell);
        player.alive = false;
        fire(timers[0]);
        expect(health.adjustValue).not.toHaveBeenCalled();
        expect(timers[0].remove).toHaveBeenCalled();
    });

    it("cleanup is idempotent and releases both timers once", () => {
        const { spell, timers } = setup();
        spell.effect();
        spell.cleanup();
        spell.cleanup();
        expect(timers[0].remove).toHaveBeenCalledTimes(1);
        expect(timers[1].remove).toHaveBeenCalledTimes(1);
    });
});
