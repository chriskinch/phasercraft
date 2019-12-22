import React, { useEffect } from "react"
import "styled-components/macro"
import LootIcon from "../atoms/LootIcon"
import Tooltip from "./Tooltip"
import { useDrag } from "react-dnd"
import { getEmptyImage } from "react-dnd-html5-backend"
import { connect } from "react-redux"
import { equipLoot, unequipLoot } from "../../../store/gameReducer"
import store from "../../../store"

const Loot = ({id, loot, isSelected, setSelected, equipLoot, unequipLoot}) => {
    console.log("SELECTED LOOT: ", isSelected);
    const { category, color, icon, set, hide } = loot;

    let [{ isDragging }, drag, preview] = useDrag({
        item: { type: set, category, color, icon },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                const equiptment = store.getState().equipment;
                switch(dropResult.slot) {
                    case "amulet":
                    case "body":
                    case "helm":
                    case "weapon":
                        if(equiptment[set]) unequipLoot(equiptment[set]);
                        equipLoot(loot);
                        break;
                    case "inventory":
                        unequipLoot(loot);
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
        <div ref={drag} css={`
            ${draggingCSS}
            display: ${hide ? 'none' : 'block'}
        `}>
            <div dangerouslySetInnerHTML={{__html: "<!-- some comment -->"}} />
            <Tooltip id={id} loot={loot} />
            <div data-tip data-for={id}>
                <LootIcon {...loot} id={id} isSeletced={isSelected} onClick={ () => setSelected(id) } />
            </div>
        </div>
    );
};

export default connect(null, {equipLoot, unequipLoot})(Loot);