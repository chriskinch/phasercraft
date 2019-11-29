import React from "react"
import { connect } from "react-redux"
import { pixel_emboss } from "../../themes"
import LootList from "../molecules/LootList"
import "styled-components/macro"

const Stock = ({ loot }) => {
    return (
        <div css={`
            ${ pixel_emboss }
            height: 100%;
            padding-top: 2px;
            width: 100%;
        `}>
            <LootList list={loot} name={"stock"} cols={9} />
        </div>
    );
}

const mapStateToProps = (state) => {
    const { loot } = state;
    return { loot }
};

export default connect(mapStateToProps)(Stock);