import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Button from "@components/Button";
import Stock from "@components/Stock";
import { buyLoot, toggleFilter } from "@store/gameReducer";
import { sortBy } from "@ui/operations/helpers";
import { useArmory } from "@ui/hooks/useArmory";
import type { RootState } from "@store";
import styles from "./Armory.module.css";

type SortKey = "qualitySort" | "pool";

const Armory: React.FC = () => {
    const dispatch = useDispatch();
    const coins = useSelector((state: RootState) => state.game.coins);
    const filters = useSelector((state: RootState) => state.game.filters);
    const selected = useSelector((state: RootState) => state.game.selected);
    const { items, status, buy, restockStore } = useArmory();
    const [sortKey, setSortKey] = useState<SortKey | null>(null);

    if (status === "loading") return <div>Loading...</div>;
    if (status === "unavailable") return <div>The merchant is currently unavailable.</div>;

    // Sort and filter were the gateway's / Apollo cache's job; they are plain
    // client-side derivations now. Filtering keeps items whose stats include every
    // selected stat name (mirrors the old gateway filter).
    const activeFilters = filters ?? [];
    const filtered = activeFilters.length
        ? items.filter((item) =>
              activeFilters.every((name) => item.stats.some((stat) => stat.name === name))
          )
        : items;
    const visible = sortKey ? sortBy(filtered, { key: sortKey, order: "desc" }) : filtered;

    const filterOn = (filter: string) => activeFilters.includes(filter);

    return (
        <div className={styles.armoryContainer}>
            <section>
                <h3>Sort</h3>
                <Button text="Quality" onClick={() => setSortKey("qualitySort")} />
                <Button text="Stats" onClick={() => setSortKey("pool")} />
                <h3>Action</h3>
                <Button
                    text="Buy"
                    onClick={() => {
                        if (selected && selected.cost <= coins) {
                            dispatch(buyLoot(selected));
                            void buy(selected.id);
                        } else {
                            console.log("CANNOT AFFORD");
                        }
                    }}
                />
                <Button text="Restock" onClick={() => void restockStore(45)} />
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
                <Stock items={visible} />
            </section>
        </div>
    );
};

export default Armory;
