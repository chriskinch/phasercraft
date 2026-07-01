import { describe, it, expect, vi } from "vitest";
import type { Mock } from "vitest";
import { Scenes } from "phaser";
import CastingController from "./CastingController";
import type { CastableSpell } from "./CastingController";
import type { TargetKind, TargetType } from "@/types/game";

// The controller is the state machine at the heart of the cast flow
// (idle → primed → approaching → casting). Following the project's lifecycle
// test convention it is exercised against the real prototype with
// constructor-free fakes — no Phaser boot.

interface TimerStub {
    remove: ReturnType<typeof vi.fn>;
}

interface SceneStub {
    events: {
        on: ReturnType<typeof vi.fn>;
        off: ReturnType<typeof vi.fn>;
        emit: ReturnType<typeof vi.fn>;
    };
    time: { delayedCall: ReturnType<typeof vi.fn> };
    cameras: { main: { getWorldPoint: ReturnType<typeof vi.fn> } };
    selected: { x: number; y: number; alive: boolean } | null;
}

interface PlayerStub {
    x: number;
    y: number;
    alive: boolean;
    idle: ReturnType<typeof vi.fn>;
    moveToWorldPoint: ReturnType<typeof vi.fn>;
}

interface SpellStub extends CastableSpell {
    checkReady: Mock<() => boolean>;
    castSpell: Mock<(target?: TargetType) => void>;
    onPrimed: Mock<() => void>;
    onPrimeCleared: Mock<() => void>;
    interruptChannel: Mock<() => void>;
}

// Standalone shape (not `extends CastingController`) because the class's
// state fields are private; the fake exposes them for direct inspection.
interface ControllerUnderTest {
    scene: SceneStub;
    player: PlayerStub;
    primed: CastableSpell | null;
    pending: { spell: CastableSpell; target: unknown } | null;
    casting: { spell: CastableSpell; phase: string; timer: TimerStub } | null;
    getState(): string;
    request(spell: CastableSpell): void;
    onGroundTap(pointer: { x: number; y: number }): boolean;
    onPlayerTap(): void;
    onEnemyTap(enemy: { x: number; y: number; alive: boolean }): void;
    interruptForMove(): void;
    onHit(): void;
    notifyDisabled(spell: CastableSpell): void;
    cancelAll(): void;
    update(): void;
    cleanup(): void;
}

function makeTimer(): TimerStub {
    return { remove: vi.fn() };
}

