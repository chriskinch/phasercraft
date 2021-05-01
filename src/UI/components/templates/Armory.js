import React, { useState } from "react"
import { connect } from "react-redux"
import "styled-components/macro"
import { pixel_emboss } from "@UI/themes"
import Button from "@atoms/Button"
import Stock from "@organisms/Stock"
import { toggleFilter } from "@store/gameReducer"
import { useQuery, useMutation, useApolloClient } from "@apollo/client"
import { lootMutations } from "@mutations"
import { GET_ITEMS } from "@queries/getItems"
import { RESTOCK_STORE } from "@mutations/restockStore"
import { sortBy } from "@UI/operations/helpers"

const Armory = ({filters, toggleFilter}) => {
    const client = useApolloClient();
    const { loading, error, data } = useQuery(GET_ITEMS);
    const [restockStore] = useMutation(RESTOCK_STORE, {
        update(cache, {data}) {
            const itemsToKeep = cache.readQuery({ query: GET_ITEMS }).items.filter(i => i.isInInventory);
            cache.reset();
            cache.writeQuery({
                query: GET_ITEMS,
                data: {items: [...itemsToKeep, ...data.restockStore]}
            });
        }
    });
    if(loading) return 'Loading...';
    if(error) return `ERROR: ${error.message}`;

    let filteredItems = data.items.filter(i => !i.isInInventory);

    const filterOn = filter => filters.includes(filter);
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
                    const { items } = client.readQuery({ query: GET_ITEMS });
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
                <Button text="Buy" onClick={() => { lootMutations.buyLoot() }} />
                <Button text="Restock" onClick={() => {
                    restockStore({ variables: {restockStoreAmount: 45} });
                    toggleFilter();
                }} />
            </section>
            <section>
                <h3>Filter</h3>
                <div  css={`
                    display:grid;
                    grid-template-columns: 1fr 1fr;
                    column-gap: 0.5em;
                `}>                
                    <Button text="AP" on={filterOn("attack_power")} onClick={() => toggleFilter("attack_power")} />
                    <Button text="MP" on={filterOn("magic_power")} onClick={() => toggleFilter("magic_power") } />
                    <Button text="AS" on={filterOn("attack_speed")} onClick={() => toggleFilter("attack_speed")} />
                    <Button text="CC" on={filterOn("critical_chance")} onClick={() => toggleFilter("critical_chance")} />
                    <Button text="HM" on={filterOn("health_max")} onClick={() => toggleFilter("health_max") } />
                    <Button text="HR" on={filterOn("health_regen_rate")} onClick={() => toggleFilter("health_regen_rate")} />
                    <Button text="HV" on={filterOn("health_regen_value")} onClick={() => toggleFilter("health_regen_value") } />
                    <Button text="DF" on={filterOn("defence")} onClick={() => toggleFilter("defence")} />
                    <Button text="SP" on={filterOn("speed")} onClick={() => toggleFilter("speed")} />
                </div>
            </section>
            <section css={`
                ${ pixel_emboss }
                padding: 0.5em;
            `}>
                <Stock list={filteredItems} name={"stock"} cols={9} />
            </section>
        </div>
    );
}

const mapStateToProps = (state) => {
    const { filters} = state;
    return { filters }
};

export default connect(mapStateToProps, { toggleFilter })(Armory);