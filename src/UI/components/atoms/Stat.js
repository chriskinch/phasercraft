import React from "react";
import 'styled-components/macro';
import round from "lodash/round"

const Stat = ({delimeter=":", icon, info, label, type="label", value, compare_value=0}) => {
    const formatted_label = info ? info[type][label] : type.split("_").join(" ");
    const icon_css = (icon) ? `
        background: url(${icon}) no-repeat left center;
        padding-left: 16px;
    ` : null;
    
    const diff = round(value - compare_value, 2);
    const modulated_diff = Math.sign(value) * diff;
    const display_diff = modulated_diff === 0 ? '-' : modulated_diff;
    const diff_colour = modulated_diff === 0 ? 'grey' : modulated_diff > 0 ? 'green' : 'red';

    // console.log(value, compare_value, diff, _.round(diff, 3), modulated_diff, display_diff)

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
                { compare_value !== null && <span css={`color: ${diff_colour};`}>({display_diff})</span> }
            </dd>
        </>
    )
}

export default Stat;