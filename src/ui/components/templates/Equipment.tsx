import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sellLoot, sellComponent, sellComponentStack } from "@store/gameReducer";
import Button from "@components/Button";
import GearGrid from "@components/GearGrid";
import ComponentsGrid from "@components/ComponentsGrid";
import DroppableSlot from "@components/DroppableSlot";
import GroupedAttributes from "@components/GroupedAttributes";
import StatBar from "@components/StatBar";
import { COMPONENT_DEFS } from "@/types/game";
import type { RootState } from "@store";
import theme from "@ui/themes.module.css";
import styles from "./Equipment.module.css";

type Tab = "gear" | "parts";

// The equipment screen owns the inventory filter (Gear | Parts) and the sell
// controls together: both grids share the single Sell button in the actions
// column, so the tab, the selected component stack and the sell quantity all
// live here rather than inside the inventory panel.
const Equipment: React.FC = () => {
    const dispatch = useDispatch();
    const {
        character,
        equipment: { amulet, body, helm, weapon },
        stats,
        stats: { resource_type },
        level,
        selected,
        inventory,
        components,
    } = useSelector((state: RootState) => state.game);

    const [tab, setTab] = useState<Tab>("gear");
    const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
    // Raw requested quantity; clamped on read to [1, stack.quantity] so a shrinking
    // stack or a change of selection can never leave it out of range.
    const [rawQty, setRawQty] = useState(1);

    // Resolved against the live store, so a stack that gets sold out (and removed)
    // falls back to null instead of leaving a stale reference behind.
    const stack = components.find((s) => s.id === selectedComponentId) ?? null;
    const qty = stack ? Math.min(Math.max(1, rawQty), stack.quantity) : 1;
    const onParts = tab === "parts";

    const sell = () => {
        if (onParts) {
            stack && dispatch(sellComponent(stack.id, qty));
            return;
        }
        selected && inventory.includes(selected)
            ? dispatch(sellLoot(selected))
            : console.log("Nothing to sell?");
    };

    return (
        <div className={styles.equipmentContainer}>
            <section className={styles.characterData}>
                <h2>Level {level.currentLevel}</h2>
                <div className={styles.characterResources}>
                    <img src={`UI/player/${character?.toLowerCase()}.gif`} alt="This is you!" />
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
                {onParts ? (
                    <ComponentsGrid
                        selectedId={selectedComponentId}
                        onSelectStack={setSelectedComponentId}
                    />
                ) : (
                    <GearGrid />
                )}
            </section>
            <section className={styles.filtersSection} role="tablist">
                <Button text="Gear" on={!onParts} onClick={() => setTab("gear")} />
                <Button text="Parts" on={onParts} onClick={() => setTab("parts")} />
            </section>
            <section className={styles.actionsSection}>
                {onParts && stack && (
                    <span className={styles.value} data-testid="sell-value">
                        +{COMPONENT_DEFS[stack.type].sellValue * qty}
                    </span>
                )}
                {onParts && (
                    // No quantity readout between the buttons — the number on the
                    // Sell button below is the counter.
                    <div className={styles.stepper} data-testid="sell-stepper">
                        <Button
                            text="-"
                            disabled={!stack || qty <= 1}
                            onClick={() => setRawQty(qty - 1)}
                        />
                        <Button
                            text="+"
                            disabled={!stack || qty >= stack.quantity}
                            onClick={() => setRawQty(qty + 1)}
                        />
                    </div>
                )}
                <Button
                    text={onParts && qty > 1 ? `Sell ${qty}` : "Sell"}
                    disabled={onParts && !stack}
                    onClick={sell}
                />
                {onParts && (
                    <Button
                        text="Sell All"
                        disabled={!stack}
                        onClick={() => stack && dispatch(sellComponentStack(stack.id))}
                    />
                )}
            </section>
        </div>
    );
};

export default Equipment;
