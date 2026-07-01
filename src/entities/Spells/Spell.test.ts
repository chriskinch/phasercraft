import { describe, it, expect, vi } from "vitest";
import { Scenes } from "phaser";
import Spell from "./Spell";

// Regression tests for the Phase 2 Spell lifecycle fix (issue #307). Spell
// registers listeners on external emitters that Phaser does not remove on its
// own destroy: scene.events ("spell:disableall"/"spell:enableall"), the player
// resource ("change"), and its SpellButton's pointer + keyboard bindings.
// Because the spell GameObject is not destroyed on scene SHUTDOWN, these would
// accumulate across runs. cleanup() removes them. Tested against the real
// prototype with a constructor-free fake — no Phaser boot — matching the other
// lifecycle tests.

interface SpellUnderTest {
    scene: { events: { off: ReturnType<typeof vi.fn> } };
    player: { resource: { off: ReturnType<typeof vi.fn> } };
    button: { cleanup: ReturnType<typeof vi.fn> };
    cleanup(): void;
}

function makeSpell(): SpellUnderTest {
    const spell = Object.create(Spell.prototype) as SpellUnderTest;
    spell.scene = { events: { off: vi.fn() } };
    spell.player = { resource: { off: vi.fn() } };
    spell.button = { cleanup: vi.fn() };
    return spell;
}

describe("Spell.cleanup", () => {
    it("removes the scene.events listeners it registered, including the SHUTDOWN handler", () => {
        const spell = makeSpell();

        spell.cleanup();

        expect(spell.scene.events.off).toHaveBeenCalledWith(
            "spell:disableall",
            Spell.prototype.killSpell,
            spell
        );
        expect(spell.scene.events.off).toHaveBeenCalledWith(
            "spell:enableall",
            Spell.prototype.monitorSpell,
            spell
        );
        expect(spell.scene.events.off).toHaveBeenCalledWith(
            Scenes.Events.SHUTDOWN,
            Spell.prototype.cleanup,
            spell
        );
    });

    it("removes the resource change listener", () => {
        const spell = makeSpell();

        spell.cleanup();

        expect(spell.player.resource.off).toHaveBeenCalledWith(
            "change",
            Spell.prototype.onResourceChangeHandler,
            spell
        );
    });

    it("delegates button teardown to the SpellButton", () => {
        const spell = makeSpell();

        spell.cleanup();

        expect(spell.button.cleanup).toHaveBeenCalledTimes(1);
    });
});

// Cooldown + resource affordability checks (issue #309). These are pure
// predicate methods plus the enable/disable routing in onResourceChangeHandler.
// Seam: a constructor-free fake whose player.resource.getValue() and
// cooldownTimer.getValue() are stubbed. For onResourceChangeHandler we spy on
// enableSpell/disableSpell to assert the routing without touching button render.
interface CooldownTimerStub {
    getValue: ReturnType<typeof vi.fn>;
}

interface SpellCheckUnderTest {
    typedCost: number;
    cooldown: number;
    cooldownTimer?: CooldownTimerStub;
    player: { resource: { getValue: ReturnType<typeof vi.fn> } };
    enableSpell: ReturnType<typeof vi.fn>;
    disableSpell: ReturnType<typeof vi.fn>;
    checkResource(): boolean;
    checkCooldown(): boolean;
    checkReady(): boolean;
    onResourceChangeHandler(): void;
}

function makeCheckSpell(
    opts: { typedCost?: number; cooldown?: number; resourceValue?: number } = {}
): SpellCheckUnderTest {
    const spell = Object.create(Spell.prototype) as SpellCheckUnderTest;
    spell.typedCost = opts.typedCost ?? 10;
    spell.cooldown = opts.cooldown ?? 5;
    spell.player = {
        resource: { getValue: vi.fn(() => opts.resourceValue ?? 100) },
    };
    spell.enableSpell = vi.fn();
    spell.disableSpell = vi.fn();
    return spell;
}

describe("Spell.checkResource", () => {
    it("is true when the resource covers the cost", () => {
        const spell = makeCheckSpell({ typedCost: 20, resourceValue: 50 });

        expect(spell.checkResource()).toBe(true);
    });

    it("is true when the resource exactly equals the cost", () => {
        const spell = makeCheckSpell({ typedCost: 50, resourceValue: 50 });

        expect(spell.checkResource()).toBe(true);
    });

    it("is false when the resource is below the cost", () => {
        const spell = makeCheckSpell({ typedCost: 60, resourceValue: 50 });

        expect(spell.checkResource()).toBe(false);
    });
});

describe("Spell.checkCooldown", () => {
    it("is ready when no cooldown timer has been created", () => {
        const spell = makeCheckSpell();
        spell.cooldownTimer = undefined;

        expect(spell.checkCooldown()).toBe(true);
    });

    it("is ready when the timer value is falsy (counter at zero)", () => {
        const spell = makeCheckSpell();
        spell.cooldownTimer = { getValue: vi.fn(() => 0) };

        expect(spell.checkCooldown()).toBe(true);
    });

    it("is ready when the counter has reached the full cooldown", () => {
        const spell = makeCheckSpell({ cooldown: 5 });
        spell.cooldownTimer = { getValue: vi.fn(() => 5) };

        expect(spell.checkCooldown()).toBe(true);
    });

    it("is not ready while the counter is mid-cooldown", () => {
        const spell = makeCheckSpell({ cooldown: 5 });
        spell.cooldownTimer = { getValue: vi.fn(() => 2) };

        expect(spell.checkCooldown()).toBe(false);
    });
});

describe("Spell.checkReady", () => {
    it("is ready only when resource and cooldown both pass", () => {
        const spell = makeCheckSpell({ typedCost: 10, resourceValue: 50 });
        spell.cooldownTimer = undefined;

        expect(spell.checkReady()).toBe(true);
    });

    it("is not ready when the resource is insufficient even off cooldown", () => {
        const spell = makeCheckSpell({ typedCost: 80, resourceValue: 50 });
        spell.cooldownTimer = undefined;

        expect(spell.checkReady()).toBe(false);
    });

    it("is not ready when affordable but still on cooldown", () => {
        const spell = makeCheckSpell({ typedCost: 10, cooldown: 5, resourceValue: 50 });
        spell.cooldownTimer = { getValue: vi.fn(() => 2) };

        expect(spell.checkReady()).toBe(false);
    });
});

describe("Spell.onResourceChangeHandler", () => {
    it("enables the spell when it becomes ready", () => {
        const spell = makeCheckSpell({ typedCost: 10, resourceValue: 50 });
        spell.cooldownTimer = undefined;

        spell.onResourceChangeHandler();

        expect(spell.enableSpell).toHaveBeenCalledTimes(1);
        expect(spell.disableSpell).not.toHaveBeenCalled();
    });

    it("disables the spell when it is not ready", () => {
        const spell = makeCheckSpell({ typedCost: 80, resourceValue: 50 });
        spell.cooldownTimer = undefined;

        spell.onResourceChangeHandler();

        expect(spell.disableSpell).toHaveBeenCalledWith("resource change");
        expect(spell.enableSpell).not.toHaveBeenCalled();
    });
});
