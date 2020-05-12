import React from "react"
import { connect } from "react-redux"
import "styled-components/macro"
import Slot from "@atoms/Slot"
import Stats from "@molecules/Stats"
import StatBar from "@molecules/StatBar"
import DetailedLoot from "@molecules/DetailedLoot"
import pick from "lodash/pick"
import { pixel_emboss } from "@UI/themes"

const Character = ({ character, equipment, stats, level }) => {
    const { amulet, body, helm, weapon } = equipment;
    const { resource_type } = stats;
    console.log(stats)
    const offence_state = pick(stats, ["attack_power", "magic_power", "attack_speed", "critical_chance"]);
    const defence_stats = pick(stats, ["health_regen_rate", "health_regen_value", "defence", "speed"]);
    const support_stats = pick(stats, ["resource_regen_rate", "resource_regen_value"]);

    const colour = (resource_type === "Mana") ? "blue" :
        (resource_type === "Rage") ? "red" :
        (resource_type === "Energy") ? "yellow" :
        "white";

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
                    <StatBar colour={"Green"} label={"HP"} value={stats.health_max} />
                    <StatBar colour={colour} label={"RP"} value={stats.health_max} />
                </div>
                <Stats>
                    {offence_state}
                </Stats>
                <Stats>
                    {defence_stats}
                </Stats>
                <Stats>
                    {support_stats}
                </Stats>
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