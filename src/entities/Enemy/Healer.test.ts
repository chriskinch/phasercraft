import { describe, it, expect, vi } from "vitest";
import { maxBy } from "lodash";
import Healer from "./Healer";
import Enemy from "./Enemy";

// Healer target scan: the single-pass getHealTarget must pick exactly what
// the old getChildren().filter(missing > 0 && not self) + lodash maxBy did.
// Constructor-free fakes on the real prototype.

interface FakeEnemy {
    id: string;
    health: { stats: { max: number; value: number } };
}

function fake(id: string, max: number, value: number): FakeEnemy {
    return { id, health: { stats: { max, value } } };
}

function makeHealer(others: FakeEnemy[], self = fake("self", 100, 50), selfAt = 0): Healer {
    const healer = Object.assign(Object.create(Healer.prototype) as Healer, self);
    const members: unknown[] = [...others];
    members.splice(selfAt, 0, healer);
    const children = new Set(members);
    Object.assign(healer, {
        active_group: { children, getChildren: () => Array.from(children) },
    });
    return healer;
}

// The pre-#531 implementation, kept as the oracle.
function legacyHealTarget(healer: Healer): Enemy | undefined {
    const targets = healer.active_group.getChildren().filter((enemy) => {
        return healer.getMissingHealth(enemy as Enemy) > 0 && enemy !== healer;
    });
    return targets.length > 0
        ? maxBy(targets as Enemy[], (enemy: Enemy) => healer.getMissingHealth(enemy))
        : undefined;
}

describe("Healer.getHealTarget", () => {
    it("picks the enemy missing the most health", () => {
        const a = fake("a", 100, 90);
        const b = fake("b", 100, 20);
        const c = fake("c", 100, 60);
        expect(makeHealer([a, b, c]).getHealTarget()).toBe(b);
    });

    it("breaks ties to the first in group order, like maxBy", () => {
        const a = fake("a", 100, 90);
        const b = fake("b", 100, 40);
        const c = fake("c", 200, 140);
        const healer = makeHealer([a, b, c]);
        expect(healer.getHealTarget()).toBe(b);
        expect(healer.getHealTarget()).toBe(legacyHealTarget(healer));
    });

    it("never targets itself, even when it is the most hurt", () => {
        const a = fake("a", 100, 90);
        const healer = makeHealer([a], fake("self", 100, 1), 1);
        expect(healer.getHealTarget()).toBe(a);
    });

    it("returns undefined when nobody else is hurt (or the group is just itself)", () => {
        expect(makeHealer([fake("a", 100, 100), fake("b", 50, 80)]).getHealTarget()).toBe(
            undefined
        );
        expect(makeHealer([]).getHealTarget()).toBe(undefined);
    });

    it("skips NaN / undefined missing health and keeps the first Infinity", () => {
        const nan = fake("nan", NaN, 10);
        const undef = { id: "undef", health: { stats: {} } } as unknown as FakeEnemy;
        const inf1 = fake("inf1", Infinity, 10);
        const inf2 = fake("inf2", Infinity, 0);
        const healer = makeHealer([nan, undef, fake("a", 100, 10), inf1, inf2]);
        expect(healer.getHealTarget()).toBe(inf1);
        expect(healer.getHealTarget()).toBe(legacyHealTarget(healer));
        const onlyBad = makeHealer([nan, undef]);
        expect(onlyBad.getHealTarget()).toBe(undefined);
        expect(legacyHealTarget(onlyBad)).toBe(undefined);
    });

    it("matches the filter + maxBy oracle on random groups with many ties", () => {
        let seed = 531;
        const rand = () => {
            seed = (seed * 1103515245 + 12345) % 2147483648;
            return seed / 2147483648;
        };
        for (let round = 0; round < 500; round++) {
            const n = Math.floor(rand() * 8);
            // Small integer health values so ties and full-health enemies are common.
            const others = Array.from({ length: n }, (_, i) =>
                fake(`e${i}`, 5, Math.floor(rand() * 6))
            );
            const healer = makeHealer(others, fake("self", 5, 0), Math.floor(rand() * (n + 1)));
            expect(healer.getHealTarget()).toBe(legacyHealTarget(healer));
        }
    });
});

