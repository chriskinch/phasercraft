import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { pixel_emboss } from "@ui/themes";
import { sellLoot } from "@store/gameReducer";
import Button from "@components/Button";
import Inventory from "@components/Inventory";
import DroppableSlot from "@components/DroppableSlot";
import GroupedAttributes from "@components/GroupedAttributes";
import StatBar from "@components/StatBar";
import type { RootState } from "@store";


const Equipment: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    character,
    equipment,
    equipment: { amulet, body, helm, weapon },
    stats,
    stats: { resource_type },
    level,
    selected,
    inventory
  } = useSelector((state: RootState) => state.game);

  return (
    <div className="equipment-container">
      <section className="character-data">
        <h2>Level {level.currentLevel}</h2>
        <div className="character-resources">
          <img 
            src={`ui/player/${character}.gif`}
            alt="This is you!"
          />
          <StatBar type={"health"} label={"HP"} value={stats.health_max} />
          <StatBar type={resource_type} label={"RP"} value={stats.resource_max} />
        </div>
        <GroupedAttributes stats={stats} />
      </section>
      <section className="equipment-section">
        <DroppableSlot slot="helm" loot={helm} />
        <DroppableSlot slot="body" loot={body} />
        <DroppableSlot slot="weapon" loot={weapon} />
        <DroppableSlot slot="amulet" loot={amulet} />
      </section>
      <section className="inventory-section">
        <Inventory />
      </section>
      <section className="actions-section">
        <Button text="Sell" onClick={() => {
          (selected && inventory.includes(selected)) ? dispatch(sellLoot(selected)) : console.log("Nothing to sell?");
        }} />
        <Button text="Scrap" onClick={() => {
          console.log("Scrapping not implemented. :(");
        }} />
      </section>
      <style jsx>{`
        .equipment-container {
          display: grid;
          gap: 0.5rem 1rem;
          height: 100%;
          grid-template-columns: 150px 56px 1fr 66px;
          grid-template-areas: "stats eq inv com" "stats eq inv act";
          grid-template-rows: 1fr min-content;
        }
        
        .character-data {
          grid-area: stats;
        }
        
        .character-data h2 {
          margin-bottom: 0.5rem;
        }

        .character-resources img {
          float: left;
          height: 3rem;
          margin-right: 1rem;
          margin-bottom: 1rem;
        }
        
        .equipment-section {
          grid-area: eq;
          display: grid;
          grid-template-rows: repeat(4, 1fr);
        }
        
        .inventory-section {
          grid-area: inv;
          ${pixel_emboss()}
          padding: 0.5em;
        }
        
        .actions-section {
          grid-area: act;
        }
      `}</style>
    </div>
  );
};

export default Equipment;