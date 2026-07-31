import React, { useState } from "react";
import { Tooltip } from "react-tooltip";

import Stats from "./Stats";
import Price from "@components/Price";
import { connect } from "react-redux";

import type { LootItem, Equipment } from "@/types/game";
import type { LootStat } from "@/types/game";
import type { RootState } from "@store";
import { appliedStatValue, formatStatValue, statPolarity } from "@/lib/statConversion";
import styles from "./ItemTooltip.module.css";

interface ItemTooltipProps {
    id: string;
    loot: LootItem;
    equipment: Equipment;
}

const ItemTooltip: React.FC<ItemTooltipProps> = ({ id, loot, equipment }) => {
    const { name, set, color, stats, cost } = loot;
    const [compare, setCompare] = useState<LootStat[] | null>(null);

    // Comparison rows already hold a converted difference; raw item stats are still
    // in pool units, so they go through the same conversion the reducer applies.
    const displayValue = (stat: LootStat, isComparison: boolean) =>
        isComparison ? (stat.value ?? 0) : appliedStatValue(stat.name, stat.value ?? 0);

    const convertStatsToArray = (statsArray: LootStat[], isComparison = false) => {
        return statsArray
            .filter((stat) => !isComparison || displayValue(stat, isComparison) !== 0)
            .map((stat) => {
                const value = displayValue(stat, isComparison);
                return {
                    id: stat.id,
                    name: stat.name,
                    value,
                    polarity: isComparison ? stat.polarity : undefined,
                    // Carry the unit through so a duration reads "0.98s" and a chance
                    // reads "13%" instead of both being a bare number.
                    display: formatStatValue(stat.name, value, { signed: isComparison }),
                };
            });
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
        const selectedMap = new Map(selectedLoot.stats.map((stat) => [stat.name, stat]));
        const equippedMap = new Map(equippedLoot.stats.map((stat) => [stat.name, stat]));

        // Get all unique stat IDs from both items
        const allStatIds = new Set([...selectedMap.keys(), ...equippedMap.keys()]);

        const comparisons = Array.from(allStatIds)
            .map((statId) => {
                const selectedStat = selectedMap.get(statId);
                const equippedStat = equippedMap.get(statId);

                // Compare the magnitudes that actually get applied, so the number shown
                // is in real stat units rather than raw pool units.
                const selectedValue = selectedStat
                    ? appliedStatValue(statId, selectedStat.value)
                    : 0;
                const equippedValue = equippedStat
                    ? appliedStatValue(statId, equippedStat.value)
                    : 0;

                const difference = selectedValue - equippedValue;

                return {
                    name: selectedStat?.name || equippedStat?.name || statId,
                    id: statId,
                    value: difference,
                    // Not Math.sign: for the interval stats (attack_speed,
                    // health_regen_rate) a *smaller* number is the better item, so a
                    // negative difference there is an upgrade and must colour green.
                    polarity: statPolarity(statId, difference),
                };
            })
            .filter((stat) => stat.value !== 0); // Only show differences

        return comparisons;
    };

    return (
        <Tooltip
            className={styles.tooltip}
            id={id}
            variant="light"
            globalCloseEvents={{ clickOutsideAnchor: true }}
            afterShow={afterShowHandler}
        >
            <div className={styles.tooltipContent}>
                <div
                    className={styles.tooltipMain}
                    style={{ "--tooltip-border": color } as React.CSSProperties}
                >
                    <h3 className={styles.tooltipTitle}>{name}</h3>
                    <label>Type: </label> <span>{set}</span>
                    {stats.length > 0 && <Stats>{convertStatsToArray(stats)}</Stats>}
                </div>
                <Price cost={cost} />
                {compare && (
                    <div className={styles.tooltipCompare}>
                        <h4>Stat comparison</h4>
                        <Stats>{convertStatsToArray(compare, true)}</Stats>
                    </div>
                )}
            </div>
        </Tooltip>
    );
};

const mapStateToProps = (state: RootState) => {
    const { equipment } = state.game;
    return { equipment };
};

export default connect(mapStateToProps)(ItemTooltip);
