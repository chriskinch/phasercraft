import React from "react"
import 'styled-components/macro'
import round from "lodash/round"

const adjustStats = (stat) => {
    const funcs = {
        attack_power: (v) => ({...stat, adjusted: v/2, format: "basic", label: "Attack Power", short: "Atk Pwr", abr: "AP"}),
        attack_speed: (v) => ({...stat, adjusted: 60/v, format: "percent", label: "Attack Speed", short: "Atk Spd", abr: "AS"}),
        critical_chance: (v) => ({...stat, adjusted: v/10, format: "percent", label: "Critical Chance", short: "Crit", abr: "C"}),
        defence: (v) => ({...stat, adjusted: v/2, format: "basic", label: "Defence", short: "Def", abr: "D"}),
        health_max: (v) => ({...stat, adjusted: v*10, format: "basic", label: "Health Max", short: "Health", abr: "H"}),
        health_regen_rate: (v) => ({...stat, adjusted: 100/v, format: "percent", label: "Regen Rate", short: "Reg R", abr: "RR"}),
        health_regen_value: (v) => ({...stat, adjusted: v/10, format: "basic", label: "Regen Value", short: "Reg V", abr: "RV"}),
        magic_power: (v) => ({...stat, adjusted: v/2, format: "basic", label: "Magic Power", short: "Mgc Pwr", abr: "MP"}),
        speed: (v) => ({...stat, adjusted: v/10, format: "basic", label: "Speed", short: "Spd", abr: "S"}),
        default: (s) => ({...stat, adjusted: s.value, format: "basic", label: s.name, short: "", abr: ""})
    };
    return funcs?.[stat.name] ? funcs[stat.name](stat.value) : funcs.default(stat);
}

const Stat = ({delimeter=":", stat, polarity, icon}) => {
    // console.log("RAW: ", stat)
    const processed = adjustStats(stat);
    const { label, adjusted } = processed;
    // console.log("ADJ: ", processed)
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
                { round(adjusted, 2) }
            </dd>
        </>
    )
}

export default Stat;