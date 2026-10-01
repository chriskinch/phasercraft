import { describe, it, expect, vi } from "vitest";
import Enfeeble, { ENFEEBLE_TINT } from "./Enfeeble";
import Banes from "@entities/UI/Banes";
import type Enemy from "@entities/Enemy/Enemy";
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
    callback: (...a: unknown[]) => void;
    callbackScope: unknown;
    args?: unknown[];
    remove: ReturnType<typeof vi.fn>;
};

const makeScene = () => {
    const timers: Timer[] = [];
    const scene = {
        time: {
            addEvent: vi.fn((cfg: Omit<Timer, "remove">) => {
                const t = { ...cfg, remove: vi.fn() };
                timers.push(t);
                return t;
            }),
        },
    };
    const fire = (t: Timer) => t.callback.apply(t.callbackScope, t.args ?? []);
    return { scene, timers, fire };
};

const makeEnemy = (scene: unknown) => {
    const enemy = {
        alive: true,
        base_stats: { damage: 100, speed: 50 },
        stats: { damage: 100, speed: 50 },
        monster: { setTint: vi.fn(), clearTint: vi.fn() },
    } as unknown as Enemy;
    const banes = Object.create(Banes.prototype) as Banes;
    const children = new Set<unknown>();
    Object.assign(banes, {
        scene,
        entity: enemy,
        timers: {},
        add: (c: unknown) => children.add(c),
        remove: (c: unknown) => children.delete(c),
        contains: (c: unknown) => children.has(c),
        getChildren: () => [...children],
    });
    enemy.banes = banes;
    return enemy;
};

const setup = () => {
    const s = makeScene();
    const spell = new Enfeeble({} as SpellOptions);
    Object.assign(spell, { scene: s.scene, name: "enfeeble" });
    const enemy = makeEnemy(s.scene);
    return { ...s, spell, enemy };
};

describe("Enfeeble", () => {
    it("cuts enemy damage by 90% for the duration and tints it", () => {
        const { spell, enemy, timers } = setup();
        spell.effect(enemy);
        expect(enemy.stats.damage).toBeCloseTo(10);
        expect(enemy.stats.speed).toBe(50);
        expect(enemy.monster.setTint).toHaveBeenCalledWith(ENFEEBLE_TINT);
        expect(timers[0].delay).toBe(10000);
        expect(spell.cooldown).toBe(5);
    });

    it("reverts damage and tint on expiry", () => {
        const { spell, enemy, timers, fire } = setup();
        spell.effect(enemy);
        fire(timers[0]); // bane expiry
        expect(enemy.stats.damage).toBe(100);
        fire(timers[1]); // spell clearEffect
        expect(enemy.monster.clearTint).toHaveBeenCalled();
        expect(spell.timers.size).toBe(0);
    });

    it("does not touch an enemy that died mid-debuff", () => {
        const { spell, enemy, timers, fire } = setup();
        spell.effect(enemy);
        enemy.alive = false;
        fire(timers[1]);
        expect(enemy.monster.clearTint).not.toHaveBeenCalled();
    });

    it("cleanup releases the pending clear timer (idempotent)", () => {
        const { spell, enemy, timers } = setup();
        spell.effect(enemy);
        spell.cleanup();
        spell.cleanup();
        expect(timers[1].remove).toHaveBeenCalledTimes(1);
        expect(spell.timers.size).toBe(0);
    });

    it("casting on a second enemy does not strand the first one's tint", () => {
        const { spell, enemy, scene, timers, fire } = setup();
        const other = makeEnemy(scene);
        spell.effect(enemy);
        spell.effect(other);
        timers.forEach(fire);
        expect(enemy.monster.clearTint).toHaveBeenCalled();
        expect(other.monster.clearTint).toHaveBeenCalled();
        expect(enemy.stats.damage).toBe(100);
        expect(other.stats.damage).toBe(100);
    });

    it("repeat casts on the same enemy fully revert and never corrupt base damage", () => {
        const { spell, enemy, timers, fire } = setup();
        for (let i = 0; i < 3; i++) {
            const start = timers.length;
            spell.effect(enemy);
            expect(enemy.stats.damage).toBeCloseTo(10);
            timers.slice(start).forEach(fire);
            expect(enemy.stats.damage).toBe(100);
            expect(enemy.base_stats.damage).toBe(100);
        }
        expect(enemy.monster.clearTint).toHaveBeenCalledTimes(3);
    });
});
