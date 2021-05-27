import { v4 as uuid } from 'uuid';
import React, { useState } from "react"
import ReactTooltip from "react-tooltip"
import "styled-components/macro"
import Stats from "./Stats"
import Price from "@atoms/Price"
import { connect } from "react-redux"
import find from "lodash/find"

const Tooltip = ({ id, loot, equipment }) => {
    const { color, cost, stats } = loot;
    const [compare, setCompare] = useState(null);

    const afterShowHandler = () => {
        loot && equipment[loot.set] && loot !== equipment[loot.set] ? setCompare(compareStats(stats, equipment?.[loot.set]?.stats)) : setCompare(null);
    }
    
    const compareStats = (lootStats = [], equipStats = []) => {
        const list = [...lootStats, ...equipStats];
        const unique = [...new Set(list.map(l => l.name))];
        return unique.map(key =>{
            const diff = (find(lootStats, ['name', key])?.value || 0) - (find(equipStats, ['name', key])?.value || 0);
            return {
                id: uuid(),
                name: key,
                value: diff,
                polarity: Math.sign(diff),
            }
        });
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
                    <Stats stats={stats} />
                </div>
                <Price cost={cost} color={color} />
                { compare && 
                    <div css={`${styles} border-color: grey;`}>
                        <h4>Stat comparison</h4>
                        <Stats stats={compare} />
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