import React from "react"
import "styled-components/macro"
import Loot from "@molecules/Loot"
import { connect } from "react-redux"
import { selectLoot } from "@store/gameReducer"

const LootList = ({cols=4, list, selected, tooltips, selectLoot}) => {
    return ( 
        <div 
            css={`
                display: grid;
                grid-template-columns: repeat(${cols}, 1fr);
                grid-gap: 0.5em;
                grid-auto-rows: min-content;
                height: calc(100vh - 158px);
                overflow-y: scroll;
            `}
        >
            { list &&
                list.map((loot, i) => {
                    // Check for matching selected uuid
                    const isSelected = selected ? selected.uuid === loot.uuid : null;
                    return <Loot 
                        loot={loot}
                        isSelected={isSelected}
                        setSelected={() => { selectLoot(loot) }}
                        key={loot.uuid}
                        tooltips={tooltips}
                    />
                })
            }
        </div>
    );
}

const mapStateToProps = (state) => {
    const { selected } = state;
    return { selected }
};

export default connect(mapStateToProps, {selectLoot})(LootList);