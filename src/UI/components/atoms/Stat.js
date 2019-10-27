import React from "react";
import 'styled-components/macro';

const Stat = ({label, value, lw = "110px", vw = "50px"}) => {
    return (
        <>
            <dt css={`
                clear: left;
                float: left;
                text-align: left;
                text-transform: capitalize;
                white-space: nowrap;
                width: ${lw};
            `}>{ label.replace("_", " ") }:</dt>
            <dd css={`
                float: left;
                margin-left: 0;
                width: ${vw};
            `}>{ value }</dd>
        </>
    )
}

export default Stat;