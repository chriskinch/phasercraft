import React from "react"

import Loot from "@components/Loot"
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
        <div className="loot-list">
            { list && items }
            <style jsx>{`
                .loot-list {
                    display: grid;
                    gap: 0.5rem;
                    overflow-y: scroll;
                    grid-template-columns: repeat(${cols}, 1fr);
                    height: calc(100vh - 158px);
                }
            `}</style>
        </div>
    );
}

const mapStateToProps = (state) => {
    const { selected } = state.game;
    return { selected }
};

export default connect(mapStateToProps, {selectLoot})(LootList);