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

    const [{ isDragging }, drag, preview] = useDrag({
        item: { type: set, category, color, icon },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                equipLoot(loot);
                console.log(`You dropped ${icon} into ${dropResult.slot}!`)
                console.log(store.getState());
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
            <Tooltip id={id} loot={loot} />
            <div data-tip data-for={id}>
                <LootIcon {...loot} />
            </div>
        </div>
    );
}; 

export default connect(null, {equipLoot})(Loot);