describe("Healer.update heal cast", () => {
    function makeUpdatable(attack: string, others: FakeEnemy[]) {
        const healer = makeHealer(others);
        const addEvent = vi.fn();
        Object.assign(healer, {
            state: "idle", // skips Enemy.update's spawned branch
            states: { movement: "idle", attack },
            distance_to_player: Infinity,
            circling: null,
            setDepth: vi.fn(),
            emit: vi.fn(),
            scene: { time: { addEvent } },
        });
        const scan = vi.spyOn(healer, "getHealTarget");
        return { healer, addEvent, scan };
    }

    it("scans once and heals that target when primed", () => {
        const a = fake("a", 100, 10);
        const { healer, addEvent, scan } = makeUpdatable("primed", [fake("b", 100, 50), a]);
        healer.update(0, 16);
        expect(scan).toHaveBeenCalledTimes(1);
        expect(healer.states.attack).toBe("casting");
        expect(addEvent).toHaveBeenCalledTimes(1);
        expect(addEvent.mock.calls[0][0].args).toEqual([a]);
    });

    it("does not cast without a target, or while already casting", () => {
        const idle = makeUpdatable("primed", [fake("a", 100, 100)]);
        idle.healer.update(0, 16);
        expect(idle.addEvent).not.toHaveBeenCalled();
        expect(idle.healer.states.attack).toBe("primed");

        const busy = makeUpdatable("casting", [fake("a", 100, 10)]);
        busy.healer.update(0, 16);
        expect(busy.addEvent).not.toHaveBeenCalled();
    });
});

// Heal-cast lifecycle: the 3s heal timer is stored, released in cleanup(), and
// a healer that died mid-cast doesn't land the heal.
describe("Healer heal timer", () => {
    type Callback = (target: unknown) => void;

    function makeCaster() {
        const healer = Object.create(Healer.prototype) as Healer;
        const timer = { remove: vi.fn() };
        const target = fake("a", 100, 10);
        const adjustValue = vi.fn();
        Object.assign(target.health, { adjustValue });
        let callback: Callback = () => {};
        let args: unknown[] = [];
        const addEvent = vi.fn((config: { callback: Callback; args: unknown[] }) => {
            callback = config.callback;
            args = config.args;
            return timer;
        });
        Object.assign(healer, {
            state: "idle",
            states: { movement: "idle", attack: "primed" },
            heal_timer: null,
            scene: { time: { addEvent } },
        });
        return { healer, timer, target, adjustValue, fire: () => callback(args[0]) };
    }

    it("stores the heal timer and heals the target when it fires", () => {
        const { healer, timer, target, adjustValue, fire } = makeCaster();
        healer.healTarget(target as unknown as Enemy);
        expect(healer.heal_timer).toBe(timer);
        expect(healer.states.attack).toBe("casting");

        fire();
        expect(adjustValue).toHaveBeenCalledWith(50, "magic_power", false);
        expect(healer.states.attack).toBe("primed");
        expect(healer.heal_timer).toBeNull();
    });

    it("does not heal if the healer died mid-cast", () => {
        const { healer, target, adjustValue, fire } = makeCaster();
        healer.healTarget(target as unknown as Enemy);
        healer.state = "dead";

        fire();
        expect(adjustValue).not.toHaveBeenCalled();
    });

    it("cleanup removes the pending heal timer, then runs Enemy.cleanup", () => {
        const { healer, timer, target } = makeCaster();
        const base = vi.spyOn(Enemy.prototype, "cleanup").mockImplementation(() => {});
        healer.healTarget(target as unknown as Enemy);

        healer.cleanup();
        expect(timer.remove).toHaveBeenCalledWith(false);
        expect(healer.heal_timer).toBeNull();
        expect(base).toHaveBeenCalledOnce();

        expect(() => healer.cleanup()).not.toThrow();
        expect(timer.remove).toHaveBeenCalledOnce();
        base.mockRestore();
    });
});
