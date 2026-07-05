import { GameObjects, Display, Scene } from "phaser";
import type { GameSceneLike } from "@/types/scene";

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
    public text: GameObjects.Text;
    private scene: Scene;
    private hotkey: string;
    private onPress: () => void;

    constructor({ scene, icon_name, slot, hotkey, cooldown, onPress }: SpellButtonOptions) {
        this.scene = scene;
        this.hotkey = hotkey;
        this.onPress = onPress;

        this.sprite = scene.add
            .sprite(0, 0, "icon", icon_name)
            .setInteractive()
            .setDepth((scene as GameSceneLike).depth_group.UI)
            .setAlpha(0.4)
            .setScale(1.5)
            .setScrollFactor(0);

        const styles = {
            font: "16px monospace",
            fill: "#ffffff",
            align: "center",
        };
        this.text = scene.add
            .text(-2, -2, cooldown.toString(), styles)
            .setOrigin(0.5)
            .setDepth((scene as GameSceneLike).depth_group.UI)
            .setVisible(false);

        Display.Align.In.BottomLeft(this.sprite, (scene as GameSceneLike).UI.frames[slot]);
        Display.Align.In.Center(this.text, this.sprite, 0, 0);
    }

    handlePress(): void {
        this.onPress();
    }

    over(): void {
        this.sprite.setTint(0x55ff55);
    }

    out(): void {
        this.sprite.setTint();
    }

    primedTint(): void {
        this.sprite.setTint(0xff9955);
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
    }
}

export default SpellButton;
