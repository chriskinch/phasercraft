import { Scene } from "phaser";
import store from "@store";
import { readSettings } from "@services/settingsStorage";
import type { PlayerName } from "@entities/Player/AssignClass";
import { DEFAULT_BIOME, type BiomeId } from "@/scenes/biomes/biomes";

export interface GameSceneConfig {
    type?: PlayerName;
    // Which biome to load when starting BiomeScene. Absent means the default.
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
        // "combat" drops the player straight into the default biome for faster
        // manual testing; the default lands in the normal entry scene (Town).
        if (readSettings().startLocation === "combat") {
            this.scene.start("BiomeScene", { ...this.config, biome: DEFAULT_BIOME });
            return;
        }
        this.scene.start("TownScene", this.config);
    }
}
