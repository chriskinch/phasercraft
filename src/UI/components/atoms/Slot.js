import React from "react"
import "styled-components/macro"

import { pixel_emboss } from "@UI/themes"

const Slot = ({loot, component, background, compare}) => {
    const Component = component;
    return (
        <div 
            css={`
                ${background ? pixel_emboss : ""}
                text-transform: capitalize;         
            `}
        >
            { loot && <Component loot={loot} compare={compare} /> }
        </div>
    );
}

export default Slot;