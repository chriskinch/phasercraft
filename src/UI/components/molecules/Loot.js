import React, { useEffect } from "react"
import "styled-components/macro"
import LootIcon from "../atoms/LootIcon"
import Tooltip from "./Tooltip"
import { useDrag } from "react-dnd"
import { getEmptyImage } from "react-dnd-html5-backend"
import { connect } from 'react-redux';
import { equipLoot, unequipLoot } from "../../../store/gameReducer"
import store from "../../../store"

const Loot = ({id, loot, equipLoot, unequipLoot}) => {
    const { category, color, icon, set, equipped } = loot;

    let [{ isDragging }, drag, preview] = useDrag({
        item: { type: set, category, color, icon },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                const slot = dropResult.slot;
                console.log(store.getState().inventory)
                switch(slot) {
                    case "amulet":
                    case "body":
                    case "helm":
                    case "weapon":
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
            display: ${equipped ? 'none' : 'block'}
        `}>
            <Tooltip id={id} loot={loot} />
            <div data-tip data-for={id}>
                <LootIcon {...loot} />
            </div>
        </div>
    );
}; 

export default connect(null, {equipLoot, unequipLoot})(Loot);