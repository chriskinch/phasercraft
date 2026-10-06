import { describe, it, expect, vi, afterEach } from "vitest";
import Healer, {
    HEAL_CAST_MS,
    HEAL_COOLDOWN_MS,
    HEAL_FRACTION,
    HEAL_RANGE,
    HEALER_AGGRO_RADIUS,
    HEALER_CHASE_RADIUS,
} from "./Healer";
import Enemy from "./Enemy";

// Healer target scan and heal cast. Constructor-free fakes on the real prototype.

interface FakeEnemy {
    id: string;
    x: number;
    y: number;
    health: { stats: { max: number; value: number } };
}

function fake(id: string, max: number, value: number, x = 0, y = 0): FakeEnemy {
    return { id, x, y, health: { stats: { max, value } } };
}

function makeHealer(others: FakeEnemy[], self = fake("self", 100, 100), selfAt = 0): Healer {
    const healer = Object.assign(Object.create(Healer.prototype) as Healer, self);
    const members: unknown[] = [...others];
    members.splice(selfAt, 0, healer);
    const children = new Set(members);
    Object.assign(healer, {
        active_group: { children, getChildren: () => Array.from(children) },
    });
    return healer;
}

describe("Healer.getHealTarget", () => {
    it("picks the enemy with the lowest health fraction, not the most missing", () => {
        const half = fake("half", 100, 50);
        const big = fake("big", 400, 300); // missing more, but at 75%
        const c = fake("c", 100, 60);
        expect(makeHealer([big, half, c]).getHealTarget()).toBe(half);
    });

    it("can pick itself when it is the lowest", () => {
        const a = fake("a", 100, 40);
        const healer = makeHealer([a], fake("self", 200, 20), 1);
        expect(healer.getHealTarget()).toBe(healer);
        expect(makeHealer([a], fake("self", 100, 90)).getHealTarget()).toBe(a);
    });

    it("breaks ties to the first in group order", () => {
        const a = fake("a", 100, 90);
        const b = fake("b", 100, 40);
        const c = fake("c", 200, 80);
        expect(makeHealer([a, b, c]).getHealTarget()).toBe(b);
    });

    it("returns undefined when nobody, itself included, is hurt", () => {
        expect(makeHealer([fake("a", 100, 100), fake("b", 50, 80)]).getHealTarget()).toBe(
            undefined
        );
        expect(makeHealer([]).getHealTarget()).toBe(undefined);
    });

    it("skips NaN / undefined health", () => {
        const nan = fake("nan", NaN, 10);
        const undef = { id: "undef", x: 0, y: 0, health: { stats: {} } } as unknown as FakeEnemy;
        const a = fake("a", 100, 10);
        expect(makeHealer([nan, undef, a]).getHealTarget()).toBe(a);
        expect(makeHealer([nan, undef]).getHealTarget()).toBe(undefined);
    });

    it("ignores enemies beyond HEAL_RANGE", () => {
        const far = fake("far", 100, 10, HEAL_RANGE + 1, 0);
        const edge = fake("edge", 100, 60, 0, HEAL_RANGE);
        expect(makeHealer([far, edge]).getHealTarget()).toBe(edge);
        expect(makeHealer([far]).getHealTarget()).toBe(undefined);
    });

    it("skips an enemy another healer is already casting on, until that cast ends", () => {
        const hurt = fake("hurt", 100, 10);
        const less = fake("less", 100, 60);
        const first = makeHealer([hurt, less]);
        Object.assign(first, {
            states: { attack: "primed" },
            castBar: { onStart: vi.fn(), onStop: vi.fn() },
            scene: { time: { addEvent: vi.fn(() => ({ remove: vi.fn() })) } },
        });
        first.healTarget(first.getHealTarget());
        expect(first.heal_target).toBe(hurt);

        const second = makeHealer([hurt, less]);
        expect(second.getHealTarget()).toBe(less);

        first.cancelCast();
        expect(second.getHealTarget()).toBe(hurt);
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
            aggro_radius: HEALER_AGGRO_RADIUS,
            chase_aggro_radius: HEALER_CHASE_RADIUS,
            last_standing: false,
            heal_timer: null,
            heal_cooldown: null,
            castBar: { onStart: vi.fn(), onStop: vi.fn(), cleanup: vi.fn() },
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

    it("hangs back while there is healing to do, and chases the player when there is none", () => {
        const hurt = makeUpdatable("primed", [fake("a", 100, 10)]);
        hurt.healer.update(0, 16);
        expect(hurt.healer.aggro_radius).toBe(HEALER_AGGRO_RADIUS);

        const idle = makeUpdatable("primed", [fake("a", 100, 100)]);
        idle.healer.update(0, 16);
        expect(idle.addEvent).not.toHaveBeenCalled();
        expect(idle.healer.aggro_radius).toBe(HEALER_CHASE_RADIUS);

        const cooling = makeUpdatable("primed", [fake("a", 100, 10)]);
        cooling.healer.heal_cooldown = {} as Phaser.Time.TimerEvent;
        cooling.healer.update(0, 16);
        expect(cooling.healer.aggro_radius).toBe(HEALER_AGGRO_RADIUS);

        const last = makeUpdatable("primed", [fake("a", 100, 10)]);
        Object.assign(last.healer, { last_standing: true, chase_aggro_radius: 400 });
        last.healer.update(0, 16);
        expect(last.healer.aggro_radius).toBe(400);
    });

    it("interrupts a cast in progress when stunned, but not when merely hit", () => {
        const { healer } = makeUpdatable("casting", [fake("a", 100, 10)]);
        const interrupt = vi.spyOn(healer, "interruptHeal");
        healer.heal_timer = { remove: vi.fn() } as unknown as Phaser.Time.TimerEvent;

        healer.update(0, 16);
        expect(interrupt).not.toHaveBeenCalled();

        healer.banes = { stunned: true } as Healer["banes"];
        healer.update(0, 16);
        expect(interrupt).toHaveBeenCalledOnce();
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
        const castBar = { onStart: vi.fn(), onStop: vi.fn(), cleanup: vi.fn() };
        Object.assign(healer, {
            state: "idle",
            states: { movement: "idle", attack: "primed" },
            heal_timer: null,
            heal_cooldown: null,
            castBar,
            scene: { time: { addEvent } },
        });
        return {
            healer,
            castBar,
            timer,
            cooldown,
            target,
            adjustValue,
            fire: () => callback(args[0]),
            endCooldown: () => cooldownDone(),
        };
    }

    it("heals a fraction of the target's max health, then cools down", () => {
        const { healer, castBar, timer, cooldown, target, adjustValue, fire, endCooldown } =
            makeCaster();
        healer.healTarget(target as unknown as Enemy);
        expect(healer.heal_timer).toBe(timer);
        expect(healer.states.attack).toBe("casting");
        expect(castBar.onStart).toHaveBeenCalledWith({ duration: HEAL_CAST_MS / 1000 });

        fire();
        expect(castBar.onStop).toHaveBeenCalledOnce();
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

    it("a stun interrupts the cast: no heal, cast bar hidden, cooldown starts", () => {
        const { healer, castBar, timer, cooldown, target, adjustValue } = makeCaster();
        healer.healTarget(target as unknown as Enemy);

        healer.interruptHeal();
        expect(timer.remove).toHaveBeenCalledWith(false);
        expect(healer.heal_timer).toBeNull();
        expect(healer.heal_target).toBeNull();
        expect(healer.heal_cooldown).toBe(cooldown);
        expect(healer.states.attack).toBe("primed");
        expect(castBar.onStop).toHaveBeenCalledOnce();
        expect(adjustValue).not.toHaveBeenCalled();
    });

    it("death cancels the cast and hides the cast bar", () => {
        const { healer, castBar, timer, target } = makeCaster();
        const base = vi.spyOn(Enemy.prototype, "death").mockImplementation(() => {});
        healer.healTarget(target as unknown as Enemy);

        healer.death();
        expect(timer.remove).toHaveBeenCalledWith(false);
        expect(castBar.onStop).toHaveBeenCalledOnce();
        expect(base).toHaveBeenCalledOnce();
        base.mockRestore();
    });

    it("cleanup releases the cast bar", () => {
        const { healer, castBar } = makeCaster();
        const base = vi.spyOn(Enemy.prototype, "cleanup").mockImplementation(() => {});
        healer.cleanup();
        expect(castBar.cleanup).toHaveBeenCalledOnce();
        base.mockRestore();
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
