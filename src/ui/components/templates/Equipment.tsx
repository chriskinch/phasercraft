import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { sellLoot } from "@store/gameReducer";
import Button from "@components/Button";
import Inventory from "@components/Inventory";
import DroppableSlot from "@components/DroppableSlot";
import GroupedAttributes from "@components/GroupedAttributes";
import StatBar from "@components/StatBar";
import type { RootState } from "@store";
import theme from "@ui/themes.module.css";
import styles from "./Equipment.module.css";

const Equipment: React.FC = () => {
    const dispatch = useDispatch();
    const {
        character,
        equipment,
        equipment: { amulet, body, helm, weapon },
        stats,
        stats: { resource_type },
        level,
        selected,
        inventory,
    } = useSelector((state: RootState) => state.game);

    return (
        <div className={styles.equipmentContainer}>
            <section className={styles.characterData}>
                <h2>Level {level.currentLevel}</h2>
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
            <section className={styles.equipmentSection}>
                <DroppableSlot slot="helm" loot={helm} />
                <DroppableSlot slot="body" loot={body} />
                <DroppableSlot slot="weapon" loot={weapon} />
                <DroppableSlot slot="amulet" loot={amulet} />
            </section>
            <section className={`${theme.pixelEmboss} ${styles.inventorySection}`}>
                <Inventory />
            </section>
            <section className={styles.actionsSection}>
                <Button
                    text="Sell"
                    onClick={() => {
                        selected && inventory.includes(selected)
                            ? dispatch(sellLoot(selected))
                            : console.log("Nothing to sell?");
                    }}
                />
                <Button
                    text="Scrap"
                    onClick={() => {
                        console.log("Scrapping not implemented. :(");
                    }}
                />
            </section>
        </div>
    );
};

export default Equipment;
