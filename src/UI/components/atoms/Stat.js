import React from "react";
import 'styled-components/macro';
import round from "lodash/round"

const Stat = ({delimeter=":", icon, label, value, polarity}) => {
    const icon_css = (icon) ? `
        background: url(${icon}) no-repeat left center;
        padding-left: 16px;
    ` : null;

    const colour = polarity > 0 ? 'green' : polarity < 0 ? 'red' : 'grey';

    return (
        <>
            <dt css={`
                ${icon_css}
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

export default Stat;