import React from "react";
import { useDispatch } from "react-redux";
import { setTravelTo } from "@store/gameReducer";
import { BIOMES, BIOME_IDS } from "@config/biomes";
import Button from "@components/Button";
import styles from "./BiomeSelect.module.css";

// Temporary destination picker shown when leaving town — a dedicated portal
// travel screen replaces it later. Selecting dispatches the travel intent;
// TownScene watches the store and performs the actual scene change.
const BiomeSelect: React.FC = () => {
    const dispatch = useDispatch();

    return (
        <ol className={styles.biomeList}>
            {BIOME_IDS.map((id) => {
                const biome = BIOMES[id];
                return (
                    <li key={id} className={styles.biome}>
                        <div
                            className={styles.swatch}
                            style={{ backgroundColor: biome.backgroundColor }}
                            data-testid={`biome-swatch-${id}`}
                        />
                        <h2 className={styles.name}>{biome.name}</h2>
                        <Button text="Travel" onClick={() => dispatch(setTravelTo(id))} />
                    </li>
                );
            })}
        </ol>
    );
};

export default BiomeSelect;
