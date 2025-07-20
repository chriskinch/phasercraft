import React from "react"
import { connect } from "react-redux"
import LootList from "@components/LootList"


const Stock = ({items, loot }) => {
    return (
        <LootList list={items} name={"stock"} cols={9} />
    );
}

const mapStateToProps = (state) => {
    const { loot } = state.game;
    return { loot }
};

export default connect(mapStateToProps)(Stock);