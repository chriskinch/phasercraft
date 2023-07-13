import React, { useState } from "react"
import ReactTooltip from "react-tooltip"
import "styled-components/macro"
import Stats from "./Stats"
import Price from "@atoms/Price"
import { connect } from "react-redux"

const Tooltip = ({ id, loot, equipment }) => {
    const { name, set, color, stats, cost } = loot;
    const [compare, setCompare] = useState(null);
    const afterShowHandler = () => {
        loot && equipment[loot.set] && loot !== equipment[loot.set] ? setCompare(compareStats(loot, equipment[loot.set])) : setCompare(null);
    }
    const compareStats = (l, e) => {
        const merged = {};
        Object.keys({...l.stats, ...e.stats}).forEach(key =>{
            const ls = l.stats[key] ? l.stats[key] : { adjusted: 0, rounded: 0, value: 0 };
            const es = e.stats[key] ? e.stats[key] : { adjusted: 0, rounded: 0, value: 0 };
            merged[key] = {
                ...ls,
                ...es,
                adjusted: ls.adjusted - es.adjusted,
                rounded: ls.rounded - es.rounded,
                value: ls.value - es.value,
                polarity: Math.sign(Math.abs(ls.rounded)  - Math.abs(es.rounded))
            }; 
        })
        return merged;
    }
    const styles = `
        border-style: solid;
        border-width: 5px;
        background: white;
        padding: 0.5em 1em;
        border-radius: 3px;
        border-color: ${color};
    `;

    return (
        <ReactTooltip 
            css={`
                font-size: 1em;
                background-color: transparent !important;
                padding: 0;
                text-align: left;
            `}
            id={id}
            type="light"
            globalEventOff="click"
            afterShow={afterShowHandler}
        >
            <div css={`
                display: grid;
                grid-template-columns: 1fr min-content;
                align-items: end;
                grid-gap: 0.5em;
            `}>
                <div css={`${styles}`}>
                    <h3 css={`margin: 0;`}>{ name }</h3>
                    <label>Type: </label> <span>{ set }</span>
                    { stats.length > 0 && <Stats>{ stats }</Stats> }
                </div>
                <Price cost={cost} color={color} />
                { compare && 
                    <div css={`${styles} border-color: grey;`}>
                        <h4>Stat comparison</h4>
                        <Stats>{ compare }</Stats>
                    </div>
                }
            </div>
            
        </ReactTooltip>
    );
}

const mapStateToProps = (state) => {
    const { equipment } = state;
    return { equipment }
};

export default connect(mapStateToProps)(Tooltip);