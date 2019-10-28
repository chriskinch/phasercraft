import React, { useEffect } from "react"
import "styled-components/macro"
import LootIcon from "../atoms/LootIcon"
import Tooltip from "./Tooltip"
import { useDrag } from "react-dnd"
import { getEmptyImage } from "react-dnd-html5-backend"
import { connect } from 'react-redux';
import { equipLoot } from "../../../store/gameReducer"
import store from "../../../store"

const Loot = ({id, loot, equipLoot}) => {
    const { category, color, icon, set } = loot;

    let [{ isDragging }, drag, preview] = useDrag({
        item: { type: set, category, color, icon },
        begin: monitor => {
            console.log("BEGIN: ", isDragging)
        },
        end: (item, monitor) => {
            console.log("END: ", monitor.internalMonitor.store.getState())
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                const slot = dropResult.slot;
                switch(slot) {
                    case "amulet":
                    case "body":
                    case "helm":
                    case "weapon":
                        equipLoot(loot);
                        break;
                    default:
                        console.log("Unrecognized slot!");
                }
                
                // console.log(store.getState());
            }
        },
        collect: monitor => {
            console.log("COLLECT: ", monitor.getItemType())
            return ({
                isDragging: monitor.isDragging(),
            })
        }
    })

    const draggingCSS = isDragging ? `
        opacity: 0.1;
        filter: grayscale(100%);
    ` : null

    const inventory = store.getState().inventory;

    useEffect(() => {
        console.log("EFFECT: ", store.getState().inventory)
        preview(getEmptyImage(), { captureDraggingState: true })
    }, [preview, inventory.length] );

    return (
        <div ref={drag} css={draggingCSS}>
            <Tooltip id={id} loot={loot} />
            <div data-tip data-for={id}>
                <LootIcon {...loot} />
            </div>
        </div>
    );
}; 

export default connect(null, {equipLoot})(Loot);