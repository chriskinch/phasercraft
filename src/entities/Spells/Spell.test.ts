import { describe, it, expect, vi } from "vitest";
import { Scenes } from "phaser";
import Spell from "./Spell";

// Regression tests for the Phase 2 Spell lifecycle fix (issue #307). Spell
// registers listeners on external emitters that Phaser does not remove on its
// own destroy: scene.events ("spell:disableall"/"spell:enableall"), the player
// resource ("change"), and its button + the keyboard. Because the spell
// GameObject is not destroyed on scene SHUTDOWN, these would accumulate across
// runs. cleanup() removes them. Tested against the real prototype with a
// constructor-free fake — no Phaser boot — matching the other lifecycle tests.

interface SpellUnderTest {
    scene: { events: { off: ReturnType<typeof vi.fn> } };
    player: { resource: { off: ReturnType<typeof vi.fn> } };
    button: {
        off: ReturnType<typeof vi.fn>;
        scene: { input: { keyboard: { off: ReturnType<typeof vi.fn> } } };
    };
    hotkey: string;
    cleanup(): void;
}

function makeSpell(): SpellUnderTest {
    const spell = Object.create(Spell.prototype) as SpellUnderTest;
    spell.scene = { events: { off: vi.fn() } };
    spell.player = { resource: { off: vi.fn() } };
    spell.button = {
        off: vi.fn(),
        scene: { input: { keyboard: { off: vi.fn() } } },
    };
    spell.hotkey = "ONE";
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

    it("turns off the button pointer and keyboard listeners", () => {
        const spell = makeSpell();

        spell.cleanup();

        expect(spell.button.off).toHaveBeenCalledWith("pointerover", Spell.prototype.over, spell);
        expect(spell.button.off).toHaveBeenCalledWith("pointerout", Spell.prototype.out, spell);
        expect(spell.button.off).toHaveBeenCalledWith(
            "pointerdown",
            Spell.prototype.setPrimed,
            spell
        );
        expect(spell.button.scene.input.keyboard.off).toHaveBeenCalledWith(
            "keydown-ONE",
            Spell.prototype.setPrimed,
            spell
        );
    });
});
