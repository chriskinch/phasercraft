import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { craftItem, componentTotal, missingMaterials } from "@store/gameReducer";
import Button from "@components/Button";
import LootIcon from "@components/LootIcon";
import { COMPONENT_DEFS, RECIPES } from "@/types/game";
import type { ComponentType, Recipe, RecipeResult } from "@/types/game";
import { colorForQuality } from "@/lib/armoryClient";
import { appliedStatValue, conversionFor, formatStatValue } from "@/lib/statConversion";
import { pixelEmbossVars } from "@ui/themes";
import type { RootState } from "@store";
import theme from "@ui/themes.module.css";
import styles from "./Blacksmith.module.css";

// The town Blacksmith, built to docs/specs/blacksmith-crafting-ui.md.
//
// The screen is a *forge line*: the player slots a recipe, the recipe fills the
// component slots, and a card beside the line shows the item they will get. The
// data model underneath is unchanged from Step 4a — `craftItem`,
// `componentTotal` and `missingMaterials` are still the single source of truth,
// so the button can never disagree with what the reducer will allow.
//
// Two things the spec defers, and this screen therefore does NOT render:
//  - the SPECIAL item slot (Step 4d): hidden entirely, not shown disabled;
//  - the anvil clang (Step 4e): the success overlay is silent.
// Unlearnt recipes are not shown at all — finding them is the discovery, so
// there are no locked silhouettes.
//
// There is deliberately no <h2> heading in here either: the menu registry in
// `UI.tsx` supplies the panel title ("Blacksmith"), exactly as it does for the
// Merchant, so rendering one locally would print it twice.

// Light rarity tints for a filled slot's emboss, from the spec's table. The
// slot carries the item's rarity so the sprite can sit on it bare.
const RARITY_TINT: Record<string, { rgb: string; a: number }> = {
    common: { rgb: "187,187,187", a: 0.35 },
    fine: { rgb: "0,221,0", a: 0.18 },
    rare: { rgb: "0,119,255", a: 0.16 },
    epic: { rgb: "153,0,255", a: 0.16 },
    legendary: { rgb: "255,153,0", a: 0.2 },
};

// `pixelEmbossVars` derives the lip from the fill at 3x alpha, which matches the
// spec's lip column closely enough to keep one seam rather than two.
const tintVars = (quality: string) => pixelEmbossVars(RARITY_TINT[quality] ?? RARITY_TINT.common);

// The four component slots are fixed; a recipe fills them in catalog order and
// any it does not use stays empty.
const SLOT_COUNT = 4;

const materialEntries = (recipe: Recipe) =>
    Object.entries(recipe.materials) as Array<[ComponentType, number]>;

/** A stat row as the "You will craft" card and the success overlay show it. */
const statRows = (result: RecipeResult) =>
    result.stats.map((stat) => {
        // Recipe statlines are in pool units, like a generated armory item, so they
        // go through the same conversion the tooltip applies before formatting.
        const applied = appliedStatValue(stat.name, stat.value);
        return {
            name: stat.name,
            label: conversionFor(stat.name).label,
            display: formatStatValue(stat.name, applied, { signed: true }),
        };
    });

interface SlotProps {
    quality?: string;
    category?: string;
    icon?: string;
    empty?: React.ReactNode;
}

// One square slot on the forge line. Filled slots take a rarity-tinted emboss
// and draw the sprite bare; empty ones keep the default emboss.
const Slot: React.FC<SlotProps> = ({ quality, category, icon, empty }) => (
    <div
        className={`${theme.pixelEmboss} ${styles.slot}`}
        style={quality ? tintVars(quality) : undefined}
    >
        {category && icon ? (
            <LootIcon
                bare
                category={category}
                color={colorForQuality(quality ?? "common")}
                icon={icon}
            />
        ) : (
            <span className={styles.slotEmpty}>{empty}</span>
        )}
    </div>
);

