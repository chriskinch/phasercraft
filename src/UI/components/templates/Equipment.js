import React from "react"
import { connect } from "react-redux"
import "styled-components/macro"
import { pixel_emboss } from "@UI/themes"
import Inventory from "@organisms/Inventory"
import DroppableSlot from "@atoms/DroppableSlot"
import GroupedStats from "@organisms/GroupedStats"
import StatBar from "@molecules/StatBar"

const Equipment = ({ character, equipment: { amulet, body, helm, weapon }, stats, stats: { resource_type }, level }) => {    
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
                    <StatBar type={"health"} label={"HP"} value={stats.health_max} />
                    <StatBar type={resource_type} label={"RP"} value={stats.health_max} />
                </div>
                <GroupedStats stats={stats} />
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