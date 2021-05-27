import React from "react"
import { connect } from "react-redux"
import "styled-components/macro"
import { pixel_emboss } from "@UI/themes"
import Button from "@atoms/Button"
import Stock from "@organisms/Stock"
import { buyLoot, generateLootTable, toggleFilter, sortLoot } from "@store/gameReducer"
import store from "@store"
import { useQuery } from "@apollo/client"
import { GET_ITEMS } from "@queries/getItems"

const Armory = ({coins, buyLoot, filters, sortLoot, toggleFilter, generateLootTable}) => {
    const { loading, error, data } = useQuery(GET_ITEMS);
    if(loading) return 'Loading...';
    if(error) return `ERROR: ${error.message}`;
    console.log(loading, error, data)
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
                <Button text="Quality" onClick={() => sortLoot("quality_sort", "ascending")} />
                <Button text="Stats" onClick={() => sortLoot("stat_pool", "decending")} />
                <h3>Action</h3>
                <Button text="Buy" onClick={() => {
                    const selected = store.getState().selected;
                    if(selected?.cost <= coins) {
                        buyLoot(store.getState().selected);
                    }else{
                        console.log("CANNOT AFFORD")
                    }
                }} />
                <Button text="Restock" onClick={() => {
                    generateLootTable(99);
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
                <Stock items={data.items} />
            </section>
        </div>
    );
}

const mapStateToProps = (state) => {
    const { coins, filters} = state;
    return { coins, filters }
};

export default connect(mapStateToProps, { buyLoot, sortLoot, toggleFilter, generateLootTable })(Armory);