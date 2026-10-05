import { describe, it, expect, vi, afterEach } from "vitest";
import { maxBy } from "lodash";
import Healer, { HEAL_COOLDOWN_MS, HEAL_FRACTION } from "./Healer";
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
    afterEach(() => vi.restoreAllMocks());

    function makeUpdatable(attack: string, others: FakeEnemy[]) {
        // Enemy.update's movement/attack branch isn't under test here.
        vi.spyOn(Enemy.prototype, "update").mockImplementation(() => {});
        const healer = makeHealer(others);
        const addEvent = vi.fn();
        Object.assign(healer, {
            state: "spawned",
            banes: { stunned: false },
            heal_cooldown: null,
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

    it("does not cast while stunned, on cooldown, or not yet spawned", () => {
        const stunned = makeUpdatable("primed", [fake("a", 100, 10)]);
        stunned.healer.banes = { stunned: true } as Healer["banes"];
        stunned.healer.update(0, 16);
        expect(stunned.addEvent).not.toHaveBeenCalled();

        const cooling = makeUpdatable("primed", [fake("a", 100, 10)]);
        cooling.healer.heal_cooldown = {} as Phaser.Time.TimerEvent;
        cooling.healer.update(0, 16);
        expect(cooling.addEvent).not.toHaveBeenCalled();

        const spawning = makeUpdatable("primed", [fake("a", 100, 10)]);
        spawning.healer.state = "spawning";
        spawning.healer.update(0, 16);
        expect(spawning.addEvent).not.toHaveBeenCalled();
    });
});

// Heal-cast lifecycle: the 3s heal timer is stored, released in cleanup(), and
// a healer that died mid-cast doesn't land the heal.
describe("Healer heal timer", () => {
    type Callback = (target: unknown) => void;

    function makeCaster() {
        const healer = Object.create(Healer.prototype) as Healer;
        const timer = { remove: vi.fn() };
        const cooldown = { remove: vi.fn() };
        const target = fake("a", 200, 10);
        const adjustValue = vi.fn();
        Object.assign(target.health, { adjustValue });
        let callback: Callback = () => {};
        let args: unknown[] = [];
        let cooldownDone: () => void = () => {};
        // First addEvent is the cast, the second the post-heal cooldown.
        const addEvent = vi.fn(
            (config: { delay: number; callback: Callback; args?: unknown[] }) => {
                if (config.delay === HEAL_COOLDOWN_MS) {
                    cooldownDone = config.callback as () => void;
                    return cooldown;
                }
                callback = config.callback;
                args = config.args ?? [];
                return timer;
            }
        );
        Object.assign(healer, {
            state: "idle",
            states: { movement: "idle", attack: "primed" },
            heal_timer: null,
            heal_cooldown: null,
            scene: { time: { addEvent } },
        });
        return {
            healer,
            timer,
            cooldown,
            target,
            adjustValue,
            fire: () => callback(args[0]),
            endCooldown: () => cooldownDone(),
        };
    }

    it("heals a fraction of the target's max health, then cools down", () => {
        const { healer, timer, cooldown, target, adjustValue, fire, endCooldown } = makeCaster();
        healer.healTarget(target as unknown as Enemy);
        expect(healer.heal_timer).toBe(timer);
        expect(healer.states.attack).toBe("casting");

        fire();
        expect(adjustValue).toHaveBeenCalledWith(200 * HEAL_FRACTION, "heal", false);
        expect(healer.states.attack).toBe("primed");
        expect(healer.heal_timer).toBeNull();
        expect(healer.heal_cooldown).toBe(cooldown);

        endCooldown();
        expect(healer.heal_cooldown).toBeNull();
    });

    it("caps the heal (and its combat text) at the target's missing health", () => {
        const { healer, target, adjustValue, fire } = makeCaster();
        target.health.stats.value = 195;
        healer.healTarget(target as unknown as Enemy);
        fire();
        expect(adjustValue).toHaveBeenCalledWith(5, "heal", false);
    });

    it("skips the heal if the target healed to full mid-cast", () => {
        const { healer, target, adjustValue, fire } = makeCaster();
        healer.healTarget(target as unknown as Enemy);
        target.health.stats.value = 200;
        fire();
        expect(adjustValue).not.toHaveBeenCalled();
        expect(healer.heal_cooldown).not.toBeNull();
    });

    it("does not heal if the healer died mid-cast", () => {
        const { healer, target, adjustValue, fire } = makeCaster();
        healer.healTarget(target as unknown as Enemy);
        healer.state = "dead";

        fire();
        expect(adjustValue).not.toHaveBeenCalled();
    });

    it("cleanup removes the heal cooldown", () => {
        const { healer, cooldown, target, fire } = makeCaster();
        const base = vi.spyOn(Enemy.prototype, "cleanup").mockImplementation(() => {});
        healer.healTarget(target as unknown as Enemy);
        fire();

        healer.cleanup();
        expect(cooldown.remove).toHaveBeenCalledWith(false);
        expect(healer.heal_cooldown).toBeNull();
        base.mockRestore();
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
