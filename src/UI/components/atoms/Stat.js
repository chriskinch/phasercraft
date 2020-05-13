import React from "react";
import 'styled-components/macro';

const Stat = ({delimeter=":", icon, info, label, type="label", value}) => {
    const formatted_label = info ? info[type][label] : type.split("_").join(" ");
    // console.log(info, info && info.short )
    const icon_css = (icon) ? `
        background: url(${icon}) no-repeat left center;
        padding-left: 16px;
    ` : null;
    const format = (info) ? info[type].format : null;
    const formatted_value = (format === "percent") ? `${Math.abs(value*10).toFixed(1)}%` : value.toFixed(0);

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
                float: right;
                margin-left: 0;
            `}>{ formatted_value }</dd>
        </>
    )
}

export default Stat;