const Blacksmith: React.FC = () => {
    const dispatch = useDispatch();
    const { coins, components, recipes } = useSelector((state: RootState) => state.game);

    const [view, setView] = useState<"forge" | "picker">("forge");
    // The recipe on the forge line, and the one highlighted inside the picker.
    const [slotted, setSlotted] = useState<string | null>(null);
    const [previewed, setPreviewed] = useState<string | null>(null);
    // Set from the item `craftItem` actually added, so the overlay can only ever
    // appear after a craft the reducer accepted.
    const [crafted, setCrafted] = useState<RecipeResult | null>(null);

    // Only recipes the player has learnt exist on this screen at all.
    const known = useMemo(() => RECIPES.filter((r) => recipes.includes(r.id)), [recipes]);
    const recipe = known.find((r) => r.id === slotted) ?? null;
    const preview = known.find((r) => r.id === previewed) ?? null;

    const missing = recipe ? missingMaterials(components, recipe) : {};
    const shortOnMaterials = Object.keys(missing).length > 0;
    const shortOnCoins = !!recipe && coins < recipe.coins;

    // The button's label and enabled state, per the spec's table. Materials win
    // when both are short.
    const craftState = !recipe
        ? { label: "Choose a recipe", enabled: false }
        : shortOnMaterials
          ? { label: `Missing parts · ${recipe.coins} coins`, enabled: false }
          : shortOnCoins
            ? { label: `Not enough coins · ${recipe.coins} coins`, enabled: false }
            : { label: `Craft · ${recipe.coins} coins`, enabled: true };

    // The shortfall line on the card: the first missing material, else coins.
    const shortfall = (() => {
        if (!recipe) return null;
        const [first] = Object.entries(missing) as Array<[ComponentType, number]>;
        if (first) return `Need ${first[1]} more ${COMPONENT_DEFS[first[0]].name} to craft`;
        if (shortOnCoins) return `Need ${recipe.coins - coins} more coins`;
        return null;
    })();

    const clearForge = () => {
        setSlotted(null);
        setCrafted(null);
    };

    const onCraft = () => {
        // `craftState.enabled` is computed from the same missingMaterials/coins
        // check `craftItem` guards on, so a craft that passes here is one the
        // reducer accepts. Re-checking rather than trusting the disabled button
        // keeps the overlay off a refused craft even if called directly.
        if (!recipe || !craftState.enabled) return;
        dispatch(craftItem(recipe.id));
        setCrafted(recipe.result);
    };

    // --- Recipe picker ------------------------------------------------------
    if (view === "picker") {
        return (
            <div className={styles.blacksmith} data-testid="recipe-picker">
                <section className={styles.pickerList} role="listbox" aria-label="Your recipes">
                    {known.map((r) => {
                        const short = Object.keys(missingMaterials(components, r)).length > 0;
                        return (
                            <button
                                key={r.id}
                                type="button"
                                role="option"
                                aria-selected={r.id === previewed}
                                className={styles.pickerRow}
                                onClick={() => setPreviewed(r.id)}
                            >
                                <Slot
                                    quality={r.result.quality}
                                    category={r.result.category}
                                    icon={r.result.icon}
                                />
                                <span className={styles.pickerText}>
                                    <span className={styles.pickerName}>{r.result.name}</span>
                                    <span className={short ? styles.short : styles.ready}>
                                        {short ? "Missing parts" : "Ready"}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </section>

                <section className={styles.pickerDetail} data-testid="picker-detail">
                    {preview ? (
                        <div
                            className={styles.resultCard}
                            style={
                                {
                                    "--rarity": colorForQuality(preview.result.quality),
                                } as React.CSSProperties
                            }
                        >
                            <h3 className={styles.resultName}>{preview.result.name}</h3>
                            <p className={styles.resultMeta}>
                                {preview.result.quality} · {preview.result.set}
                            </p>
                            <h4 className={styles.sectionLabel}>Needs</h4>
                            <ul className={styles.rows}>
                                {materialEntries(preview).map(([type, need]) => {
                                    const have = componentTotal(components, type);
                                    return (
                                        <li key={type}>
                                            <span>{COMPONENT_DEFS[type].name}</span>
                                            <span
                                                className={
                                                    have >= need ? styles.ready : styles.short
                                                }
                                            >
                                                {have}/{need}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                            <h4 className={styles.sectionLabel}>Stats</h4>
                            <ul className={styles.rows}>
                                {statRows(preview.result).map((s) => (
                                    <li key={s.name}>
                                        <span>{s.label}</span>
                                        <span className={styles.ready}>{s.display}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className={styles.costLine}>{preview.coins} coins</p>
                        </div>
                    ) : (
                        <p className={styles.muted}>Choose a recipe to see what it makes.</p>
                    )}
                </section>

                <section className={styles.pickerActions}>
                    <Button
                        text="Use recipe"
                        disabled={!preview}
                        onClick={() => {
                            if (!preview) return;
                            setSlotted(preview.id);
                            setView("forge");
                        }}
                    />
                    <Button text="Back" onClick={() => setView("forge")} />
                </section>
            </div>
        );
    }

    // --- Forge --------------------------------------------------------------
    return (
        <div className={styles.blacksmith} data-testid="forge">
            <section className={styles.forgeLine}>
                <button
                    type="button"
                    className={styles.recipeCard}
                    data-testid="recipe-card"
                    onClick={() => (recipe ? clearForge() : setView("picker"))}
                >
                    <Slot
                        quality={recipe?.result.quality}
                        category={recipe?.result.category}
                        icon={recipe?.result.icon}
                        empty="+"
                    />
                    <span className={styles.recipeCardText}>
                        <span className={styles.sectionLabel}>Recipe</span>
                        <span className={styles.recipeName}>
                            {recipe ? recipe.result.name : "No recipe"}
                        </span>
                        <span className={styles.muted}>
                            {recipe ? "Tap to remove" : "Tap to choose from your recipes"}
                        </span>
                    </span>
                    <span
                        className={recipe ? styles.removeBadge : styles.chevron}
                        aria-hidden="true"
                    >
                        {recipe ? "✕" : "›"}
                    </span>
                </button>

                <h4 className={styles.sectionLabel}>Components</h4>
                <ul className={styles.componentRow} data-testid="component-slots">
                    {Array.from({ length: SLOT_COUNT }, (_, i) => {
                        const entry = recipe ? materialEntries(recipe)[i] : undefined;
                        if (!entry) {
                            return (
                                <li key={i} className={styles.componentSlot}>
                                    <Slot />
                                    <span className={styles.muted}>Not needed</span>
                                </li>
                            );
                        }
                        const [type, need] = entry;
                        const have = componentTotal(components, type);
                        return (
                            <li key={i} className={styles.componentSlot}>
                                <Slot
                                    quality="common"
                                    category="crafting"
                                    icon={COMPONENT_DEFS[type].icon}
                                />
                                <span className={styles.componentName}>
                                    {COMPONENT_DEFS[type].name}
                                </span>
                                <span className={have >= need ? styles.ready : styles.short}>
                                    {have}/{need}
                                </span>
                            </li>
                        );
                    })}
                </ul>

                <Button text={craftState.label} disabled={!craftState.enabled} onClick={onCraft} />
            </section>

            <section
                className={styles.resultCard}
                data-testid="will-craft"
                style={
                    {
                        "--rarity": recipe ? colorForQuality(recipe.result.quality) : "transparent",
                    } as React.CSSProperties
                }
            >
                {recipe ? (
                    <>
                        <Slot
                            quality={recipe.result.quality}
                            category={recipe.result.category}
                            icon={recipe.result.icon}
                        />
                        <h3 className={styles.resultName}>{recipe.result.name}</h3>
                        <p className={styles.resultMeta}>
                            {recipe.result.quality} · {recipe.result.set}
                        </p>
                        <ul className={styles.rows}>
                            {statRows(recipe.result).map((s) => (
                                <li key={s.name}>
                                    <span>{s.label}</span>
                                    <span className={styles.ready}>{s.display}</span>
                                </li>
                            ))}
                        </ul>
                        {shortfall && (
                            <p className={styles.short} data-testid="shortfall">
                                {shortfall}
                            </p>
                        )}
                    </>
                ) : (
                    <p className={styles.muted}>Choose a recipe to see the item and its stats.</p>
                )}
            </section>

            {crafted && (
                <div className={theme.dialogOverlay} role="status" data-testid="craft-success">
                    <div className={styles.anvilScene} aria-hidden="true">
                        <span className={styles.anvil} />
                        <span className={styles.blade} />
                        <span className={styles.hammer} />
                        {Array.from({ length: 14 }, (_, i) => (
                            <span key={i} className={styles.spark} data-spark={i} />
                        ))}
                    </div>
                    <h3>Crafted!</h3>
                    <p className={styles.resultName}>{crafted.name}</p>
                    <ul className={styles.rows}>
                        {statRows(crafted).map((s) => (
                            <li key={s.name}>
                                <span>{s.label}</span>
                                <span className={styles.ready}>{s.display}</span>
                            </li>
                        ))}
                    </ul>
                    <p>Added to your inventory</p>
                    <div className={styles.overlayActions}>
                        <Button text="Craft another" onClick={clearForge} />
                        <Button text="Done" bg_color="#44bff7" onClick={() => setCrafted(null)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Blacksmith;
