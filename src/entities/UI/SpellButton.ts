import { GameObjects, Display, Scene } from "phaser";
import type { GameSceneLike } from "@/types/scene";
import { HUD_LAYOUT } from "@entities/UI/HUD";
import { FONTS, pixelFontSize } from "@config/fonts";
import type UI from "@entities/UI/HUD";

export interface SpellButtonOptions {
    scene: Scene;
    icon_name: string;
    slot: number;
    hotkey: string;
    cooldown: number;
    onPress: () => void;
}

// HUD icon button for a spell: the interactive icon sprite aligned into a HUD
// frame slot, its cooldown countdown text, hover/primed tints, and the pointer
// + hotkey bindings. Purely presentational — enabled/primed/cooldown state
// stays with the owner, which drives this through the public methods.
class SpellButton {
    public sprite: GameObjects.Sprite;
    public text: GameObjects.BitmapText;
    private scene: Scene;
    private hud: UI;
    private slot: number;
    private hotkey: string;
    private onPress: () => void;
    private primed = false;

    constructor({ scene, icon_name, slot, hotkey, cooldown, onPress }: SpellButtonOptions) {
        this.scene = scene;
        this.hud = (scene as GameSceneLike).UI;
        this.slot = slot;
        this.hotkey = hotkey;
        this.onPress = onPress;

        this.sprite = scene.add
            .sprite(0, 0, "icon", icon_name)
            .setInteractive()
            .setDepth((scene as GameSceneLike).depth_group.UI)
            .setAlpha(0.4)
            .setScale(1.5)
            .setScrollFactor(0);

        this.text = scene.add
            .bitmapText(-2, -2, FONTS.plain, cooldown.toString(), pixelFontSize(3))
            .setOrigin(0.5)
            .setDepth((scene as GameSceneLike).depth_group.UI)
            .setScrollFactor(0)
            .setVisible(false);

        this.align();
        // Follow the frame slot when the HUD re-lays out (resize / safe-area
        // change). The HUD is an external emitter, so cleanup() removes this.
        this.hud.on(HUD_LAYOUT, this.align, this);
    }

    align(): void {
        Display.Align.In.BottomLeft(this.sprite, this.hud.frames[this.slot]);
        Display.Align.In.Center(this.text, this.sprite, 0, 0);
    }

    handlePress(): void {
        this.onPress();
    }

    over(): void {
        this.sprite.setTint(0x55ff55);
    }

    out(): void {
        if (!this.primed) this.sprite.setTint();
    }

    primedTint(): void {
        this.primed = true;
        this.sprite.setTint(0x55ff55);
    }

    clearPrimed(): void {
        this.primed = false;
        this.out();
    }

    setEnabled(enabled: boolean): void {
        this.sprite.setAlpha(enabled ? 1 : 0.4);
    }

    setEvents(state: "on" | "off"): void {
        this.sprite[state]("pointerover", this.over, this);
        this.sprite[state]("pointerout", this.out, this);
        this.sprite[state]("pointerdown", this.handlePress, this);
        if (this.scene.input.keyboard) {
            this.scene.input.keyboard[state](`keydown-${this.hotkey}`, this.handlePress, this);
        }
    }

    showCooldown(): void {
        this.text.setVisible(true);
    }

    setCooldownText(seconds: number): void {
        this.text.setText(seconds.toString());
    }

    hideCooldown(): void {
        this.text.setVisible(false);
    }

    cleanup(): void {
        // Idempotent: off() is a no-op when the listener is already gone.
        this.setEvents("off");
        this.hud.off(HUD_LAYOUT, this.align, this);
    }

    // Release listeners and remove the icon + countdown text, for a spell taken
    // off the HUD mid-scene (scene shutdown destroys the display list itself).
    destroy(): void {
        this.cleanup();
        this.sprite.destroy();
        this.text.destroy();
    }
}

export default SpellButton;
