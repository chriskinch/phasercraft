import React from "react";
import { useDispatch } from "react-redux";
import Button from "@components/Button";
import { requestTravel, toggleUi } from "@store/gameReducer";
import { BIOMES, BIOME_IDS } from "@/scenes/biomes/biomes";
import styles from "./BiomeSelect.module.css";

// Temporary destination picker shown when the player leaves town, to be
// replaced by the dedicated portal travel screen. Picking a biome only records
// the request in the store; TownScene subscribes, clears it and starts the
// scene — the store is the sole bridge to the Phaser side.
const BiomeSelect: React.FC = () => {
    const dispatch = useDispatch();

    return (
        <ol className={styles.biomeList}>
            {BIOME_IDS.map((id) => {
                const biome = BIOMES[id];
                return (
                    <li key={id} className={styles.biome}>
                        <span
                            className={styles.swatch}
                            style={{ background: biome.backgroundColor }}
                            // The swatch is the biome's actual background colour,
                            // so it is decorative — the name below is the label.
                            aria-hidden="true"
                        />
                        <h2 className={styles.name}>{biome.name}</h2>
                        <Button
                            text="Travel"
                            onClick={() => {
                                // Close the overlay FIRST. The HUD's showUi
                                // subscription resumes this scene, and resuming
                                // after the travel request has already queued
                                // scene.start() re-activates a scene that is on
                                // its way out — it then gets stepped once more
                                // with a destroyed player.
                                dispatch(toggleUi("biomeSelect"));
                                dispatch(requestTravel(id));
                            }}
                        />
                    </li>
                );
            })}
        </ol>
    );
};

export default BiomeSelect;
