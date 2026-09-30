import { beforeEach, describe, it, expect, vi } from "vitest";
import AimedShot from "./AimedShot";
import CastingController from "./CastingController";
import Projectile from "@entities/Weapons/Projectile";
import type { CastableSpell } from "./CastingController";
import type { ProjectileTarget } from "@entities/Weapons/Projectile";
import type { TargetType } from "@/types/game";

vi.mock("@entities/Weapons/Projectile", () => ({ default: vi.fn() }));

interface TargetStub extends ProjectileTarget {
    alive: boolean;
    health: { adjustValue: ReturnType<typeof vi.fn> };
}

interface ControllerStub {
    scene: {
        events: { emit: ReturnType<typeof vi.fn> };
        time: { delayedCall: ReturnType<typeof vi.fn> };
        cameras: { main: { getWorldPoint: ReturnType<typeof vi.fn> } };
        selected: TargetStub | null;
    };
    player: {
        x: number;
        y: number;
        alive: boolean;
        idle: ReturnType<typeof vi.fn>;
        moveToWorldPoint: ReturnType<typeof vi.fn>;
    };
    primed: CastableSpell | null;
    pending: { spell: CastableSpell; target: unknown } | null;
    casting: {
        spell: CastableSpell;
        phase: string;
        timer: { remove: ReturnType<typeof vi.fn> };
    } | null;
    request(spell: CastableSpell): void;
    interruptForMove(): void;
}

interface AimedShotStub extends CastableSpell {
    name: string;
    type: string;
    targetKind: "enemy";
    castRange: number;
    castTime: number;
    cooldown: number;
    typedCost: number;
    cooldownDelay: boolean;
    cooldownDelayAll: boolean;
    projectile: { key: string; frame: number; speed: number };
    player: {
        x: number;
        y: number;
        resource: {
            getValue: ReturnType<typeof vi.fn>;
            adjustValue: ReturnType<typeof vi.fn>;
        };
    };
    scene: {
        events: { emit: ReturnType<typeof vi.fn> };
        tweens: { addCounter: ReturnType<typeof vi.fn> };
    };
    button: { out: ReturnType<typeof vi.fn> };
    hasAnimation: boolean;
    setValue: ReturnType<typeof vi.fn>;
    onPrimeCleared(): void;
    effect(target: TargetType): void;
}

function makeController(): ControllerStub {
    const controller = Object.create(CastingController.prototype) as ControllerStub;
    controller.scene = {
        events: { emit: vi.fn() },
        time: { delayedCall: vi.fn(() => ({ remove: vi.fn() })) },
        cameras: { main: { getWorldPoint: vi.fn((x: number, y: number) => ({ x, y })) } },
        selected: null,
    };
    controller.player = {
        x: 0,
        y: 0,
        alive: true,
        idle: vi.fn(),
        moveToWorldPoint: vi.fn(),
    };
    controller.primed = null;
    controller.pending = null;
    controller.casting = null;
    return controller;
}

function makeAimedShot(): AimedShotStub {
    const spell = Object.create(AimedShot.prototype) as AimedShotStub;
    spell.name = "aimedshot";
    spell.type = "physical";
    spell.targetKind = "enemy";
    spell.castRange = 250;
    spell.castTime = 1.25;
    spell.cooldown = 5;
    spell.typedCost = 50;
    spell.cooldownDelay = false;
    spell.cooldownDelayAll = false;
    spell.projectile = { key: "multishot-effect", frame: 0, speed: 500 };
    spell.player = {
        x: 0,
        y: 0,
        resource: { getValue: vi.fn(() => 100), adjustValue: vi.fn() },
    };
    spell.scene = { events: { emit: vi.fn() }, tweens: { addCounter: vi.fn(() => ({})) } };
    spell.button = { out: vi.fn() };
    spell.hasAnimation = false;
    spell.setValue = vi.fn(() => ({ amount: 90, crit: true }));
    return spell;
}

function makeTarget(): TargetStub {
    return {
        x: 100,
        y: 0,
        alive: true,
        health: { adjustValue: vi.fn() },
    };
}

describe("AimedShot", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("launches a homing projectile and applies physical crit damage on impact after its cast", () => {
        const controller = makeController();
        const spell = makeAimedShot();
        const target = makeTarget();
        controller.scene.selected = target;

        controller.request(spell);

        expect(controller.scene.time.delayedCall).toHaveBeenCalledWith(
            1250,
            expect.any(Function),
            [],
            controller
        );
        expect(spell.player.resource.adjustValue).not.toHaveBeenCalled();
        expect(Projectile).not.toHaveBeenCalled();

        const [, completeCast, , context] = controller.scene.time.delayedCall.mock
            .calls[0] as unknown as [number, () => void, unknown[], unknown];
        completeCast.call(context);

        expect(Projectile).toHaveBeenCalledWith(
            expect.objectContaining({
                target,
                key: "multishot-effect",
                speed: 500,
            })
        );
        expect(spell.player.resource.adjustValue).toHaveBeenCalledWith(-50);

        const projectileOptions = vi.mocked(Projectile).mock.calls[0][0];
        projectileOptions.onImpact(target);

        expect(spell.setValue).toHaveBeenCalledWith({ base: 60, key: "attack_power" });
        expect(target.health.adjustValue).toHaveBeenCalledWith(-90, "physical", true);
    });

    it("does not launch or spend Energy when interrupted during the wind-up", () => {
        const controller = makeController();
        const spell = makeAimedShot();
        controller.scene.selected = makeTarget();

        controller.request(spell);
        const timer = controller.casting!.timer;
        controller.interruptForMove();

        expect(timer.remove).toHaveBeenCalledWith(false);
        expect(Projectile).not.toHaveBeenCalled();
        expect(spell.player.resource.adjustValue).not.toHaveBeenCalled();
    });
});
