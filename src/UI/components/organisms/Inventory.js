import React, { useEffect } from "react"
import "styled-components/macro"
import { useDrop, useDrag } from "react-dnd"
import { getEmptyImage } from "react-dnd-html5-backend"
import Loot from "@molecules/Loot"
import { connect } from "react-redux"
import { equipLoot, selectLoot, unequipLoot } from "@store/gameReducer"
import store from "@store"

const Inventory = ({cols=6, name, selected, equipLoot, selectLoot, unequipLoot}) => {
    // This must go here rather then inside the Loot component due to this bug:
    // https://github.com/react-dnd/react-dnd/issues/1589
    // Wraps the Loot component instead. Means some duplication of code. :(
    const list = store.getState().inventory;
    const LootDrag = (props) => {
        const { loot } = props;
        const { category, color, icon, set, uuid } = loot;
    
        let [{ isDragging }, drag, preview] = useDrag({
            item: { type: set, category, color, icon, uuid },
            end: (item, monitor) => {
                const dropResult = monitor.getDropResult();
                if (item && dropResult) {
                    const equipment = store.getState().equipment;
                    switch(dropResult.slot) {
                        case "amulet":
                        case "body":
                        case "helm":
                        case "weapon":
                            if(equipment[set]) unequipLoot(equipment[set]);
                            equipLoot(loot);
                            break;
                        default:
                            console.log("Unrecognized slot!");
                    }                
                }
            },
            collect: monitor => ({
                isDragging: monitor.isDragging(),
            })
        })

        const draggingCSS = isDragging ? `
            opacity: 0.1;
            filter: grayscale(100%);
        ` : null

        useEffect(() => {
            preview(getEmptyImage(), { captureDraggingState: true })
        });

        return (
            <div ref={drag} css={draggingCSS}>
                <Loot {...props} />
            </div>
        );
    };

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
                grid-gap: 1em;
                overflow-y: scroll;
            `}
        >
            { list &&
                list.map((loot, i) => {
                    // Check for matching selected uuid
                    console.log(selected, loot)
                    const isSelected = selected ? selected.uuid === loot.uuid : null;
                    return <LootDrag loot={loot} isSelected={isSelected} setSelected={() => {
                        selectLoot(loot)
                    }} key={loot.uuid} id={i.toString()} />
                })
            }
        </div>
    );
}

const mapStateToProps = (state) => {
    const { selected } = state;
    return { selected }
};

export default connect(mapStateToProps, {equipLoot, selectLoot, unequipLoot})(Inventory);