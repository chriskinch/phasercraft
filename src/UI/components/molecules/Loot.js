import React, { useEffect } from "react"
import "styled-components/macro"
import LootIcon from "../atoms/LootIcon"
import Tooltip from "./Tooltip"
import { useDrag } from "react-dnd"
import { getEmptyImage } from "react-dnd-html5-backend"

const Loot = ({id, item}) => {
    const { category, color, icon, set } = item;

    const [{ isDragging }, drag, preview] = useDrag({
        item: { category, color, icon, type: set },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                alert(`You dropped ${icon} into ${dropResult.type}!`)
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
            <Tooltip id={id} item={item} />
            <div data-tip data-for={id}>
                <LootIcon {...item} />
            </div>
        </div>
    );
}; 

export default Loot;