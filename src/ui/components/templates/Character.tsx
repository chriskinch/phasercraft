import React from "react";
import { useSelector } from "react-redux";
import Slot from "@components/Slot";
import DetailedLoot from "@components/DetailedLoot";
import GroupedAttributes from "@components/GroupedAttributes";
import StatBar from "@components/StatBar";
import theme from "@ui/themes.module.css";
import type { RootState } from "@store";
import styles from "./Character.module.css";

const Character: React.FC = () => {
    const {
        character,
        equipment: { amulet, body, helm, weapon },
        stats,
        stats: { resource_type },
        level,
    } = useSelector((state: RootState) => state.game);

    return (
        <div className={styles.characterContainer}>
            <section>
                <div className={styles.characterLevel}>
                    <h2>Level {level.currentLevel}</h2>
                    <StatBar
                        type="experience"
                        colour={"#eee"}
                        label={"XP"}
                        value={level.xpRemaining}
                        max={level.toNextLevel}
                    />
                </div>
                <div className={styles.characterResources}>
                    <img src={`ui/player/${character}.gif`} alt="This is you!" />
                    <StatBar type={"health"} label={"HP"} value={stats.health_max || 0} />
                    <StatBar
                        type={resource_type || "mana"}
                        label={"RP"}
                        value={stats.resource_max || 0}
                    />
                </div>
                <GroupedAttributes stats={stats} />
            </section>
            <section className={`${theme.pixelEmboss} ${styles.equipmentDisplay}`}>
                <Slot
                    loot={helm}
                    component={({ loot, compare }) => (
                        <DetailedLoot id="helm" loot={loot} compare={compare} />
                    )}
                />
                <Slot
                    loot={body}
                    component={({ loot, compare }) => (
                        <DetailedLoot id="body" loot={loot} compare={compare} />
                    )}
                />
                <Slot
                    loot={weapon}
                    component={({ loot, compare }) => (
                        <DetailedLoot id="weapon" loot={loot} compare={compare} />
                    )}
                />
                <Slot
                    loot={amulet}
                    component={({ loot, compare }) => (
                        <DetailedLoot id="amulet" loot={loot} compare={compare} />
                    )}
                />
            </section>
        </div>
    );
};

export default Character;
