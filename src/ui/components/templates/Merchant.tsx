import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    sellLoot,
    sellComponent,
    sellComponentStack,
    buyComponent,
    buyGear,
    refreshMerchant,
} from "@store/gameReducer";
import Button from "@components/Button";
import GearGrid from "@components/GearGrid";
import ComponentsGrid from "@components/ComponentsGrid";
import PartsShopGrid from "@components/PartsShopGrid";
import GearShopGrid from "@components/GearShopGrid";
import {
    COMPONENT_DEFS,
    componentBuyPrice,
    merchantWindow,
    merchantPartsBase,
    merchantRestockRemaining,
} from "@/types/game";
import type { ComponentType } from "@/types/game";
import type { RootState } from "@store";
import theme from "@ui/themes.module.css";
import styles from "./Merchant.module.css";

type Mode = "buy" | "sell";
type Tab = "gear" | "parts";

// Buy is the default mode; Parts is the default tab (parts over gear).
const SELL_BLUE = "#4aa3df";

// mm:ss for the "refreshes in" countdown.
const formatCountdown = (ms: number): string => {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
};

// The town Merchant shop. A Buy/Sell toggle sits next to the grey title, each
// mode with its own Gear/Parts tabs:
//  - Sell shows the player's inventory (reusing the gear/component grids and the
//    sell reducers).
//  - Buy shows the shop's stock: Parts restock on a wall-clock 10-minute cycle
//    (with a live countdown); Gear is whatever the player has sold this session.
// Selection and quantity live here because both grids share the actions column.
const Merchant: React.FC = () => {
    const dispatch = useDispatch();
    const { coins, selected, inventory, components, merchant } = useSelector(
        (state: RootState) => state.game
    );

    const [mode, setMode] = useState<Mode>("buy");
    const [tab, setTab] = useState<Tab>("parts");
    // Sell-parts selection + quantity.
    const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
    const [sellRawQty, setSellRawQty] = useState(1);
    // Buy-parts selection + quantity.
    const [buyType, setBuyType] = useState<ComponentType | null>(null);
    const [buyRawQty, setBuyRawQty] = useState(1);
    // Ticks once a second so the countdown moves and a window rollover refreshes
    // the shop stock.
    const [now, setNow] = useState(() => Date.now());

    const currentWindow = merchantWindow(now);
    // Roll the shop over the moment the wall-clock window changes (and on open).
    useEffect(() => {
        dispatch(refreshMerchant(currentWindow));
    }, [dispatch, currentWindow]);
    useEffect(() => {
        const id = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(id);
    }, []);

    const onParts = tab === "parts";
    const onBuy = mode === "buy";

    // --- Sell state ---
    const sellStack = components.find((s) => s.id === selectedComponentId) ?? null;
    const sellQty = sellStack ? Math.min(Math.max(1, sellRawQty), sellStack.quantity) : 1;
    const gearSelected = !!selected && inventory.includes(selected);

    const sell = () => {
        if (onParts) {
            sellStack && dispatch(sellComponent(sellStack.id, sellQty));
            return;
        }
        gearSelected && dispatch(sellLoot(selected!));
    };

    // --- Buy state ---
    const buyStock = buyType
        ? Math.max(
              0,
              merchantPartsBase(currentWindow, buyType) + (merchant.partsDelta[buyType] ?? 0)
          )
        : 0;
    const buyPrice = buyType ? componentBuyPrice(buyType) : 0;
    const affordableQty = buyPrice > 0 ? Math.floor(coins / buyPrice) : 0;
    // How many the player can buy right now: bounded by stock and coins.
    const buyStepMax = Math.min(buyStock, affordableQty);
    const buyQty = Math.min(Math.max(1, buyRawQty), Math.max(1, buyStepMax));

    const buyParts = () => {
        if (!buyType) return;
        // buyComponent buys one at a time and re-guards stock/coins each call.
        for (let i = 0; i < buyQty; i++) dispatch(buyComponent(buyType));
    };

    // Buying gear back reuses the shared `selected`; only gear that is actually in
    // the shop's stock is buyable, at the no-margin sell-refund price.
    const gearBuyable = !!selected && merchant.gearStock.some((l) => l.id === selected.id);
    const gearBuyPrice = selected ? Math.round(selected.cost / 3) : 0;

    const switchMode = (next: Mode) => {
        setMode(next);
        setBuyType(null);
        setSelectedComponentId(null);
    };
    const switchTab = (next: Tab) => {
        setTab(next);
        setBuyType(null);
        setSelectedComponentId(null);
    };

    return (
        <div className={styles.merchantContainer}>
            <section className={styles.modeSection}>
                <h2 className={`${theme.pixelEmboss} ${styles.title}`}>Merchant</h2>
                <div
                    className={styles.modeButtons}
                    role="tablist"
                    aria-label="Buy or sell"
                    data-testid="merchant-modes"
                >
                    <span className={onBuy ? styles.active : styles.inactive}>
                        <Button text="Buy" onClick={() => switchMode("buy")} />
                    </span>
                    <span className={!onBuy ? styles.active : styles.inactive}>
                        <Button
                            text="Sell"
                            bg_color={SELL_BLUE}
                            onClick={() => switchMode("sell")}
                        />
                    </span>
                </div>
            </section>
            <section className={styles.coinsSection}>
                <span className={styles.value} data-testid="merchant-coins">
                    {coins}
                </span>
            </section>
            <section className={`${theme.pixelEmboss} ${styles.stockSection}`}>
                {onBuy ? (
                    onParts ? (
                        <PartsShopGrid selectedType={buyType} onSelectType={setBuyType} />
                    ) : (
                        <GearShopGrid />
                    )
                ) : onParts ? (
                    <ComponentsGrid
                        selectedId={selectedComponentId}
                        onSelectStack={setSelectedComponentId}
                    />
                ) : (
                    <GearGrid />
                )}
            </section>
            <section className={styles.tabsSection} role="tablist" aria-label="Gear or parts">
                <Button text="Gear" on={!onParts} onClick={() => switchTab("gear")} />
                <Button text="Parts" on={onParts} onClick={() => switchTab("parts")} />
            </section>
            <section className={styles.actionsSection} data-testid="merchant-actions">
                {onBuy ? (
                    onParts ? (
                        <div className={styles.buyControls} data-testid="buy-parts-controls">
                            <span className={styles.timer} data-testid="restock-timer">
                                Refreshes in {formatCountdown(merchantRestockRemaining(now))}
                            </span>
                            {buyType && (
                                <span className={styles.value} data-testid="buy-value">
                                    {buyPrice * buyQty}
                                </span>
                            )}
                            <div className={styles.stepper} data-testid="buy-stepper">
                                <Button
                                    text="-"
                                    disabled={!buyType || buyQty <= 1}
                                    onClick={() => setBuyRawQty(buyQty - 1)}
                                />
                                <Button
                                    text="+"
                                    disabled={!buyType || buyQty >= buyStepMax}
                                    onClick={() => setBuyRawQty(buyQty + 1)}
                                />
                            </div>
                            <Button
                                text={buyType && buyQty > 1 ? `Buy ${buyQty}` : "Buy"}
                                disabled={!buyType || buyStepMax < 1}
                                onClick={buyParts}
                            />
                        </div>
                    ) : (
                        <div className={styles.buyControls} data-testid="buy-gear-controls">
                            {gearBuyable && (
                                <span className={styles.value} data-testid="buy-value">
                                    {gearBuyPrice}
                                </span>
                            )}
                            <Button
                                text="Buy"
                                disabled={!gearBuyable || coins < gearBuyPrice}
                                onClick={() => selected && dispatch(buyGear(selected))}
                            />
                        </div>
                    )
                ) : (
                    <>
                        {!onParts && gearSelected && (
                            <span className={styles.value} data-testid="sell-value">
                                +{Math.round(selected!.cost / 3)}
                            </span>
                        )}
                        {onParts && sellStack && (
                            <span className={styles.value} data-testid="sell-value">
                                +{COMPONENT_DEFS[sellStack.type].sellValue * sellQty}
                            </span>
                        )}
                        {onParts && (
                            <div className={styles.stepper} data-testid="sell-stepper">
                                <Button
                                    text="-"
                                    disabled={!sellStack || sellQty <= 1}
                                    onClick={() => setSellRawQty(sellQty - 1)}
                                />
                                <Button
                                    text="+"
                                    disabled={!sellStack || sellQty >= sellStack.quantity}
                                    onClick={() => setSellRawQty(sellQty + 1)}
                                />
                            </div>
                        )}
                        <Button
                            text={onParts && sellQty > 1 ? `Sell ${sellQty}` : "Sell"}
                            disabled={onParts ? !sellStack : !gearSelected}
                            onClick={sell}
                        />
                        {onParts && (
                            <Button
                                text="Sell All"
                                disabled={!sellStack}
                                onClick={() =>
                                    sellStack && dispatch(sellComponentStack(sellStack.id))
                                }
                            />
                        )}
                    </>
                )}
            </section>
        </div>
    );
};

export default Merchant;
