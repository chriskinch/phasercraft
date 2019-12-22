import React from "react"
import { connect } from "react-redux"
import "styled-components/macro"
import Button from "../atoms/Button"
import Stock from "../organisms/Stock"
import { buyLoot, deductCoin, generateLootTable, sortLoot } from "../../../store/gameReducer"
import store from "../../../store"

const Armory = ({coins, buyLoot, deductCoin, sortLoot, generateLootTable}) => {
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
                    const cost = 10;
                    if(cost <= coins) {
                        console.log("STORE: ", store.getState().selected)
                        buyLoot(store.getState().selected);
                        deductCoin(10);
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

export default connect(mapStateToProps, {buyLoot, deductCoin, sortLoot, generateLootTable })(Armory);