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

// The coin/enemy readouts are plain containers with a `text` child stashed on
// the instance so the store subscriptions can update it.
type LabelledContainer = GameObjects.Container & { text: GameObjects.Text };

class UI extends GameObjects.Container {
    public spells: number;
    public spacing: number;
    public frames: GameObjects.Sprite[];
    public subscriptions: Array<() => void>;
    public buttons: GameObjects.Sprite[];
    public coins!: LabelledContainer;
    public enemies!: LabelledContainer;
    public save_slot: string;
    public key_handlers: Record<string, () => void>;

    constructor(
        scene: Scene,
        options: {
            showSpellFrames?: boolean;
            showEnemyCount?: boolean;
            showCoinCount?: boolean;
            showReturnToTown?: boolean;
        } = {}
    ) {
        super(scene, 0, 0);

        // The town is a non-combat hub, so it opts out of the spell/ability
        // slots and the whole combat readout — the enemy count and the coin
        // purse; every other scene shows them by default. The return-to-town
        // button is the mirror image: only the biome scenes have somewhere to
        // teleport back from.
        const {
            showSpellFrames = true,
            showEnemyCount = true,
            showCoinCount = true,
            showReturnToTown = false,
        } = options;

        this.spells = 5;
        this.spacing = 60;
        this.frames = [];
        this.subscriptions = [];

        if (showSpellFrames) this.setSpellFrames();
        if (showCoinCount) this.setCoinCount();
        if (showEnemyCount) this.setEnemyCount();
        this.buttons = [this.setInvetoryIcon(), this.setSystemIcon()];
        if (showReturnToTown) this.buttons.push(this.setReturnToTownIcon());

        // Add buttons to this container
        this.buttons.forEach((button) => this.add(button));

        // Position buttons in the bottom right
        const { x, y, width, height } = (this.scene as GameSceneLike).zone;
        Actions.IncXY(this.buttons, x + width, y + height, -35);

        // Maps coins, area progress and showUi sections of the store to various functions.
        this.subscriptions.push(mapStateToData("coins", () => this.renderCoinCount()));
        this.subscriptions.push(mapStateToData("enemiesRemaining", () => this.renderEnemyCount()));
        this.subscriptions.push(mapStateToData("bossActive", () => this.renderEnemyCount()));
        this.subscriptions.push(
            mapStateToData("showUi", (showUi) => {
                store.dispatch(toggleHUD(!showUi));
                showUi ? this.scene.scene.pause() : this.scene.scene.resume();
                this.setButtonsEnabled(!showUi);
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
        this.renderCoinCount();
    }

    // No-ops when the coin purse is intentionally absent (town opts out), so a
    // store-driven coin update cannot touch a container that was never mounted.
    renderCoinCount(): void {
        if (!this.coins) return;
        this.coins.text.setText("Coins: " + store.getState().game.coins);
    }

    setEnemyCount(): void {
        this.enemies = this.scene.add.container(0, 0) as LabelledContainer;
        Display.Align.In.TopRight(this.enemies, (this.scene as GameSceneLike).zone, -190);

        this.enemies.add(this.scene.add.sprite(0, 0, "dungeon", "ghast_baby"));
        this.enemies.text = this.scene.add.text(15, 0, "", styles).setOrigin(0, 0.5);
        this.enemies.add(this.enemies.text);

        this.add(this.enemies);
        this.renderEnemyCount();
    }

    // Counts the area's pool down, then reads BOSS once the boss is up. Both
    // store fields feed this, so it reads them rather than taking an argument.
    renderEnemyCount(): void {
        if (!this.enemies) return;
        const { enemiesRemaining, bossActive } = store.getState().game;
        this.enemies.text.setText(bossActive ? "BOSS" : "Enemies: " + enemiesRemaining);
    }

    setInvetoryIcon(): GameObjects.Sprite {
        return this.scene.add
            .sprite(0, 0, "icon", "icon_0021_charm")
            .setInteractive()
            .setScrollFactor(0)
            .on("pointerdown", () => store.dispatch(toggleUi("equipment")), this);
    }

    // Opens the confirmation screen rather than travelling immediately: leaving
    // abandons the area's progress. The ESC key remains an instant, unconfirmed
    // exit for players who want it.
    setReturnToTownIcon(): GameObjects.Sprite {
        return (
            this.scene.add
                // Placeholder art: the icon atlas has no portal/town frame, so the
                // movement icon stands in until the portal travel screen brings its
                // own artwork.
                .sprite(0, 0, "icon", "icon_0025_dash")
                .setInteractive()
                .setScrollFactor(0)
                .on("pointerdown", () => store.dispatch(toggleUi("confirmReturn")), this)
        );
    }

    setSystemIcon(): GameObjects.Sprite {
        return this.scene.add
            .sprite(0, 0, "icon", "icon_0006_golem")
            .setInteractive()
            .setScrollFactor(0)
            .on("pointerdown", () => store.dispatch(toggleUi("system")), this);
    }

    // Enable or disable all HUD buttons. Called from the showUi subscription so
    // that the inventory and system buttons cannot be pressed through an open
    // overlay window.
    setButtonsEnabled(enabled: boolean): void {
        this.buttons.forEach((button) =>
            enabled ? button.setInteractive() : button.disableInteractive()
        );
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

        // Remove exactly the keyboard listeners registered in the constructor.
        // The scene calls cleanup() from its shutdown(), but on a scene restart
        // Phaser may already have destroyed this container — destroy() clears
        // `this.scene`, and the keyboard plugin went with it, so there is
        // nothing left to detach from. The store unsubscribes above stay
        // unconditional: they are scene-independent, this is the HUD's only
        // cleanup pass, and leaking them is the very thing they exist to stop.
        if (!this.scene) return;
        Object.entries(this.key_handlers).forEach(([event, handler]) => {
            this.scene.input.keyboard!.off(event, handler, this);
        });
    }
}

export default UI;
