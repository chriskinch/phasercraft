import React from "react"
import "styled-components/macro"
import Loot from "@molecules/Loot"
import { connect } from "react-redux"
import { selectLoot } from "@store/gameReducer"

const LootList = ({cols=4, list, selected, selectLoot}) => {
    const items = [];
    for(const loot of list){
        // Check for matching selected id
        const isSelected = selected ? selected.id === loot.id : null;
        items.push(<Loot 
            loot={loot}
            isSelected={isSelected}
            setSelected={() => { selectLoot(loot) }}
            key={loot.id}
        />);
    }
    return ( 
        <div 
            css={`
                display: grid;
                grid-template-columns: repeat(${cols}, 1fr);
                grid-gap: 0.5em;
                height: calc(100vh - 158px);
                overflow-y: scroll;
            `}
        >
            { list && items }
        </div>
    );
}

const mapStateToProps = (state) => {
    const { selected } = state;
    return { selected }
};

export default connect(mapStateToProps, {selectLoot})(LootList);