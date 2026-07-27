import { Scene } from "phaser";
import store from "@store";
import { readSettings } from "@services/settingsStorage";
import type { PlayerName } from "@entities/Player/AssignClass";
import { DEFAULT_BIOME, type BiomeId } from "@config/biomes";

export interface GameSceneConfig {
    type?: PlayerName;
    // Which biome BiomeScene should build. Absent everywhere else (Town has no
    // biome), so BiomeScene falls back to DEFAULT_BIOME.
    biome?: BiomeId;
}

export default class SelectScene extends Scene {
    private config: GameSceneConfig;

    constructor() {
        super({
            key: "SelectScene",
        });

        this.config = {};
    }

    create(): void {
        // Save the returned unsub function and call one first action.
        // Looks like and infinite loop but actually acts like a "once" event.
        const unsubscribe = store.subscribe(() => {
            if (store.getState().game.character) {
                this.chooseCharacter();
                unsubscribe();
            }
        });
    }

    chooseCharacter(): void {
        const character = store.getState().game.character;
        if (!character) throw Error("No character set!");
        this.config.type = character;
        // "combat" drops the player straight into a biome for faster manual
        // testing; the default lands in the normal entry scene (currently Town).
        if (readSettings().startLocation === "combat") {
            this.scene.start("BiomeScene", { ...this.config, biome: DEFAULT_BIOME });
        } else {
            this.scene.start("TownScene", this.config);
        }
    }
}
