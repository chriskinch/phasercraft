import { describe, it, expect, vi } from "vitest";
import Healer from "./Healer";
import Enemy from "./Enemy";

// Healer heal-cast lifecycle: the 3s heal timer is stored, released in
// cleanup(), and a healer that died mid-cast doesn't land the heal.
// Constructor-free fake on the real prototype.

vi.mock("@entities/UI/SelectionRing", () => ({ default: { for: vi.fn() } }));

type Callback = (target: unknown) => void;

interface HealerUnderTest {
    state: string;
    states: { attack: string };
    heal_timer: { remove: ReturnType<typeof vi.fn> } | null;
    getHealTarget: () => unknown;
    scene: { time: { addEvent: ReturnType<typeof vi.fn> } };
    healTarget(): void;
    cleanup(): void;
}

function makeHealer() {
    const healer = Object.create(Healer.prototype) as HealerUnderTest;
    const timer = { remove: vi.fn() };
    let callback: Callback = () => {};
    let args: unknown[] = [];
    healer.state = "spawned";
    healer.states = { attack: "primed" };
    healer.heal_timer = null;
    const target = { state: "spawned", health: { adjustValue: vi.fn() } };
    healer.getHealTarget = () => target;
    healer.scene = {
        time: {
            addEvent: vi.fn((config: { callback: Callback; args: unknown[] }) => {
                callback = config.callback;
                args = config.args;
                return timer;
            }),
        },
    };
    return { healer, timer, target, fire: () => callback(args[0]) };
}

describe("Healer.healTarget", () => {
    it("stores the heal timer and heals the target when it fires", () => {
        const { healer, timer, target, fire } = makeHealer();
        healer.healTarget();
        expect(healer.heal_timer).toBe(timer);
        expect(healer.states.attack).toBe("casting");

        fire();
        expect(target.health.adjustValue).toHaveBeenCalledWith(50, "magic_power", false);
        expect(healer.states.attack).toBe("primed");
        expect(healer.heal_timer).toBeNull();
    });

    it("does not heal if the healer died mid-cast", () => {
        const { healer, target, fire } = makeHealer();
        healer.healTarget();
        healer.state = "dead";

        fire();
        expect(target.health.adjustValue).not.toHaveBeenCalled();
    });
});

describe("Healer.cleanup", () => {
    it("removes the pending heal timer, then runs Enemy.cleanup", () => {
        const { healer, timer } = makeHealer();
        const base = vi.spyOn(Enemy.prototype, "cleanup").mockImplementation(() => {});
        healer.healTarget();

        healer.cleanup();
        expect(timer.remove).toHaveBeenCalledWith(false);
        expect(healer.heal_timer).toBeNull();
        expect(base).toHaveBeenCalledOnce();

        expect(() => healer.cleanup()).not.toThrow();
        expect(timer.remove).toHaveBeenCalledOnce();
        base.mockRestore();
    });
});
