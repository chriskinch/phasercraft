import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sellLoot, sellComponent, sellComponentStack, buyComponent } from "@store/gameReducer";
import Button from "@components/Button";
import GearGrid from "@components/GearGrid";
import ComponentsGrid from "@components/ComponentsGrid";
import { COMPONENT_DEFS, COMPONENT_TYPES, componentBuyPrice } from "@/types/game";
import type { RootState } from "@store";
import theme from "@ui/themes.module.css";
import styles from "./Merchant.module.css";

type Tab = "gear" | "parts";

// The town Merchant shop. It reuses the same inventory grids and sell reducers as
// the Equipment screen (selling stays available in both places — this is
// non-breaking), and adds the one shop-only mechanic: buying parts for coins.
// The Gear/Parts tab, the selected component stack and the sell quantity all live
// here because both grids share the single Sell button in the actions column.
const Merchant: React.FC = () => {
    const dispatch = useDispatch();
    const { coins, selected, inventory, components } = useSelector(
        (state: RootState) => state.game
    );

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
    const gearSelected = !!selected && inventory.includes(selected);

    const sell = () => {
        if (onParts) {
            stack && dispatch(sellComponent(stack.id, qty));
            return;
        }
        gearSelected && dispatch(sellLoot(selected!));
    };

    return (
        <div className={styles.merchantContainer}>
            <section className={styles.coinsSection}>
                <h2>Merchant</h2>
                <span className={styles.value} data-testid="merchant-coins">
                    {coins}
                </span>
            </section>
            <section className={`${theme.pixelEmboss} ${styles.stockSection}`}>
                {onParts ? (
                    <ComponentsGrid
                        selectedId={selectedComponentId}
                        onSelectStack={setSelectedComponentId}
                    />
                ) : (
                    <GearGrid />
                )}
            </section>
            <section className={styles.tabsSection} role="tablist">
                <Button text="Gear" on={!onParts} onClick={() => setTab("gear")} />
                <Button text="Parts" on={onParts} onClick={() => setTab("parts")} />
            </section>
            <section className={styles.actionsSection}>
                {!onParts && gearSelected && (
                    <span className={styles.value} data-testid="sell-value">
                        +{Math.round(selected!.cost / 3)}
                    </span>
                )}
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
                    disabled={onParts ? !stack : !gearSelected}
                    onClick={sell}
                />
                {onParts && (
                    <Button
                        text="Sell All"
                        disabled={!stack}
                        onClick={() => stack && dispatch(sellComponentStack(stack.id))}
                    />
                )}
                {onParts && (
                    <div className={styles.buySection} data-testid="buy-section">
                        <h3>Buy</h3>
                        {COMPONENT_TYPES.map((type) => {
                            const price = componentBuyPrice(type);
                            return (
                                <Button
                                    key={type}
                                    text={`${COMPONENT_DEFS[type].name} ${price}`}
                                    disabled={coins < price}
                                    onClick={() => dispatch(buyComponent(type))}
                                />
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Merchant;
