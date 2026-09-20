import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { craftItem, componentTotal, missingMaterials } from "@store/gameReducer";
import Button from "@components/Button";
import Coins from "@components/Coins";
import LootIcon from "@components/LootIcon";
import { COMPONENT_DEFS, RECIPES } from "@/types/game";
import type { ComponentType, Recipe } from "@/types/game";
import { colorForQuality } from "@/lib/armoryClient";
import type { RootState } from "@store";
import theme from "@ui/themes.module.css";
import styles from "./Blacksmith.module.css";

// The town Blacksmith: recipe-based crafting, the known-outcome counterpart to
// the Armory's random stock. Every recipe in the catalog is listed, but the ones
// the player has not learnt show as unnamed silhouettes — the collection is the
// progression, so a locked recipe is visible without being readable.
//
// A crafted item is minted by the `craftItem` reducer, which re-checks materials
// and coins; this panel only mirrors that check so the button can explain itself.
const Blacksmith: React.FC = () => {
    const dispatch = useDispatch();
    const { coins, components, recipes } = useSelector((state: RootState) => state.game);

    const [selectedId, setSelectedId] = useState<string | null>(null);

    const known = (recipe: Recipe) => recipes.includes(recipe.id);
    const selected = RECIPES.find((r) => r.id === selectedId && known(r)) ?? null;

    const missing = selected ? missingMaterials(components, selected) : {};
    const shortOnMaterials = Object.keys(missing).length > 0;
    const shortOnCoins = !!selected && coins < selected.coins;
    const canCraft = !!selected && !shortOnMaterials && !shortOnCoins;

    // Why the Craft button is disabled, so the player isn't left guessing.
    const reason = !selected
        ? "Select a recipe"
        : shortOnMaterials
          ? "Missing materials"
          : shortOnCoins
            ? "Not enough coins"
            : null;

    return (
        <div className={styles.blacksmithContainer}>
            <section className={styles.coinsSection}>
                <Coins data-testid="blacksmith-coins" />
            </section>

            <section
                className={`${theme.pixelEmboss} ${styles.recipesSection}`}
                role="listbox"
                aria-label="Recipes"
                data-testid="recipe-list"
            >
                {RECIPES.map((recipe) => {
                    const isKnown = known(recipe);
                    const isSelected = recipe.id === selectedId && isKnown;
                    return (
                        <button
                            key={recipe.id}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            aria-label={isKnown ? recipe.result.name : "Unknown recipe"}
                            className={`${styles.recipe} ${isKnown ? "" : styles.locked}`}
                            disabled={!isKnown}
                            onClick={() => setSelectedId(recipe.id)}
                        >
                            <LootIcon
                                category={recipe.result.category}
                                color={colorForQuality(recipe.result.quality)}
                                icon={recipe.result.icon}
                                selected={isSelected}
                            />
                            <span className={styles.recipeName}>
                                {isKnown ? recipe.result.name : "???"}
                            </span>
                        </button>
                    );
                })}
            </section>

            <section
                className={`${theme.pixelEmboss} ${styles.detailSection}`}
                data-testid="recipe-detail"
            >
                {selected ? (
                    <>
                        <h3 className={styles.detailTitle}>{selected.result.name}</h3>
                        <ul className={styles.stats}>
                            {selected.result.stats.map((stat) => (
                                <li key={stat.name}>
                                    {stat.name.replace(/_/g, " ")}
                                    <span className={styles.statValue}>+{stat.value}</span>
                                </li>
                            ))}
                        </ul>
                        <ul className={styles.materials} data-testid="recipe-materials">
                            {(
                                Object.entries(selected.materials) as Array<[ComponentType, number]>
                            ).map(([type, needed]) => {
                                const held = componentTotal(components, type);
                                return (
                                    <li
                                        key={type}
                                        className={held < needed ? styles.short : undefined}
                                    >
                                        <LootIcon
                                            category="crafting"
                                            color="#bbbbbb"
                                            icon={COMPONENT_DEFS[type].icon}
                                        />
                                        {COMPONENT_DEFS[type].name}
                                        <span className={styles.haveNeed}>
                                            {held}/{needed}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                        <div
                            className={`${styles.coinCost} ${shortOnCoins ? styles.short : ""}`}
                            data-testid="recipe-cost"
                        >
                            <img src="./UI/icons/coin.gif" alt="Cost:" /> {selected.coins}
                        </div>
                    </>
                ) : (
                    <p className={styles.empty}>Select a recipe to forge.</p>
                )}
            </section>

            <section className={styles.actionsSection} data-testid="blacksmith-actions">
                {reason && <span className={styles.reason}>{reason}</span>}
                <Button
                    text="Craft"
                    disabled={!canCraft}
                    onClick={() => selected && dispatch(craftItem(selected.id))}
                />
            </section>
        </div>
    );
};

export default Blacksmith;
