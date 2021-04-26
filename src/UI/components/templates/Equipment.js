import React from "react"
import { connect } from "react-redux"
import "styled-components/macro"
import { pixel_emboss } from "@UI/themes"
import store from "@store"
import { sellLoot } from "@store/gameReducer"
import Button from "@atoms/Button"
import Inventory from "@organisms/Inventory"
import DroppableSlot from "@atoms/DroppableSlot"
import GroupedStats from "@organisms/GroupedStats"
import StatBar from "@molecules/StatBar"
import { useReactiveVar, useQuery, gql } from "@apollo/client";
import { equippedVar, statsVar } from "@root/cache"
import { GET_ITEMS } from "@queries/getItems"

const Equipment = ({ character, level, sellLoot }) => {
    const { loading, error, data } = useQuery(GET_ITEMS);
    const { amulet, body, helm, weapon } = useReactiveVar(equippedVar);
    const stats = useReactiveVar(statsVar);
    const { resource_type } = stats;

    if(loading) return 'Loading...';
    if(error) return `ERROR: ${error.message}`;
    
    const items = data.items.filter(i => i.isInInventory);

    return (
        <div css={`
            display: grid;
            grid-template-columns: 150px 56px 1fr 66px;
            grid-gap: 0.5em 1em;
            height: 100%;
            grid-template-areas:
                "stats eq inv com"
                "stats eq inv act";
            grid-template-rows: 1fr min-content;
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
                    <StatBar type={resource_type} label={"RP"} value={stats.resource_max} />
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
                <Inventory items={items} />
            </section>
            <section css={`
                grid-area: act;
            `}>
                <Button text="Sell" onClick={() => {
                    const { inventory, selected } = store.getState();
                    (selected && inventory.includes(selected)) ? sellLoot(store.getState().selected) : console.log("Nothing to sell?");
                }} />
                <Button text="Scrap" onClick={() => {
                    console.log("Scrapping not implemented. :(");
                }} />
            </section>
        </div>
    );
}

const mapStateToProps = (state) => {
    const { character, level } = state;
    return { character, level }
};

export default connect(mapStateToProps, { sellLoot })(Equipment);