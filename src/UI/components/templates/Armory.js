import React, { useRef } from "react"
import { connect } from "react-redux"
import "styled-components/macro"
import { pixel_emboss } from "@UI/themes"
import Button from "@atoms/Button"
import Stock from "@organisms/Stock"
import { buyLoot, generateLootTable, toggleFilter, sortLoot } from "@store/gameReducer"
import store from "@store"

const Armory = ({coins, buyLoot, sortLoot, toggleFilter, generateLootTable}) => {
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
                <Button text="AP" onClick={() => toggleFilter("attack_power")} />
                <Button text="MP" onClick={() => toggleFilter("magic_power") } />
                <Button text="AS" onClick={() => toggleFilter("attack_speed")} />
                <Button text="CC" onClick={() => toggleFilter("critical_chance")} />
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
    const { coins } = state;
    return { coins }
};

export default connect(mapStateToProps, { buyLoot, sortLoot, toggleFilter, generateLootTable })(Armory);