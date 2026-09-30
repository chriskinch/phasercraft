import { describe, it, expect, vi, beforeEach } from "vitest";
import AimedShot from "./AimedShot";
import CastingController from "./CastingController";
import Projectile from "@entities/Weapons/Projectile";
import type { SpellOptions } from "@/types/game";

vi.mock("@entities/Weapons/Projectile", () => ({ default: vi.fn() }));
vi.mock("@services/sfx", () => ({ playSfx: vi.fn(() => true) }));

// The Spell base is a Phaser Sprite that wires buttons, animations and scene
// listeners. Swap it for a plain class that applies the config but keeps the
// real cast/launch path, so AimedShot's defaults drive the actual flow.
vi.mock("./Spell", async (importActual) => {
    const actual = (await importActual()) as { default: { prototype: object } };
    class SpellStub {
        constructor(config: Record<string, unknown>) {
            Object.assign(this, config);
        }
    }
    const proto = actual.default.prototype as Record<string, unknown>;
    Object.assign(SpellStub.prototype, {
        castSpell: proto.castSpell,
        launchProjectile: proto.launchProjectile,
    });
    return { default: SpellStub };
});

interface Harness {
    spell: AimedShot;
    controller: CastingController;
    enemy: { x: number; y: number; alive: boolean; select: ReturnType<typeof vi.fn> };
    adjustResource: ReturnType<typeof vi.fn>;
    timers: Array<{ cb: () => void; ctx: unknown; remove: ReturnType<typeof vi.fn> }>;
}

function makeHarness(): Harness {
    const timers: Harness["timers"] = [];
    const enemy = { x: 200, y: 0, alive: true, select: vi.fn() };
    const scene = {
        events: { on: vi.fn(), off: vi.fn(), emit: vi.fn() },
        time: {
            delayedCall: vi.fn((_ms: number, cb: () => void, _args: unknown[], ctx: unknown) => {
                const timer = { cb, ctx, remove: vi.fn() };
                timers.push(timer);
                return timer;
            }),
        },
        cameras: { main: { getWorldPoint: vi.fn((x: number, y: number) => ({ x, y })) } },
        selected: enemy,
    };
    const adjustResource = vi.fn();
    const player = {
        x: 0,
        y: 0,
        alive: true,
        idle: vi.fn(),
        moveToWorldPoint: vi.fn(),
        resource: { adjustValue: adjustResource },
    };
    const spell = new AimedShot({ player, scene } as unknown as SpellOptions);
    Object.assign(spell, {
        typedCost: 50,
        checkReady: vi.fn(() => true),
        onPrimed: vi.fn(),
        onPrimeCleared: vi.fn(),
        setCooldown: vi.fn(),
    });

    const controller = Object.create(CastingController.prototype) as CastingController;
    Object.assign(controller, { scene, player, primed: null, pending: null, casting: null });
    return { spell, controller, enemy, adjustResource, timers };
}

describe("AimedShot", () => {
    beforeEach(() => vi.mocked(Projectile).mockClear());

    it("declares an enemy-targeted wind-up with a homing projectile", () => {
        const { spell } = makeHarness();
        expect(spell.targetKind).toBe("enemy");
        expect(spell.castTime).toBeGreaterThan(0);
        expect(spell.castRange).toBeGreaterThan(0);
        expect(spell.projectile).toBeDefined();
    });

    it("on cast completion spawns a projectile at the target and charges the resource", () => {
        const { spell, controller, enemy, adjustResource, timers } = makeHarness();

        controller.request(spell);
        expect(Projectile).not.toHaveBeenCalled();
        expect(adjustResource).not.toHaveBeenCalled();

        const { cb, ctx } = timers.at(-1)!;
        cb.call(ctx);

        expect(Projectile).toHaveBeenCalledTimes(1);
        expect(vi.mocked(Projectile).mock.calls[0][0].target).toBe(enemy);
        expect(adjustResource).toHaveBeenCalledWith(-50);
    });

    it("interrupted mid-cast spawns no projectile and spends no resource", () => {
        const { spell, controller, adjustResource, timers } = makeHarness();

        controller.request(spell);
        controller.interruptForMove();

        expect(timers.at(-1)!.remove).toHaveBeenCalled();
        expect(Projectile).not.toHaveBeenCalled();
        expect(adjustResource).not.toHaveBeenCalled();
    });

    it("deals physical, crit-flagged damage from attack_power on impact", () => {
        const { spell } = makeHarness();
        const setValue = vi.fn(() => ({ amount: 120, crit: true }));
        Object.assign(spell, { setValue });
        const target = { health: { adjustValue: vi.fn() } };

        spell.effect(target as never);

        expect(setValue).toHaveBeenCalledWith({ base: 60, key: "attack_power" });
        expect(target.health.adjustValue).toHaveBeenCalledWith(-120, "physical", true);
    });
});
