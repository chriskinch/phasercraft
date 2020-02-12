import React from "react"
import { connect } from "react-redux"
import "styled-components/macro"
import Button from "@atoms/Button"
import Stock from "@organisms/Stock"
import { buyLoot, generateLootTable, sortLoot } from "@store/gameReducer"
import store from "@store"

const Armory = ({coins, buyLoot, sortLoot, generateLootTable}) => {
    return (
        <div css={`
            display: flex;
        `}>
            <section css="width: 96px; margin-right: 2em;">
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
            <section css="flex-grow: 1; padding: 0 6px;">
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