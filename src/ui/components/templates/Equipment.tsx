import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    sellLoot,
    sellComponent,
    sellComponentStack,
    readScroll,
    sellScroll,
} from "@store/gameReducer";
import Button from "@components/Button";
import GearGrid from "@components/GearGrid";
import ComponentsGrid from "@components/ComponentsGrid";
import SpecialsGrid from "@components/SpecialsGrid";
import ScrollsGrid from "@components/ScrollsGrid";
import Toast from "@components/Toast";
import DroppableSlot from "@components/DroppableSlot";
import GroupedAttributes from "@components/GroupedAttributes";
import StatBar from "@components/StatBar";
import SellValuePopup from "@components/SellValuePopup";
import { COMPONENT_DEFS, SCROLL_SELL_VALUE } from "@/types/game";
import { learnToast, scrollStacks, scrollStatus } from "@/lib/scrollStatus";
import type { RootState } from "@store";
import theme from "@ui/themes.module.css";
import styles from "./Equipment.module.css";

type Tab = "gear" | "parts" | "special" | "scrolls";

// Learn button colour (as the Blacksmith "Use item").
const LEARN_COLOR = "#c9a3ff";

// The equipment screen owns the inventory filter (Gear | Parts | Special | Scrolls) and the sell
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
        scrolls,
        learnedSpells,
        abilityLoadout,
    } = useSelector((state: RootState) => state.game);

    const [tab, setTab] = useState<Tab>("gear");
    const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
    // Raw requested quantity; clamped on read to [1, stack.quantity] so a shrinking
    // stack or a change of selection can never leave it out of range.
    const [rawQty, setRawQty] = useState(1);
    const [selectedScrollKey, setSelectedScrollKey] = useState<string | null>(null);
    const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
    const clearToast = useCallback(() => setToast(null), []);

    // Resolved against the live store, so a stack that gets sold out (and removed)
    // falls back to null instead of leaving a stale reference behind.
    const stack = components.find((s) => s.id === selectedComponentId) ?? null;
    const qty = stack ? Math.min(Math.max(1, rawQty), stack.quantity) : 1;
    const onParts = tab === "parts";
    // Specials are spent at the Blacksmith, never sold, so Sell is off here.
    const onSpecial = tab === "special";
    const onScrolls = tab === "scrolls";

    // Like `stack`: resolved against the live store so a scroll stack read or
    // sold down to zero drops the selection.
    const scroll = scrollStacks(scrolls).find((s) => s.key === selectedScrollKey) ?? null;
    const abilities = { character, learnedSpells, abilityLoadout };
    const status = scroll ? scrollStatus(abilities, scroll.spell, scroll.level) : null;

    const learn = () => {
        if (!scroll || !status?.readable) return;
        const message = learnToast(abilities, scroll.spell, scroll.level);
        dispatch(readScroll(scroll.spell, scroll.level));
        setToast((t) => ({ id: (t?.id ?? 0) + 1, message }));
    };

    const sell = () => {
        if (onSpecial) return;
        if (onScrolls) {
            // One at a time (spec).
            scroll && dispatch(sellScroll(scroll.spell, scroll.level, 1));
            return;
        }
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
                ) : onSpecial ? (
                    <SpecialsGrid />
                ) : onScrolls ? (
                    <ScrollsGrid selectedKey={selectedScrollKey} onSelect={setSelectedScrollKey} />
                ) : (
                    <GearGrid />
                )}
                {/* Sell value lives in the inventory box, not the action column,
                    so that column has room for a 4th filter. */}
                {onParts && stack && (
                    <SellValuePopup value={COMPONENT_DEFS[stack.type].sellValue * qty} />
                )}
                {onScrolls && scroll && <SellValuePopup value={SCROLL_SELL_VALUE[scroll.level]} />}
                {toast && <Toast key={toast.id} message={toast.message} onDone={clearToast} />}
            </section>
            <section className={styles.filtersSection} role="tablist">
                <Button text="Gear" on={tab === "gear"} onClick={() => setTab("gear")} />
                <Button text="Parts" on={onParts} onClick={() => setTab("parts")} />
                <Button text="Special" on={onSpecial} onClick={() => setTab("special")} />
                <Button text="Scrolls" on={onScrolls} onClick={() => setTab("scrolls")} />
            </section>
            <section className={styles.actionsSection}>
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
                {onScrolls && (
                    // Disabled (grey) whenever the read would be refused; the
                    // tooltip's hint line says why.
                    <Button
                        text="Learn"
                        bg_color={status?.readable ? LEARN_COLOR : undefined}
                        disabled={!status?.readable}
                        onClick={learn}
                    />
                )}
                <Button
                    text={onParts && qty > 1 ? `Sell ${qty}` : "Sell"}
                    disabled={onSpecial || (onParts && !stack) || (onScrolls && !scroll)}
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
