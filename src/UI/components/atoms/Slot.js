import React from "react";
import 'styled-components/macro';
import { pixel_emboss } from '../../themes';
import { useDrop } from 'react-dnd';

const Slot = ({ slot }) => {
    console.log(slot)
    const [{ canDrop, isOver }, drop] = useDrop({
        accept: slot,
        drop: () => ({ name: slot }),
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })
    const isActive = canDrop && isOver
    const bg_color = (isActive) ? 'darkgreen' : (canDrop) ? 'darkkhaki' : null;

    return (
        <div 
            ref={drop}
            css={`
                ${pixel_emboss()}
                background-color: ${bg_color};
                text-transform: capitalize;
            `}
        >{slot}</div>
    );
}

export default Slot;