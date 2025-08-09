import React, { useState } from "react";
import { Tooltip } from "react-tooltip";

import Stats from "./Stats";
import Price from "@components/Price";
import { connect } from "react-redux";

import type { LootItem, Equipment } from "@/types/game";
import type { LootStat } from "@/types/game";
import type { RootState } from "@store";


interface ItemTooltipProps {
  id: string;
  loot: LootItem;
  equipment: Equipment;
}

const ItemTooltip: React.FC<ItemTooltipProps> = ({ id, loot, equipment }) => {
  const { name, set, color, stats, cost } = loot;
  const [compare, setCompare] = useState<LootStat[] | null>(null);
  
  const convertStatsToArray = (statsArray: LootStat[], isComparison = false) => {
    return statsArray
      .filter(stat => !isComparison || (stat.rounded || stat.value) !== 0)
      .map((stat) => ({
        id: stat.id,
        name: stat.name,
        value: stat.rounded || stat.value || 0,
        polarity: isComparison ? stat.polarity : undefined,
      }));
  };
  
  const afterShowHandler = () => {
    if (loot && equipment[loot.set] && loot !== equipment[loot.set]) {
      const equippedItem = equipment[loot.set];
      if (equippedItem) {
        setCompare(compareStats(loot, equippedItem));
      }
    } else {
      setCompare(null);
    }
  };
  
  const compareStats = (selectedLoot: LootItem, equippedLoot: LootItem): LootStat[] => {    
    // Create maps for O(1) lookup
    const selectedMap = new Map(selectedLoot.stats.map(stat => [stat.name, stat]));
    const equippedMap = new Map(equippedLoot.stats.map(stat => [stat.name, stat]));
    
    // Get all unique stat IDs from both items
    const allStatIds = new Set([...selectedMap.keys(), ...equippedMap.keys()]);
    
    const comparisons = Array.from(allStatIds).map(statId => {
      const selectedStat = selectedMap.get(statId);
      const equippedStat = equippedMap.get(statId);
      
      // Get values (default to 0 if stat doesn't exist on item)
      const selectedValue = selectedStat?.value || 0;
      const equippedValue = equippedStat?.value || 0;
      
      // Calculate difference: positive = gain, negative = loss
      const difference = selectedValue - equippedValue;
            
      return {
        name: selectedStat?.name || equippedStat?.name || statId,
        id: statId,
        value: difference,
        polarity: Math.sign(difference)
      };
    }).filter(stat => stat.value !== 0); // Only show differences
    
    return comparisons;
  };

  return (
    <Tooltip 
      className="tooltip"
      id={id}
      variant="light"
      globalCloseEvents={{ clickOutsideAnchor: true }}
      afterShow={afterShowHandler}
    >
      <div className="tooltip-content">
        <div className="tooltip-main">
          <h3 className="tooltip-title">{name}</h3>
          <label>Type: </label> <span>{set}</span>
          {stats.length > 0 && <Stats>{convertStatsToArray(stats)}</Stats>}
        </div>
        <Price cost={cost} />
        {compare && 
          <div className="tooltip-compare">
            <h4>Stat comparison</h4>
            <Stats>{convertStatsToArray(compare, true)}</Stats>
          </div>
        }
      </div>
      <style jsx>{`
        .tooltip {
          font-size: 1em;
          background-color: transparent !important;
          padding: 0;
          text-align: left;
        }
        .tooltip-content {
          display: grid;
          grid-template-columns: 1fr min-content;
          align-items: end;
          grid-gap: 0.5em;
        }
        .tooltip-main {
          border-style: solid;
          border-width: 5px;
          background: white;
          padding: 0.5em 1em;
          border-radius: 3px;
          border-color: ${color};
        }
        .tooltip-title {
          margin: 0;
        }
        .tooltip-compare {
          border-style: solid;
          border-width: 5px;
          background: white;
          padding: 0.5em 1em;
          border-radius: 3px;
          border-color: grey;
        }
      `}</style>
    </Tooltip>
  );
};

const mapStateToProps = (state: RootState) => {
  const { equipment } = state.game;
  return { equipment };
};

export default connect(mapStateToProps)(ItemTooltip);