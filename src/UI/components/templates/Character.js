import React from "react"
import { connect } from "react-redux"
import "styled-components/macro"
import Slot from "@atoms/Slot"
import Stats from "@molecules/Stats"
import StatBar from "@molecules/StatBar"
import pick from "lodash/pick"
import store from '@store';


const Character = ({ character, equipment, stats, xp }) => {
    const { amulet, body, helm, weapon } = equipment;
    const { resource_type } = stats;
    const offence_state = pick(stats, ["attack_power", "magic_power", "attack_speed", "critical_chance"]);
    const defence_stats = pick(stats, ["health_regen_rate", "health_regen_value", "defence", "speed"]);
    const support_stats = pick(stats, ["resource_regen_rate", "resource_regen_value"]);

    const colour = (resource_type === "Mana") ? "blue" :
        (resource_type === "Rage") ? "red" :
        (resource_type === "Energy") ? "yellow" :
        "white";

    const xpCurve = l => (l*l) + (l*10);
    const givenXpOf = (exp = 0, count = 1) => {
        const next = xpCurve(count);
        const remainder = exp - next;
        return (remainder < 0) ? {xpRemaining: exp, toNextLevel: next, currentLevel: count} : givenXpOf(remainder, count + 1);
    }
    const experience = givenXpOf(xp);
    console.log(stats, store.getState().stats)
    return (
        <div css={`
            display: flex;
        `}>
            <section css={`
                width: 50%;
            `}>
                <div css="margin-bottom:0.5em">
                    <h2 css={`
                        float:left;
                        margin-right:0.5em
                    `}>Level {experience.currentLevel}</h2>
                    <StatBar colour={"#eee"} label={"XP"} value={experience.xpRemaining} max={experience.toNextLevel} />
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
                    <StatBar colour={"Green"} label={"HP"} value={stats.health_value} max={stats.health_max} />
                    <StatBar colour={colour} label={"RP"} value={stats.resource_value} max={stats.resource_max} />
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
            <section css="width: 50%; margin: 0 2em;">
                <Slot slot="helm" loot={helm} />
                <Slot slot="body" loot={body}  />
                <Slot slot="weapon" loot={weapon}  />
                <Slot slot="amulet" loot={amulet}  />
            </section>
        </div>
    );
}

const mapStateToProps = (state) => {
    const { character, equipment, stats, xp } = state;
    return { character, equipment, stats, xp }
};

export default connect(mapStateToProps)(Character);