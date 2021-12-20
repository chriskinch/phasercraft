import React from "react"
import { connect } from "react-redux"
import "styled-components/macro"
import { pixel_emboss } from "@UI/themes"
import Button from "@atoms/Button"
import Stock from "@organisms/Stock"
import { buyLoot, toggleFilter } from "@store/gameReducer"
import store from "@store"
import { useQuery, useMutation, useApolloClient } from "@apollo/client"
import { GET_ITEMS } from "@queries/getItems"
import { RESTOCK_STORE, REMOVE_ITEM } from "@mutations"
import { sortBy } from "@UI/operations/helpers"

const Armory = ({coins, buyLoot, filters, toggleFilter}) => {
    const client = useApolloClient();
    const { loading, error, data, refetch } = useQuery(GET_ITEMS);
    const [restockStore] = useMutation(RESTOCK_STORE, {
        update(cache) {
            cache.reset();
        }
    });
    const [removeItem] = useMutation(REMOVE_ITEM, {
        update(cache) {
            cache.reset();
        }
    });

    if(loading) return 'Loading...';
    if(error) return `ERROR: ${error.message}`;

    const filterOn = filter => filters.includes(filter);
    const filterAndRefetch = key => {
        toggleFilter(key)
        refetch({
            filter: {
                stats: store.getState().filters
            }
        })
    }

    return (
        <div css={`
            display: grid;
            grid-template-columns: 90px 90px 1fr;
            grid-gap: 1em;
            height: 100%;
        `}>
            <section>
                <h3>Sort</h3>
                <Button text="Quality" onClick={() => {
                    const { items } = client.readQuery({ query: GET_ITEMS, });
                    client.writeQuery({
                        query: GET_ITEMS,
                        data: {
                            items: sortBy(items, {key: "qualitySort", order: "desc"}),
                        }
                    });
                }} />
                <Button text="Stats" onClick={() => {
                    const { items } = client.cache.readQuery({ query: GET_ITEMS });
                    client.writeQuery({
                        query: GET_ITEMS,
                        data: {
                            items: sortBy(items, {key: "pool", order: "desc"}),
                        }
                    });
                }} />
                <h3>Action</h3>
                <Button text="Buy" onClick={() => {
                    const selected = store.getState().selected;
                    if(selected?.cost <= coins) {
                        buyLoot(selected);
                        removeItem({
                            variables: {
                                removeItemId: selected.id
                            }
                        })
                    }else{
                        console.log("CANNOT AFFORD")
                    }
                }} />
                <Button text="Restock" onClick={() => {
                    restockStore({ variables: {restockStoreAmount: 45} });
                }} />
            </section>
            <section>
                <h3>Filter</h3>
                <div  css={`
                    display:grid;
                    grid-template-columns: 1fr 1fr;
                    column-gap: 0.5em;
                `}>                
                    <Button text="AP" on={filterOn("attack_power")} onClick={() => filterAndRefetch("attack_power")} />
                    <Button text="MP" on={filterOn("magic_power")} onClick={() => filterAndRefetch("magic_power")} />
                    <Button text="AS" on={filterOn("attack_speed")} onClick={() => filterAndRefetch("attack_speed")} />
                    <Button text="CC" on={filterOn("critical_chance")} onClick={() => filterAndRefetch("critical_chance")} />
                    <Button text="HM" on={filterOn("health_max")} onClick={() => filterAndRefetch("health_max")} />
                    <Button text="HR" on={filterOn("health_regen_rate")} onClick={() => filterAndRefetch("health_regen_rate")} />
                    <Button text="HV" on={filterOn("health_regen_value")} onClick={() => filterAndRefetch("health_regen_value")} />
                    <Button text="DF" on={filterOn("defence")} onClick={() => filterAndRefetch("defence")} />
                    <Button text="SP" on={filterOn("speed")} onClick={() => filterAndRefetch("speed")} />
                </div>
            </section>
            <section css={`
                ${ pixel_emboss }
                padding: 0.5em;
            `}>
                <Stock items={data.items} />
            </section>
        </div>
    );
}

const mapStateToProps = (state) => {
    const { coins, filters} = state;
    return { coins, filters }
};

export default connect(mapStateToProps, { buyLoot, toggleFilter })(Armory);