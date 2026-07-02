import { describe, it, expect, vi } from "vitest";
import SpellButton from "./SpellButton";

// SpellButton owns the spell's HUD input bindings (pointer events on its
// sprite + the hotkey on the scene keyboard). Like the other lifecycle tests,
// it is exercised against the real prototype with a constructor-free fake so
// no Phaser boot is needed.

interface ButtonUnderTest {
    sprite: {
        on: ReturnType<typeof vi.fn>;
        off: ReturnType<typeof vi.fn>;
        setTint: ReturnType<typeof vi.fn>;
        setAlpha: ReturnType<typeof vi.fn>;
    };
    text: {
        setVisible: ReturnType<typeof vi.fn>;
        setText: ReturnType<typeof vi.fn>;
    };
    scene: { input: { keyboard: { on: ReturnType<typeof vi.fn>; off: ReturnType<typeof vi.fn> } } };
    hotkey: string;
    onPress: ReturnType<typeof vi.fn>;
    handlePress(): void;
    setEvents(state: "on" | "off"): void;
    setEnabled(enabled: boolean): void;
    showCooldown(): void;
    setCooldownText(seconds: number): void;
    hideCooldown(): void;
    cleanup(): void;
}

function makeButton(): ButtonUnderTest {
    const button = Object.create(SpellButton.prototype) as ButtonUnderTest;
    button.sprite = {
        on: vi.fn(),
        off: vi.fn(),
        setTint: vi.fn(),
        setAlpha: vi.fn(),
    };
    button.text = {
        setVisible: vi.fn(),
        setText: vi.fn(),
    };
    button.scene = { input: { keyboard: { on: vi.fn(), off: vi.fn() } } };
    button.hotkey = "ONE";
    button.onPress = vi.fn();
    return button;
}

describe("SpellButton.setEvents", () => {
    it("registers pointer and hotkey listeners when turned on", () => {
        const button = makeButton();

        button.setEvents("on");

        expect(button.sprite.on).toHaveBeenCalledWith(
            "pointerover",
            SpellButton.prototype.over,
            button
        );
        expect(button.sprite.on).toHaveBeenCalledWith(
            "pointerout",
            SpellButton.prototype.out,
            button
        );
        expect(button.sprite.on).toHaveBeenCalledWith(
            "pointerdown",
            SpellButton.prototype.handlePress,
            button
        );
        expect(button.scene.input.keyboard.on).toHaveBeenCalledWith(
            "keydown-ONE",
            SpellButton.prototype.handlePress,
            button
        );
    });

    it("removes the same listeners when turned off", () => {
        const button = makeButton();

        button.setEvents("off");

        expect(button.sprite.off).toHaveBeenCalledWith(
            "pointerdown",
            SpellButton.prototype.handlePress,
            button
        );
        expect(button.scene.input.keyboard.off).toHaveBeenCalledWith(
            "keydown-ONE",
            SpellButton.prototype.handlePress,
            button
        );
    });
});

describe("SpellButton.cleanup", () => {
    it("removes all input listeners", () => {
        const button = makeButton();

        button.cleanup();

        expect(button.sprite.off).toHaveBeenCalledWith(
            "pointerover",
            SpellButton.prototype.over,
            button
        );
        expect(button.sprite.off).toHaveBeenCalledWith(
            "pointerout",
            SpellButton.prototype.out,
            button
        );
        expect(button.sprite.off).toHaveBeenCalledWith(
            "pointerdown",
            SpellButton.prototype.handlePress,
            button
        );
        expect(button.scene.input.keyboard.off).toHaveBeenCalledWith(
            "keydown-ONE",
            SpellButton.prototype.handlePress,
            button
        );
    });
});

describe("SpellButton presentation", () => {
    it("invokes the owner's onPress callback when pressed", () => {
        const button = makeButton();

        button.handlePress();

        expect(button.onPress).toHaveBeenCalledTimes(1);
    });

    it("dims and brightens the sprite with enabled state", () => {
        const button = makeButton();

        button.setEnabled(true);
        expect(button.sprite.setAlpha).toHaveBeenCalledWith(1);

        button.setEnabled(false);
        expect(button.sprite.setAlpha).toHaveBeenCalledWith(0.4);
    });

    it("shows, updates and hides the cooldown text", () => {
        const button = makeButton();

        button.showCooldown();
        expect(button.text.setVisible).toHaveBeenCalledWith(true);

        button.setCooldownText(3);
        expect(button.text.setText).toHaveBeenCalledWith("3");

        button.hideCooldown();
        expect(button.text.setVisible).toHaveBeenCalledWith(false);
    });
});
