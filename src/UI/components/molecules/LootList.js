import React from "react"
import "styled-components/macro"
import { useDrop } from "react-dnd"
import Loot from "../molecules/Loot"
import { connect } from "react-redux"
import { selectLoot } from "../../../store/gameReducer"

const LootList = ({cols=4, list, name, selected, selectLoot}) => {
    const [, drop] = useDrop({
        accept: ["amulet", "body", "helm", "weapon"],
        drop: () => ({ slot: name })
    })

    return (
        <div 
            ref={drop}
            css={`
                display: grid;
                grid-template-columns: repeat(${cols}, 1fr);
                grid-template-rows: min-content min-content min-content min-content;
                height: calc(100vh - 145px);
                width: 100%;
                overflow-y: scroll;
            `}
        >
            { list &&
                list.map((loot, i) => {
                    // Check for matching selected uuid
                    const isSelected = selected ? selected.uuid === loot.uuid : null;
                    return <Loot loot={loot} isSelected={isSelected} setSelected={() => {
                        selectLoot(loot)
                    }} key={i} id={i.toString()} />
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