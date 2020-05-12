import React from "react"
import { connect } from "react-redux"
import "styled-components/macro"
import { pixel_emboss } from "@UI/themes"
import Inventory from "@organisms/Inventory"
import DroppableSlot from "@atoms/DroppableSlot"
import Stats from "@molecules/Stats"
import StatBar from "@molecules/StatBar"
import pick from "lodash/pick"

const Equipment = ({ character, equipment, stats, level }) => {
    const { amulet, body, helm, weapon } = equipment;
    const { resource_type } = stats;
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
            grid-template-columns: 170px 56px 1fr;
            grid-gap: 2em;
            height: 100%;
        `}>
            <section>
                <h2 css="margin-bottom:0.5em">Level {level.currentLevel}</h2>
                <div>
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
                    <StatBar colour={colour} label={"RP"} value={stats.resource_max} />
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
                display: grid;
                grid-template-rows: repeat(4, 1fr);
            `}>
                <DroppableSlot slot="helm" loot={helm} />
                <DroppableSlot slot="body" loot={body}  />
                <DroppableSlot slot="weapon" loot={weapon}  />
                <DroppableSlot slot="amulet" loot={amulet}  />
            </section>
            <section css={`
                ${ pixel_emboss }
                padding: 0.5em;
            `}>
                <Inventory />
            </section>
        </div>
    );
}

const mapStateToProps = (state) => {
    const { character, equipment, stats, level } = state;
    return { character, equipment, stats, level }
};

export default connect(mapStateToProps)(Equipment);