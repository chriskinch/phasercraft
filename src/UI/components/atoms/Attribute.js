import React from "react";
import 'styled-components/macro';
import round from "lodash/round"

const Attribute = ({delimeter=":", label, value, polarity}) => {

    const colour = polarity > 0 ? 'green' : polarity < 0 ? 'red' : 'grey';

    return (
        <>
            <dt css={`
                clear: left;
                float: left;
                margin-right: 0.5em;
                text-align: left;
                text-transform: capitalize;
                white-space: nowrap;
            `}>{ label }{delimeter}</dt>
            <dd css={`
                overflow: hidden;
                text-align: right;
                margin-left: 0;
                color: ${polarity ? colour : 'black'};
            `}>
                { round(value, 2) }
            </dd>
        </>
    )
}

export default Attribute;