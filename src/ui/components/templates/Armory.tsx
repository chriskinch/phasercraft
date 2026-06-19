import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import Button from "@components/Button";
import Stock from "@components/Stock";
import { buyLoot, toggleFilter } from "@store/gameReducer";
import store from "@store";
import { sortBy } from "@ui/operations/helpers";
import type { LootItem } from "@/types/game";
import type { RootState } from "@store";
import { enrichItem } from "@/lib/armory";
import type { Item as ApiItem } from "../../../../api/_lib/types";
import styles from "./Armory.module.css";

interface ArmoryProps {}

const Armory: React.FC<ArmoryProps> = () => {
    const dispatch = useDispatch();
    const coins = useSelector((state: RootState) => state.game.coins);
    const filters = useSelector((state: RootState) => state.game.filters);
    const armoryUrl = import.meta.env.VITE_ARMORY_URL;

    const [allItems, setAllItems] = useState<LootItem[]>([]);
    const [items, setItems] = useState<LootItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${armoryUrl}/api/items`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = (await res.json()) as ApiItem[];
            const enriched = data.map(enrichItem);
            setAllItems(enriched);
            setItems(enriched);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [armoryUrl]);

    useEffect(() => {
        if (armoryUrl !== undefined) {
            void fetchItems();
        }
    }, [armoryUrl, fetchItems]);

    useEffect(() => {
        setItems(
            filters.length === 0
                ? allItems
                : allItems.filter((item) => item.stats.some((s) => filters.includes(s.name)))
        );
    }, [filters, allItems]);

    if (armoryUrl === undefined) return <div>Merchant unavailable</div>;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>ERROR: {error}</div>;

    const filterOn = (filter: string) => filters?.includes(filter);

    return (
        <div className={styles.armoryContainer}>
            <section>
                <h3>Sort</h3>
                <Button
                    text="Quality"
                    onClick={() =>
                        setItems((prev) => sortBy([...prev], { key: "qualitySort", order: "desc" }))
                    }
                />
                <Button
                    text="Stats"
                    onClick={() =>
                        setItems((prev) => sortBy([...prev], { key: "pool", order: "desc" }))
                    }
                />
                <h3>Action</h3>
                <Button
                    text="Buy"
                    onClick={() => {
                        const selected = store.getState().game.selected;
                        if (selected && selected.cost <= coins) {
                            dispatch(buyLoot(selected));
                            setAllItems((prev) => prev.filter((i) => i.id !== selected.id));
                            fetch(`${armoryUrl}/api/items/${selected.id}`, {
                                method: "DELETE",
                            }).catch((e) => console.error("Failed to remove item:", e));
                        } else {
                            console.log("CANNOT AFFORD");
                        }
                    }}
                />
                <Button
                    text="Restock"
                    onClick={() => {
                        fetch(`${armoryUrl}/api/store/clear`, { method: "POST" })
                            .then(() =>
                                fetch(`${armoryUrl}/api/store/create`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ amount: 45 }),
                                })
                            )
                            .then(() => fetchItems())
                            .catch((e) => console.error("Restock failed:", e));
                    }}
                />
            </section>
            <section>
                <h3>Filter</h3>
                <div className={styles.filterGrid}>
                    <Button
                        text="AP"
                        on={filterOn("attack_power")}
                        onClick={() => dispatch(toggleFilter("attack_power"))}
                    />
                    <Button
                        text="MP"
                        on={filterOn("magic_power")}
                        onClick={() => dispatch(toggleFilter("magic_power"))}
                    />
                    <Button
                        text="AS"
                        on={filterOn("attack_speed")}
                        onClick={() => dispatch(toggleFilter("attack_speed"))}
                    />
                    <Button
                        text="CC"
                        on={filterOn("critical_chance")}
                        onClick={() => dispatch(toggleFilter("critical_chance"))}
                    />
                    <Button
                        text="HM"
                        on={filterOn("health_max")}
                        onClick={() => dispatch(toggleFilter("health_max"))}
                    />
                    <Button
                        text="HR"
                        on={filterOn("health_regen_rate")}
                        onClick={() => dispatch(toggleFilter("health_regen_rate"))}
                    />
                    <Button
                        text="HV"
                        on={filterOn("health_regen_value")}
                        onClick={() => dispatch(toggleFilter("health_regen_value"))}
                    />
                    <Button
                        text="DF"
                        on={filterOn("defence")}
                        onClick={() => dispatch(toggleFilter("defence"))}
                    />
                    <Button
                        text="SP"
                        on={filterOn("speed")}
                        onClick={() => dispatch(toggleFilter("speed"))}
                    />
                </div>
            </section>
            <section className={styles.stockSection}>
                <Stock items={items} />
            </section>
        </div>
    );
};

export default Armory;
