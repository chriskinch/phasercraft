import React from "react"
import { connect } from "react-redux"
import "styled-components/macro"
import Button from "../atoms/Button"
import Stock from "../organisms/Stock"
import { addLoot, deductCoin, generateLootTable, sortLoot } from "../../../store/gameReducer"

const Armory = ({coins, addLoot, deductCoin, sortLoot, generateLootTable}) => {
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
                        addLoot(Math.floor(Math.random()*99));
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

const mapStateToProps = (state) => ({
    ...state
});

export default connect(mapStateToProps, {addLoot, deductCoin, sortLoot, generateLootTable })(Armory);