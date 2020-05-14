import React from "react"
import { connect } from "react-redux"
import "styled-components/macro"
import { pixel_emboss } from "@UI/themes"
import Button from "@atoms/Button"
import Stock from "@organisms/Stock"
import { buyLoot, generateLootTable, filterLoot, sortLoot } from "@store/gameReducer"
import store from "@store"
import _ from "lodash"

const Armory = ({coins, loot, filterLoot, buyLoot, sortLoot, generateLootTable}) => {
    return (
        <div css={`
            display: grid;
            grid-template-columns: 84px 42px 1fr;
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
                    if(selected && selected.cost <= coins) {
                        buyLoot(store.getState().selected);
                    }else{
                        console.log("CANNOT AFFORD")
                    }
                }} />
                <Button text="Restock" onClick={() => generateLootTable(99)} />
            </section>
            <section>
                <h3>Filter</h3>
                <Button text="AP" onClick={() => filterLoot('attack_power') } />
                <Button text="MP" onClick={() => filterLoot('magic_power') } />
                <Button text="AS" onClick={() => console.log("AS")} />
                <Button text="Cr" onClick={() => console.log("Cr")} />
            </section>
            <section css={`
                ${ pixel_emboss }
                padding: 0.5em;
            `}>
                <Stock />
            </section>
        </div>
    );
}

const mapStateToProps = (state) => {
    const { coins, loot } = state;
    return { coins, loot }
};

export default connect(mapStateToProps, { buyLoot, sortLoot, filterLoot, generateLootTable })(Armory);