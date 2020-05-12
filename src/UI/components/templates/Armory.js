import React from "react"
import { connect } from "react-redux"
import "styled-components/macro"
import { pixel_emboss } from "@UI/themes"
import Button from "@atoms/Button"
import Stock from "@organisms/Stock"
import { buyLoot, generateLootTable, sortLoot } from "@store/gameReducer"
import store from "@store"

const Armory = ({coins, buyLoot, sortLoot, generateLootTable}) => {
    return (
        <div css={`
            display: grid;
            grid-template-columns: 96px 1fr;
            grid-gap: 2em;
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

export default connect(mapStateToProps, {buyLoot, sortLoot, generateLootTable })(Armory);