import React from "react";
import { useSelector } from "react-redux";
import Slot from "@components/Slot";
import DetailedLoot from "@components/DetailedLoot";
import GroupedAttributes from "@components/GroupedAttributes";
import StatBar from "@components/StatBar";
import { pixel_emboss } from "@ui/themes";
import type { RootState } from "@store";

const Character: React.FC = () => {
  const {
    character,
    equipment: { amulet, body, helm, weapon },
    stats,
    stats: { resource_type },
    level
  } = useSelector((state: RootState) => state.game);

  return (
    <div className="character-container">
      <section className="character-data">
        <div className="character-level">
          <h2>Level {level.currentLevel}</h2>
          <StatBar type="experience" colour={"#eee"} label={"XP"} value={level.xpRemaining} max={level.toNextLevel} />
        </div>
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
      <section className="equipment-display">
        <Slot loot={helm} component={DetailedLoot} />
        <Slot loot={body} component={DetailedLoot} />
        <Slot loot={weapon} component={DetailedLoot} />
        <Slot loot={amulet} component={DetailedLoot} />
      </section>
      <style jsx>{`
        .character-container {
          display: grid;
          gap: 1rem;
          height: 100%;
          grid-template-columns: 170px 1fr;
        }

        .character-level {
          margin-bottom: 0.5rem;
        }

        .character-level h2 {
          float: left;
          margin-right: 0.5rem;
        }

        .character-resources {
          clear: both;
        }

        .character-resources img {
          float: left;
          height: 3rem;
          margin-right: 1rem;
          margin-bottom: 1rem;
        }
            
        .equipment-display {
          ${pixel_emboss()}
          padding: 0.5em;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: min-content min-content;
          grid-gap: 1em;
        }
      `}</style>
    </div>
  );
};

export default Character;