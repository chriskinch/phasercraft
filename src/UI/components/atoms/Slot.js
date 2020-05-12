import React from "react"
import "styled-components/macro"

import { pixel_emboss } from "@UI/themes"

const Slot = ({loot, component, background}) => {
    const Component = component;
    return (
        <div 
            css={`
                ${background ? pixel_emboss : ""}
                text-transform: capitalize;
            `}
        >
            { loot && <Component loot={loot} /> }
        </div>
    );
}

export default Slot;