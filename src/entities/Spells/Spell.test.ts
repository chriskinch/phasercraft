import { describe, it, expect, vi } from "vitest";
import { Scenes } from "phaser";
import Spell from "./Spell";
import Projectile from "@entities/Weapons/Projectile";
import { playSfx } from "@services/sfx";

vi.mock("@entities/Weapons/Projectile", () => ({ default: vi.fn() }));
vi.mock("@services/sfx", () => ({ playSfx: vi.fn(() => true) }));
vi.mock("@store", () => ({
    default: { getState: () => ({ game: { stats: { magic_power: 50 } } }) },
}));

// Regression tests for the Phase 2 Spell lifecycle fix (issue #307). Spell
// registers listeners on external emitters that Phaser does not remove on its
// own destroy: scene.events ("spell:disableall"/"spell:enableall"), the player
// resource ("change"), and its SpellButton's pointer + keyboard bindings.
// Because the spell GameObject is not destroyed on scene SHUTDOWN, these would
// accumulate across runs. cleanup() removes them. Tested against the real
// prototype with a constructor-free fake — no Phaser boot — matching the other
// lifecycle tests.

interface SpellUnderTest {
    scene?: { events: { off: ReturnType<typeof vi.fn> } };
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

        expect(spell.scene!.events.off).toHaveBeenCalledWith(
            "spell:disableall",
            Spell.prototype.killSpell,
            spell
        );
        expect(spell.scene!.events.off).toHaveBeenCalledWith(
            "spell:enableall",
            Spell.prototype.monitorSpell,
            spell
        );
        expect(spell.scene!.events.off).toHaveBeenCalledWith(
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

    // Spell is the only entity registered on both SHUTDOWN and DESTROY, so both
    // can fire for one instance. Phaser's destroy() clears `this.scene` after
    // emitting DESTROY, so a surviving SHUTDOWN listener runs against a dead
    // object. Before the guard this threw out of Systems.shutdown and took the
    // whole scene transition with it (crashing biome -> town -> biome).
    it("does not throw when it runs again after the spell was destroyed", () => {
        const spell = makeSpell();

        spell.cleanup();
        // Phaser's destroy() leaves the object in exactly this state.
        spell.scene = undefined;

        expect(() => spell.cleanup()).not.toThrow();
    });

    it("releases nothing further once destroyed — the first pass already did", () => {
        const spell = makeSpell();

        spell.cleanup();
        const offCallsAfterFirstPass = spell.player.resource.off.mock.calls.length;
        const buttonCallsAfterFirstPass = spell.button.cleanup.mock.calls.length;
        spell.scene = undefined;

        spell.cleanup();

        expect(spell.player.resource.off.mock.calls.length).toBe(offCallsAfterFirstPass);
        expect(spell.button.cleanup.mock.calls.length).toBe(buttonCallsAfterFirstPass);
    });

    it("still cleans up fully when destroy has not run", () => {
        const spell = makeSpell();

        spell.cleanup();
        spell.cleanup();

        // Guard only short-circuits post-destroy; repeated live calls stay
        // idempotent-but-effective, as before.
        expect(spell.scene!.events.off).toHaveBeenCalledTimes(6);
        expect(spell.button.cleanup).toHaveBeenCalledTimes(2);
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

// Projectile spells (Fireball, Frostbolt) play the explosion sound when the
// projectile lands, alongside the effect.
describe("Spell.launchProjectile", () => {
    it("plays the explosion sound on impact, not on launch", () => {
        const spell = Object.create(Spell.prototype) as {
            projectile: { key: string; frame: number; speed: number };
            player: { x: number; y: number };
            scene: object;
            hasAnimation: boolean;
            effect: ReturnType<typeof vi.fn>;
            launchProjectile(target: object): void;
        };
        spell.projectile = { key: "fireball-effect", frame: 0, speed: 400 };
        spell.player = { x: 0, y: 0 };
        spell.scene = {};
        spell.hasAnimation = false;
        spell.effect = vi.fn();
        const target = { x: 10, y: 10 };

        spell.launchProjectile(target);
        expect(playSfx).not.toHaveBeenCalled();

        vi.mocked(Projectile).mock.calls[0][0].onImpact(target as never);

        expect(playSfx).toHaveBeenCalledWith("explosion");
        expect(spell.effect).toHaveBeenCalledWith(target);
    });
});

// #387: a spell's learned level scales its power through setValue() only;
// cost and cooldown are untouched by the level.
describe("Spell.setValue level scaling", () => {
    interface LevelledSpell {
        level: 1 | 2 | 3;
        spellType?: string;
        typedCost: number;
        cooldown: number;
        player: { isCritical: () => boolean };
        setLevel(level: 1 | 2 | 3): void;
        setValue(args: { base: number; key: string; reducer?: (v: number) => number }): {
            crit: boolean;
            amount: number;
        };
    }

    function makeLevelled(crit = false): LevelledSpell {
        const spell = Object.create(Spell.prototype) as LevelledSpell;
        spell.level = 1;
        // Fireball's `power` curve is SPELL_LEVEL_POWER.
        spell.spellType = "Fireball";
        spell.typedCost = 20;
        spell.cooldown = 4;
        spell.player = { isCritical: () => crit };
        return spell;
    }

    // base 40, magic_power 50 → 40 + 40 * 0.5 + 50 / 10 = 65 at L1.
    it.each([
        [1, 65],
        [2, 65 * 1.35],
        [3, 65 * 1.8],
    ] as const)("L%i multiplies the scaled amount by the level curve", (level, expected) => {
        const spell = makeLevelled();
        spell.setLevel(level);

        expect(spell.setValue({ base: 40, key: "magic_power" }).amount).toBeCloseTo(expected);
    });

    it("stacks with crit and runs the reducer on the levelled amount", () => {
        const spell = makeLevelled(true);
        spell.setLevel(2);

        const value = spell.setValue({ base: 40, key: "magic_power", reducer: (v) => v / 10 });

        expect(value.crit).toBe(true);
        expect(value.amount).toBeCloseTo((65 * 1.35 * 1.5) / 10);
    });

    it("does not scale a spell without a registry key", () => {
        const spell = makeLevelled();
        spell.spellType = undefined;
        spell.setLevel(3);

        expect(spell.setValue({ base: 40, key: "magic_power" }).amount).toBeCloseTo(65);
    });

    it("leaves cost and cooldown unchanged across levels", () => {
        const spell = makeLevelled();

        spell.setLevel(3);

        expect(spell.typedCost).toBe(20);
        expect(spell.cooldown).toBe(4);
    });
});

// Effects that follow their target (Earth/Mana Shield) anchor on targetCentre():
// the player's body centre, which sits below the sprite origin at HERO_SCALE,
// or a plain target's own position.
describe("Spell.targetCentre", () => {
    function withTarget(target: unknown): Spell {
        const spell = Object.create(Spell.prototype) as Spell;
        Object.defineProperty(spell, "target", { value: target, writable: true });
        return spell;
    }

    it("uses the player's body centre rather than its origin", () => {
        const player = { x: 10, y: 20, centre: () => ({ x: 10, y: 36 }) };
        expect(withTarget(player).targetCentre()).toEqual({ x: 10, y: 36 });
    });

    it("falls back to a plain target's position", () => {
        expect(withTarget({ x: 5, y: 7 }).targetCentre()).toEqual({ x: 5, y: 7 });
    });

    it("is null without a positioned target", () => {
        expect(withTarget(undefined).targetCentre()).toBeNull();
        expect(withTarget(null).targetCentre()).toBeNull();
    });
});
