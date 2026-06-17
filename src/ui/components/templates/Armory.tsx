import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Button from "@components/Button";
import Stock from "@components/Stock";
import { buyLoot, toggleFilter } from "@store/gameReducer";
import store from "@store";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { GET_ITEMS } from "@queries/getItems";
import { RESTOCK_STORE, REMOVE_ITEM } from "@mutations";
import { sortBy } from "@ui/operations/helpers";
import type { LootItem } from "@/types/game";
import type { RootState } from "@store";
import styles from "./Armory.module.css";

interface ArmoryProps {}

const Armory: React.FC<ArmoryProps> = () => {
    const dispatch = useDispatch();
    const coins = useSelector((state: RootState) => state.game.coins);
    const filters = useSelector((state: RootState) => state.game.filters);
    const client = useApolloClient();
    const { loading, error, data, refetch } = useQuery(GET_ITEMS);
    const [restockStore] = useMutation(RESTOCK_STORE, {
        update(cache) {
            cache.reset();
        },
    });
    const [removeItem] = useMutation(REMOVE_ITEM, {
        update(cache) {
            cache.reset();
        },
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>ERROR: {error.message}</div>;

    const filterOn = (filter: string) => filters?.includes(filter);
    const filterAndRefetch = (key: string) => {
        dispatch(toggleFilter(key));
        refetch({
            filter: {
                stats: store.getState().game.filters,
            },
        });
    };

    return (
        <div className={styles.armoryContainer}>
            <section>
                <h3>Sort</h3>
                <Button
                    text="Quality"
                    onClick={() => {
                        const { items } = client.readQuery({ query: GET_ITEMS }) as {
                            items: LootItem[];
                        };
                        client.writeQuery({
                            query: GET_ITEMS,
                            data: {
                                items: sortBy(items, { key: "qualitySort", order: "desc" }),
                            },
                        });
                    }}
                />
                <Button
                    text="Stats"
                    onClick={() => {
                        const { items } = client.cache.readQuery({ query: GET_ITEMS }) as {
                            items: LootItem[];
                        };
                        client.writeQuery({
                            query: GET_ITEMS,
                            data: {
                                items: sortBy(items, { key: "pool", order: "desc" }),
                            },
                        });
                    }}
                />
                <h3>Action</h3>
                <Button
                    text="Buy"
                    onClick={() => {
                        const selected = store.getState().game.selected;
                        if (selected && selected.cost <= coins) {
                            dispatch(buyLoot(selected));
                            removeItem({
                                variables: {
                                    removeItemId: selected.id,
                                },
                            });
                        } else {
                            console.log("CANNOT AFFORD");
                        }
                    }}
                />
                <Button
                    text="Restock"
                    onClick={() => {
                        restockStore({ variables: { restockStoreAmount: 45 } });
                    }}
                />
            </section>
            <section>
                <h3>Filter</h3>
                <div className={styles.filterGrid}>
                    <Button
                        text="AP"
                        on={filterOn("attack_power")}
                        onClick={() => filterAndRefetch("attack_power")}
                    />
                    <Button
                        text="MP"
                        on={filterOn("magic_power")}
                        onClick={() => filterAndRefetch("magic_power")}
                    />
                    <Button
                        text="AS"
                        on={filterOn("attack_speed")}
                        onClick={() => filterAndRefetch("attack_speed")}
                    />
                    <Button
                        text="CC"
                        on={filterOn("critical_chance")}
                        onClick={() => filterAndRefetch("critical_chance")}
                    />
                    <Button
                        text="HM"
                        on={filterOn("health_max")}
                        onClick={() => filterAndRefetch("health_max")}
                    />
                    <Button
                        text="HR"
                        on={filterOn("health_regen_rate")}
                        onClick={() => filterAndRefetch("health_regen_rate")}
                    />
                    <Button
                        text="HV"
                        on={filterOn("health_regen_value")}
                        onClick={() => filterAndRefetch("health_regen_value")}
                    />
                    <Button
                        text="DF"
                        on={filterOn("defence")}
                        onClick={() => filterAndRefetch("defence")}
                    />
                    <Button
                        text="SP"
                        on={filterOn("speed")}
                        onClick={() => filterAndRefetch("speed")}
                    />
                </div>
            </section>
            <section className={styles.stockSection}>
                <Stock items={data.items} />
            </section>
        </div>
    );
};

export default Armory;
