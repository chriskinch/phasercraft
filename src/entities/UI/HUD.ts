import { GameObjects, Display, Actions, Scene } from "phaser";
import { toggleHUD, toggleUi, addLoot, loadGame } from "@store/gameReducer";
import store from "@store";
import mapStateToData from "@helpers/mapStateToData";
import { readSave, writeSave, removeSave, SAVE_SLOTS } from "@services/saveStorage";
import type { GameSceneLike } from "@/types/scene";

const styles = {
    font: "12px monospace",
    fill: "#ffffff",
};

// The coin/wave readouts are plain containers with a `text` child stashed on
// the instance so the store subscriptions can update it.
type LabelledContainer = GameObjects.Container & { text: GameObjects.Text };

class UI extends GameObjects.Container {
    public spells: number;
    public spacing: number;
    public frames: GameObjects.Sprite[];
    public subscriptions: Array<() => void>;
    public buttons: GameObjects.Sprite[];
    public coins!: LabelledContainer;
    public wave!: LabelledContainer;
    public save_slot: string;
    public key_handlers: Record<string, () => void>;

    constructor(scene: Scene) {
        super(scene, 0, 0);

        this.spells = 5;
        this.spacing = 60;
        this.frames = [];
        this.subscriptions = [];

        this.setSpellFrames();
        this.setCoinCount();
        this.setWaveCount();
        this.buttons = [this.setInvetoryIcon(), this.setSystemIcon()];

        // Add buttons to this container
        this.buttons.forEach((button) => this.add(button));

        // Position buttons in the bottom right
        const { x, y, width, height } = (this.scene as GameSceneLike).zone;
        Actions.IncXY(this.buttons, x + width, y + height, -35);

        // Maps coins, wave and showUi sections of the store to various functions.
        this.subscriptions.push(
            mapStateToData("coins", (coins) => {
                this.coins.text.setText("Coins: " + coins);
            })
        );
        this.subscriptions.push(
            mapStateToData("wave", (wave) => this.wave.text.setText("Wave: " + wave))
        );
        this.subscriptions.push(
            mapStateToData("showUi", (showUi) => {
                store.dispatch(toggleHUD(!showUi));
                showUi ? this.scene.scene.pause() : this.scene.scene.resume();
            })
        );

        this.save_slot = store.getState().game.saveSlot as string;

        // Keep handler references so cleanup() can remove exactly these
        // listeners rather than every listener bound to the event.
        this.key_handlers = {
            "keyup-P": () => store.dispatch(toggleUi("character")),
            // TEMP KEYBINDS
            // addLoot's action creator types its arg as string, but this debug
            // keybind has always passed a number (masked in the JS original).
            // Preserve the runtime value; type-only cast, not a behaviour change.
            "keyup-R": () =>
                store.dispatch(addLoot(Math.floor(Math.random() * 100) as unknown as string)),
            // Saving
            "keyup-S": () => this.saveGame(),
            "keyup-D": () => this.deleteSaves(),
            "keyup-L": () => this.loadSavedGame(),
        };
        Object.entries(this.key_handlers).forEach(([event, handler]) => {
            scene.input.keyboard!.on(event, handler, this);
        });

        this.scene.add
            .existing(this)
            .setDepth((this.scene as GameSceneLike).depth_group.UI)
            .setScrollFactor(0);
    }

    setSpellFrames(): void {
        let x = Display.Bounds.GetLeft((this.scene as GameSceneLike).zone);
        let y = Display.Bounds.GetBottom((this.scene as GameSceneLike).zone);
        for (let i = 0; i < this.spells; i++) {
            let frame = this.scene.add
                .sprite(x + this.spacing * i, y, "icon", "icon_blank")
                .setAlpha(0.3)
                .setScale(1.5);
            this.add(frame);
            this.frames.push(frame);
        }
    }

    setCoinCount(): void {
        this.coins = this.scene.add.container(0, 0) as LabelledContainer;
        Display.Align.In.TopRight(this.coins, (this.scene as GameSceneLike).zone, -80);

        this.coins.add(this.scene.add.sprite(0, 0, "coin-spin"));
        this.coins.text = this.scene.add.text(15, 0, "Coins: ", styles).setOrigin(0, 0.5);
        this.coins.add(this.coins.text);

        this.add(this.coins);
    }

    setWaveCount(): void {
        this.wave = this.scene.add.container(0, 0) as LabelledContainer;
        Display.Align.In.TopRight(this.wave, (this.scene as GameSceneLike).zone, -190);

        this.wave.add(this.scene.add.sprite(0, 0, "dungeon", "ghast_baby"));
        this.wave.text = this.scene.add
            .text(15, 0, "Wave: " + ((this.scene as GameSceneLike).wave + 1), styles)
            .setOrigin(0, 0.5);
        this.wave.add(this.wave.text);

        this.add(this.wave);
    }

    setInvetoryIcon(): GameObjects.Sprite {
        return this.scene.add
            .sprite(0, 0, "icon", "icon_0021_charm")
            .setInteractive()
            .setScrollFactor(0)
            .on("pointerdown", () => store.dispatch(toggleUi("equipment")), this);
    }

    setSystemIcon(): GameObjects.Sprite {
        return this.scene.add
            .sprite(0, 0, "icon", "icon_0006_golem")
            .setInteractive()
            .setScrollFactor(0)
            .on("pointerdown", () => store.dispatch(toggleUi("system")), this);
    }

    saveGame(): void {
        // The save/storage service swallows quota/privacy-mode write failures so
        // a key handler never crashes the game over a failed save.
        writeSave(this.save_slot, store.getState());
    }

    deleteSaves(): void {
        SAVE_SLOTS.forEach((slot) => removeSave(slot));
    }

    loadSavedGame(): void {
        // Saves persist the root state ({ game: {...} }); loadGame expects the
        // inner game slice, so unwrap .game (matching the Save menu's Load).
        const save_data = readSave(this.save_slot);
        save_data && save_data.game
            ? store.dispatch(loadGame(save_data.game))
            : console.log("NO DATA TO LOAD");
    }

    cleanup(): void {
        // Unsubscribe from all store subscriptions
        this.subscriptions.forEach((unsubscribe) => unsubscribe());
        this.subscriptions = [];

        // Remove exactly the keyboard listeners registered in the constructor
        Object.entries(this.key_handlers).forEach(([event, handler]) => {
            this.scene.input.keyboard!.off(event, handler, this);
        });
    }
}

export default UI;
