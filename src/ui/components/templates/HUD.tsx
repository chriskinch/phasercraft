import React from "react";
import { useSelector } from "react-redux";
import StatBar from "@components/StatBar";
import type { RootState } from "@store";
import styles from "./HUD.module.css";

interface Level {
    currentLevel: number;
    xpRemaining: number;
    toNextLevel: number;
}

const HUD: React.FC = () => {
    const level = useSelector((state: RootState) => state.game.level);

    return (
        <div className={styles.hudContainer}>
            <div className={styles.levelInfo}>
                <label>LV {level?.currentLevel}</label>
                <StatBar
                    type="experience"
                    colour={"#eee"}
                    value={level.xpRemaining}
                    max={level.toNextLevel}
                />
            </div>
        </div>
    );
};

export default HUD;
