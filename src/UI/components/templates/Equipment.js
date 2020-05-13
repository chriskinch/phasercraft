import React from "react"
import { connect } from "react-redux"
import "styled-components/macro"
import { pixel_emboss } from "@UI/themes"
import Inventory from "@organisms/Inventory"
import DroppableSlot from "@atoms/DroppableSlot"
import Slot from "@atoms/Slot"
import DetailedLoot from "@molecules/DetailedLoot"
import GroupedStats from "@organisms/GroupedStats"
import StatBar from "@molecules/StatBar"

const Equipment = ({
    character,
    equipment,
    equipment: { amulet, body, helm, weapon },
    stats,
    stats: { resource_type },
    level,
    selected
}) => {
    return (
        <div css={`
            display: grid;
            grid-template-columns: 150px 56px 1fr;
            grid-gap: 0.5em 1em;
            height: 100%;
            grid-template-areas:
                "stats eq inv"
                "stats eq com";
            grid-template-rows: 1fr 101px;
        `}>
            <section css={"grid-area: stats"}>
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
                    <StatBar type={"health"} label={"HP"} value={stats.health_max} />
                    <StatBar type={resource_type} label={"RP"} value={stats.health_max} />
                </div>
                <GroupedStats stats={stats} />
            </section>
            <section css={`
                grid-area: eq;
                display: grid;
                grid-template-rows: repeat(4, 1fr);
            `}>
                <DroppableSlot slot="helm" loot={helm} />
                <DroppableSlot slot="body" loot={body}  />
                <DroppableSlot slot="weapon" loot={weapon}  />
                <DroppableSlot slot="amulet" loot={amulet}  />
            </section>
            <section css={`
                grid-area: inv;
                ${ pixel_emboss }
                padding: 0.5em;
            `}>
                <Inventory />
            </section>
            <section css={`
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-gap: 1em;
                grid-area: com;
                ${ pixel_emboss }
                padding: 0.5em;
            `}>
                { selected &&
                    <>
                        <Slot loot={equipment[selected.set]} component={DetailedLoot} compare={selected} />
                        <Slot loot={selected} component={DetailedLoot} compare={equipment[selected.set]} />
                    </>
                }
            </section>
        </div>
    );
}

const mapStateToProps = (state) => {
    const { character, equipment, stats, level, selected } = state;
    return { character, equipment, stats, level, selected }
};

export default connect(mapStateToProps)(Equipment);