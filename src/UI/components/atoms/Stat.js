import React from "react";
import 'styled-components/macro';
import round from "lodash/round"

const Stat = ({delimeter=":", icon, label, type, value}) => {
    const formatted_label = label ? label : type.split("_").join(" ");
    const icon_css = (icon) ? `
        background: url(${icon}) no-repeat left center;
        padding-left: 16px;
    ` : null;

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
            `}>{ formatted_label }{delimeter}</dt>
            <dd css={`
                overflow: hidden;
                text-align: right;
                margin-left: 0;
            `}>
                { round(value, 2) }
            </dd>
        </>
    )
}

export default Stat;