function makeController(): ControllerUnderTest {
    const controller = Object.create(CastingController.prototype) as ControllerUnderTest;
    controller.scene = {
        events: { on: vi.fn(), off: vi.fn(), emit: vi.fn() },
        time: { delayedCall: vi.fn(() => makeTimer()) },
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

function makeSpell(targetKind: TargetKind, overrides: Partial<SpellStub> = {}): SpellStub {
    return {
        name: "test-spell",
        targetKind,
        checkReady: vi.fn(() => true),
        castSpell: vi.fn(),
        onPrimed: vi.fn(),
        onPrimeCleared: vi.fn(),
        interruptChannel: vi.fn(),
        ...overrides,
    };
}

// Fire the callback captured by the delayedCall stub (index defaults to the
// most recent call).
function fireTimer(controller: ControllerUnderTest, index = -1): void {
    const calls = controller.scene.time.delayedCall.mock.calls;
    const call = calls.at(index)!;
    const [, callback, , context] = call as [number, () => void, unknown[], unknown];
    callback.call(context);
}

describe("CastingController.request — instant target kinds", () => {
    it("casts a self spell immediately at the player", () => {
        const controller = makeController();
        const spell = makeSpell("self");

        controller.request(spell);

        expect(spell.castSpell).toHaveBeenCalledWith(controller.player);
        expect(controller.getState()).toBe("idle");
    });

    it("casts a targetless (PBAoE) spell immediately with no target", () => {
        const controller = makeController();
        const spell = makeSpell("none");

        controller.request(spell);

        expect(spell.castSpell).toHaveBeenCalledWith(undefined);
    });

    it("refuses a spell that is not ready", () => {
        const controller = makeController();
        const spell = makeSpell("self", { checkReady: vi.fn(() => false) });

        controller.request(spell);

        expect(spell.castSpell).not.toHaveBeenCalled();
        expect(controller.getState()).toBe("idle");
    });
});

describe("CastingController.request — enemy target kind", () => {
    it("casts at the selected enemy when it is in range", () => {
        const controller = makeController();
        const enemy = { x: 50, y: 0, alive: true };
        controller.scene.selected = enemy;
        const spell = makeSpell("enemy", { castRange: 100 });

        controller.request(spell);

        expect(spell.castSpell).toHaveBeenCalledWith(enemy);
    });

    it("queues an approach when the selected enemy is out of range", () => {
        const controller = makeController();
        const enemy = { x: 500, y: 0, alive: true };
        controller.scene.selected = enemy;
        const spell = makeSpell("enemy", { castRange: 100 });

        controller.request(spell);

        expect(spell.castSpell).not.toHaveBeenCalled();
        expect(controller.getState()).toBe("approaching");
    });

    it("primes when no enemy is selected", () => {
        const controller = makeController();
        const spell = makeSpell("enemy", { castRange: 100 });

        controller.request(spell);

        expect(controller.getState()).toBe("primed");
        expect(spell.onPrimed).toHaveBeenCalled();
        expect(controller.scene.events.emit).toHaveBeenCalledWith("spell:primed", spell);
    });

    it("pressing the primed spell's button again cancels the prime", () => {
        const controller = makeController();
        const spell = makeSpell("enemy", { castRange: 100 });

        controller.request(spell);
        controller.request(spell);

        expect(controller.getState()).toBe("idle");
        expect(spell.onPrimeCleared).toHaveBeenCalled();
        expect(controller.scene.events.emit).toHaveBeenCalledWith("spell:cleared", spell);
    });

    it("pressing a different button while primed switches the prime", () => {
        const controller = makeController();
        const first = makeSpell("enemy", { castRange: 100, name: "first" });
        const second = makeSpell("enemy", { castRange: 100, name: "second" });

        controller.request(first);
        controller.request(second);

        expect(first.onPrimeCleared).toHaveBeenCalled();
        expect(second.onPrimed).toHaveBeenCalled();
        expect(controller.getState()).toBe("primed");
    });
});

describe("CastingController tap routing while primed", () => {
    it("commits a primed enemy spell on an enemy tap", () => {
        const controller = makeController();
        const spell = makeSpell("enemy", { castRange: 100 });
        controller.request(spell);
        const enemy = { x: 10, y: 10, alive: true };

        controller.onEnemyTap(enemy);

        expect(spell.castSpell).toHaveBeenCalledWith(enemy);
    });

    it("clears a primed enemy spell on a ground tap and consumes it", () => {
        const controller = makeController();
        const spell = makeSpell("enemy", { castRange: 100 });
        controller.request(spell);

        const consumed = controller.onGroundTap({ x: 200, y: 200 });

        expect(consumed).toBe(true);
        expect(controller.getState()).toBe("idle");
        expect(spell.castSpell).not.toHaveBeenCalled();
    });

    it("clears a primed enemy spell when the player is tapped", () => {
        const controller = makeController();
        const spell = makeSpell("enemy", { castRange: 100 });
        controller.request(spell);

        controller.onPlayerTap();

        expect(controller.getState()).toBe("idle");
        expect(spell.castSpell).not.toHaveBeenCalled();
    });

    it("places a primed ground spell at the world tap point", () => {
        const controller = makeController();
        const spell = makeSpell("ground", { castRange: 1000 });
        controller.request(spell);

        const consumed = controller.onGroundTap({ x: 80, y: 60 });

        expect(consumed).toBe(true);
        expect(controller.scene.cameras.main.getWorldPoint).toHaveBeenCalledWith(80, 60);
        expect(spell.castSpell).toHaveBeenCalledWith({ x: 80, y: 60 });
    });

    it("places a primed ground spell at a tapped enemy's position", () => {
        const controller = makeController();
        const spell = makeSpell("ground", { castRange: 1000 });
        controller.request(spell);

        controller.onEnemyTap({ x: 30, y: 40, alive: true });

        expect(spell.castSpell).toHaveBeenCalledWith({ x: 30, y: 40 });
    });

    it("does not consume ground taps when idle", () => {
        const controller = makeController();

        expect(controller.onGroundTap({ x: 0, y: 0 })).toBe(false);
    });
});

describe("CastingController approach (walk into range)", () => {
    it("walks toward an out-of-range target and casts on arrival", () => {
        const controller = makeController();
        const enemy = { x: 500, y: 0, alive: true };
        controller.scene.selected = enemy;
        const spell = makeSpell("enemy", { castRange: 100 });
        controller.request(spell);

        controller.update();
        expect(controller.player.moveToWorldPoint).toHaveBeenCalledWith(enemy);
        expect(spell.castSpell).not.toHaveBeenCalled();

        controller.player.x = 450;
        controller.update();
        expect(controller.player.idle).toHaveBeenCalled();
        expect(spell.castSpell).toHaveBeenCalledWith(enemy);
        expect(controller.getState()).toBe("idle");
    });

    it("abandons the approach when the target dies", () => {
        const controller = makeController();
        const enemy = { x: 500, y: 0, alive: true };
        controller.scene.selected = enemy;
        const spell = makeSpell("enemy", { castRange: 100 });
        controller.request(spell);

        enemy.alive = false;
        controller.update();

        expect(controller.getState()).toBe("idle");
        expect(spell.castSpell).not.toHaveBeenCalled();
        expect(controller.scene.events.emit).toHaveBeenCalledWith("spell:cleared", spell);
    });

    it("retargets a queued enemy cast when another enemy is tapped", () => {
        const controller = makeController();
        const first = { x: 500, y: 0, alive: true };
        controller.scene.selected = first;
        const spell = makeSpell("enemy", { castRange: 100 });
        controller.request(spell);

        const second = { x: 50, y: 0, alive: true };
        controller.onEnemyTap(second);
        controller.update();

        expect(spell.castSpell).toHaveBeenCalledWith(second);
    });

    it("a move command cancels the queued approach", () => {
        const controller = makeController();
        const enemy = { x: 500, y: 0, alive: true };
        controller.scene.selected = enemy;
        const spell = makeSpell("enemy", { castRange: 100 });
        controller.request(spell);

        controller.interruptForMove();

        expect(controller.getState()).toBe("idle");
        expect(spell.castSpell).not.toHaveBeenCalled();
    });
});

describe("CastingController wind-up casts", () => {
    it("schedules the cast on the scene clock and roots the player", () => {
        const controller = makeController();
        const spell = makeSpell("self", { castTime: 1.5 });

        controller.request(spell);

        expect(controller.player.idle).toHaveBeenCalled();
        expect(controller.scene.time.delayedCall).toHaveBeenCalledWith(
            1500,
            expect.any(Function),
            [],
            controller
        );
        expect(controller.getState()).toBe("casting");
        expect(controller.scene.events.emit).toHaveBeenCalledWith("spell:castbar:start", {
            spell,
            duration: 1.5,
        });
        expect(spell.castSpell).not.toHaveBeenCalled();
    });

    it("fires the spell when the wind-up completes", () => {
        const controller = makeController();
        const spell = makeSpell("self", { castTime: 1 });
        controller.request(spell);

        fireTimer(controller);

        expect(spell.castSpell).toHaveBeenCalledWith(controller.player);
        expect(controller.scene.events.emit).toHaveBeenCalledWith("spell:castbar:stop", {
            spell,
            completed: true,
        });
        expect(controller.getState()).toBe("idle");
    });

    it("a move command interrupts the wind-up without casting", () => {
        const controller = makeController();
        const spell = makeSpell("self", { castTime: 1 });
        controller.request(spell);
        const timer = controller.casting!.timer;

        controller.interruptForMove();

        expect(timer.remove).toHaveBeenCalled();
        expect(spell.castSpell).not.toHaveBeenCalled();
        expect(controller.scene.events.emit).toHaveBeenCalledWith("spell:castbar:stop", {
            spell,
            completed: false,
        });
        expect(controller.scene.events.emit).toHaveBeenCalledWith("spell:interrupted", spell);
        expect(controller.getState()).toBe("idle");
    });

    it("taking a hit interrupts the wind-up", () => {
        const controller = makeController();
        const spell = makeSpell("self", { castTime: 1 });
        controller.request(spell);

        controller.onHit();

        expect(spell.castSpell).not.toHaveBeenCalled();
        expect(controller.getState()).toBe("idle");
    });

    it("taking a hit does not break a queued approach", () => {
        const controller = makeController();
        const enemy = { x: 500, y: 0, alive: true };
        controller.scene.selected = enemy;
        const spell = makeSpell("enemy", { castRange: 100 });
        controller.request(spell);

        controller.onHit();

        expect(controller.getState()).toBe("approaching");
    });

    it("pressing the casting spell's button again is a plain cancel", () => {
        const controller = makeController();
        const spell = makeSpell("self", { castTime: 1 });
        controller.request(spell);

        controller.request(spell);

        expect(spell.castSpell).not.toHaveBeenCalled();
        expect(controller.getState()).toBe("idle");
    });

    it("pressing another button interrupts the cast and starts the new one", () => {
        const controller = makeController();
        const first = makeSpell("self", { castTime: 1, name: "first" });
        const second = makeSpell("self", { name: "second" });
        controller.request(first);

        controller.request(second);

        expect(first.castSpell).not.toHaveBeenCalled();
        expect(second.castSpell).toHaveBeenCalledWith(controller.player);
    });

    it("does not fire when the target dies during the wind-up", () => {
        const controller = makeController();
        const enemy = { x: 10, y: 0, alive: true };
        controller.scene.selected = enemy;
        const spell = makeSpell("enemy", { castRange: 100, castTime: 1 });
        controller.request(spell);

        enemy.alive = false;
        fireTimer(controller);

        expect(spell.castSpell).not.toHaveBeenCalled();
        expect(controller.scene.events.emit).toHaveBeenCalledWith("spell:interrupted", spell);
    });

    it("does not fire when the resource drained during the wind-up", () => {
        const controller = makeController();
        const spell = makeSpell("self", { castTime: 1 });
        controller.request(spell);

        spell.checkReady.mockReturnValue(false);
        fireTimer(controller);

        expect(spell.castSpell).not.toHaveBeenCalled();
    });
});

describe("CastingController channels", () => {
    it("casts immediately and holds the casting state for the channel", () => {
        const controller = makeController();
        const spell = makeSpell("enemy", { castRange: 100, channelDuration: 5 });
        const enemy = { x: 10, y: 0, alive: true };
        controller.scene.selected = enemy;

        controller.request(spell);

        expect(spell.castSpell).toHaveBeenCalledWith(enemy);
        expect(controller.getState()).toBe("casting");
        expect(controller.scene.events.emit).toHaveBeenCalledWith("spell:castbar:start", {
            spell,
            duration: 5,
        });
    });

    it("breaking the channel notifies the spell", () => {
        const controller = makeController();
        const spell = makeSpell("enemy", { castRange: 100, channelDuration: 5 });
        controller.scene.selected = { x: 10, y: 0, alive: true };
        controller.request(spell);

        controller.onHit();

        expect(spell.interruptChannel).toHaveBeenCalled();
        expect(controller.getState()).toBe("idle");
    });

    it("a completed channel just returns to idle", () => {
        const controller = makeController();
        const spell = makeSpell("enemy", { castRange: 100, channelDuration: 5 });
        controller.scene.selected = { x: 10, y: 0, alive: true };
        controller.request(spell);

        fireTimer(controller);

        expect(spell.interruptChannel).not.toHaveBeenCalled();
        expect(controller.getState()).toBe("idle");
    });
});

describe("CastingController ground reticle", () => {
    interface ReticleStub {
        show: ReturnType<typeof vi.fn>;
        hide: ReturnType<typeof vi.fn>;
        placeAt: ReturnType<typeof vi.fn>;
        cleanup: ReturnType<typeof vi.fn>;
    }

    function withReticle(controller: ControllerUnderTest): ReticleStub {
        const reticle = { show: vi.fn(), hide: vi.fn(), placeAt: vi.fn(), cleanup: vi.fn() };
        (controller as unknown as { reticle: ReticleStub }).reticle = reticle;
        return reticle;
    }

    it("shows the ring with the spell's radius while a ground spell is primed", () => {
        const controller = makeController();
        const reticle = withReticle(controller);
        const spell = makeSpell("ground", { castRange: 1000, aoeRadius: 25 });

        controller.request(spell);

        expect(reticle.show).toHaveBeenCalledWith(25);
    });

    it("hides the ring when the prime clears", () => {
        const controller = makeController();
        const reticle = withReticle(controller);
        const spell = makeSpell("ground", { castRange: 1000 });
        controller.request(spell);

        controller.request(spell); // toggle off

        expect(reticle.hide).toHaveBeenCalled();
    });

    it("flashes the ring at the committed placement point", () => {
        const controller = makeController();
        const reticle = withReticle(controller);
        const spell = makeSpell("ground", { castRange: 1000 });
        controller.request(spell);

        controller.onGroundTap({ x: 80, y: 60 });

        expect(reticle.placeAt).toHaveBeenCalledWith({ x: 80, y: 60 });
    });

    it("does not show the ring for enemy-target primes", () => {
        const controller = makeController();
        const reticle = withReticle(controller);
        const spell = makeSpell("enemy", { castRange: 100 });

        controller.request(spell);

        expect(reticle.show).not.toHaveBeenCalled();
    });
});

describe("CastingController.notifyDisabled", () => {
    it("clears the prime when the primed spell is disabled", () => {
        const controller = makeController();
        const spell = makeSpell("enemy", { castRange: 100 });
        controller.request(spell);

        controller.notifyDisabled(spell);

        expect(controller.getState()).toBe("idle");
    });

    it("ignores spells that are not in flight", () => {
        const controller = makeController();
        const primed = makeSpell("enemy", { castRange: 100, name: "primed" });
        const other = makeSpell("enemy", { castRange: 100, name: "other" });
        controller.request(primed);

        controller.notifyDisabled(other);

        expect(controller.getState()).toBe("primed");
    });
});

describe("CastingController.cleanup", () => {
    it("removes its scene listeners and kills any live cast timer", () => {
        const controller = makeController();
        const spell = makeSpell("self", { castTime: 1 });
        controller.request(spell);
        const timer = controller.casting!.timer;

        controller.cleanup();

        expect(controller.scene.events.off).toHaveBeenCalledWith(
            "pointerdown:enemy",
            CastingController.prototype.onEnemyTap,
            controller
        );
        expect(controller.scene.events.off).toHaveBeenCalledWith(
            "pointerdown:player",
            CastingController.prototype.onPlayerTap,
            controller
        );
        expect(controller.scene.events.off).toHaveBeenCalledWith(
            "keypress:esc",
            CastingController.prototype.cancelAll,
            controller
        );
        expect(controller.scene.events.off).toHaveBeenCalledWith(
            "player:hit",
            CastingController.prototype.onHit,
            controller
        );
        expect(controller.scene.events.off).toHaveBeenCalledWith(
            Scenes.Events.SHUTDOWN,
            CastingController.prototype.cleanup,
            controller
        );
        expect(timer.remove).toHaveBeenCalled();
        expect(controller.getState()).toBe("idle");
    });

    it("is idempotent", () => {
        const controller = makeController();

        controller.cleanup();
        controller.cleanup();

        expect(controller.getState()).toBe("idle");
    });
});
