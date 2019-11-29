import React from "react"
import { connect } from "react-redux"
import "styled-components/macro"
import Inventory from "../organisms/Inventory"
import Slot from "../atoms/Slot"
import Stats from "../molecules/Stats"
import StatBar from "../molecules/StatBar"
import pick from "lodash/pick"

const Equipment = ({ character, equipment, stats }) => {
    const { amulet, body, helm, weapon } = equipment;
    const { resource_type } = stats;
    const offence_state = pick(stats, ["attack_power", "magic_power", "attack_speed", "critical_chance"]);
    const defence_stats = pick(stats, ["health_regen_rate", "health_regen_value", "defence", "speed"]);

    const colour = (resource_type === "Mana") ? "blue" :
        (resource_type === "Rage") ? "red" :
        (resource_type === "Energy") ? "yellow" :
        "white"; 
    
    return (
        <div css={`
            display: flex;
        `}>
            <section css={`
                width: 170px;
            `}>
                <h2>Level 1</h2>
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
            </section>
            <section css="width: 62px; margin: 0 2em;">
                <Slot slot="helm" loot={helm} />
                <Slot slot="body" loot={body}  />
                <Slot slot="weapon" loot={weapon}  />
                <Slot slot="amulet" loot={amulet}  />
            </section>
            <section css="flex-grow: 1; padding: 0 6px;">
                <Inventory />
            </section>
        </div>
    );
}

const mapStateToProps = (state) => {
    const { character, equipment, stats } = state;
    return { character, equipment, stats }
};

export default connect(mapStateToProps)(Equipment);