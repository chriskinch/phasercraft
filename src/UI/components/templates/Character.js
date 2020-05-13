import React from "react"
import { connect } from "react-redux"
import "styled-components/macro"
import Slot from "@atoms/Slot"
import GroupedStats from "@organisms/GroupedStats"
import StatBar from "@molecules/StatBar"
import DetailedLoot from "@molecules/DetailedLoot"
import { pixel_emboss } from "@UI/themes"

const Character = ({ character, equipment: { amulet, body, helm, weapon }, stats, stats: { resource_type }, level }) => {
    return (
        <div css={`
            display: grid;
            grid-template-columns: 170px 1fr;
            grid-gap: 1em;
            height: 100%;
        `}>
            <section>
                <div css="margin-bottom:0.5em">
                    <h2 css={`
                        float:left;
                        margin-right:0.5em
                    `}>Level {level.currentLevel}</h2>
                    <StatBar colour={"#eee"} label={"XP"} value={level.xpRemaining} max={level.toNextLevel} />
                </div>
                <div css="clear:both">
                    <img 
                        src={`UI/player/${character}.gif`}
                        alt="This is you!"
                        css={`
                            float: left;
                            height: 3em;
                            margin-right: 1em;
                            margin-bottom: 1em;
                        `}
                    />
                    <StatBar type={"health"} label={"HP"} value={stats.health_max} />
                    <StatBar type={resource_type} label={"RP"} value={stats.health_max} />
                </div>
                <GroupedStats stats={stats} />
            </section>
            <section css={`
                ${ pixel_emboss }
                padding: 0.5em;
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: min-content min-content;
                grid-gap: 1em;
            `}>
                <Slot slot="helm" loot={helm} component={DetailedLoot} />
                <Slot slot="body" loot={body} component={DetailedLoot} />
                <Slot slot="weapon" loot={weapon} component={DetailedLoot} />
                <Slot slot="amulet" loot={amulet} component={DetailedLoot} />
            </section>
        </div>
    );
}

const mapStateToProps = (state) => {
    const { character, equipment, stats, level } = state;
    return { character, equipment, stats, level }
};

export default connect(mapStateToProps)(Character);