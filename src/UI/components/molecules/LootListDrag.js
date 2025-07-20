import React, { useEffect } from "react"

import { useDrop, useDrag } from "react-dnd"
import { getEmptyImage } from "react-dnd-html5-backend"
import Loot from "@components/Loot"
import { connect } from "react-redux"
import { equipLoot, selectLoot, unequipLoot } from "@store/gameReducer"
import store from "@store"

const LootListDrag = ({cols=6, list, name, selected, equipLoot, selectLoot, unequipLoot}) => {
    // This must go here rather then inside the Loot component due to this bug:
    // https://github.com/react-dnd/react-dnd/issues/1589
    // Wraps the Loot component instead. Means some duplication of code. :(
    const LootDrag = (props) => {
        const { loot } = props;
        const { category, color, icon, set, uuid } = loot;
    
        let [{ isDragging }, drag, preview] = useDrag({
            type: set,
            item: { category, color, icon, uuid },
            end: (item, monitor) => {
                const dropResult = monitor.getDropResult();
                if (item && dropResult) {
                    const equipment = store.getState().game.equipment;
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

        useEffect(() => {
            preview(getEmptyImage(), { captureDraggingState: true })
        });

        return (
            <div ref={drag} className={isDragging ? 'dragging' : ''}>
                <Loot {...props} />
                <style jsx>{`
                    .dragging {
                        opacity: 0.1;
                        filter: grayscale(100%);
                    }
                `}</style>
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
            className="loot-grid"
        >
            { list &&
                list.map((loot, i) => {
                    // Check for matching selected uuid
                    const isSelected = selected ? selected.id === loot.id : null;
                    return <LootDrag loot={loot} isSelected={isSelected} setSelected={() => {
                        selectLoot(loot)
                    }} key={loot.id} id={i.toString()} />
                })
            }
            <style jsx>{`
                .loot-grid {
                    display: grid;
                    gap: 1rem;
                    overflow-y: scroll;
                    grid-template-columns: repeat(${cols}, 1fr);
                }
            `}</style>
        </div>
    );
}

const mapStateToProps = (state) => {
    const { selected } = state.game;
    return { selected }
};

export default connect(mapStateToProps, {equipLoot, selectLoot, unequipLoot})(LootListDrag);