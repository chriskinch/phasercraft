import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { craftSpell } from "@store/gameReducer";
import Button from "@components/Button";
import ForgeSlot from "@components/ForgeSlot";
import ScrollIcon from "@components/ScrollIcon";
import Toast from "@components/Toast";
import { COMPONENT_DEFS, SPELL_DEFS, SPELL_RECIPES, SPELL_TYPES, specialById } from "@/types/game";
import type { ComponentType, SpellType } from "@/types/game";
import { componentTotal } from "@/lib/materials";
import { craftStatus } from "@/lib/spellCraft";
import { pixelEmbossVars, STAT_POSITIVE, STAT_NEGATIVE } from "@ui/themes";
import type { RootState } from "@store";
// Same forge-line layout as the Blacksmith (docs/specs/blacksmith-crafting-ui.md).
import styles from "./Blacksmith.module.css";

// Arcanum → Craft (#582): a learnt spell recipe turns components + coins + its
// one mandatory special item into 1 L1 scroll. The recipe card opens a picker of
// learnt recipes only (Trade a found scroll on the Merge tab to learn one).
// `craftStatus` is the reducer's own guard, so the button can't disagree with it.

const STAT_VARS = {
    "--stat-positive": STAT_POSITIVE,
    "--stat-negative": STAT_NEGATIVE,
} as React.CSSProperties;

const SLOT_COUNT = 4;
const EMPTY_SPECIAL_TINT = pixelEmbossVars({ rgb: "153,0,255", a: 0.08 });
// The scroll card reads in the Arcanum's purple.
const SCROLL_RARITY = "#c9a3ff";

const materialEntries = (spell: SpellType) =>
    Object.entries(SPELL_RECIPES[spell].materials) as Array<[ComponentType, number]>;

const ArcanumCraft: React.FC = () => {
    const dispatch = useDispatch();
    const game = useSelector((state: RootState) => state.game);
    const { components, specials, spellRecipes } = game;

    const [view, setView] = useState<"forge" | "picker">("forge");
    const [slotted, setSlotted] = useState<SpellType | null>(null);
    const [previewed, setPreviewed] = useState<SpellType | null>(null);
    const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
    const clearToast = useCallback(() => setToast(null), []);

    // Only learnt recipes exist on this screen, in roster order.
    const known = SPELL_TYPES.filter((s) => spellRecipes.includes(s));
    const spell = slotted && known.includes(slotted) ? slotted : null;
    const preview = previewed && known.includes(previewed) ? previewed : null;
    const status = spell ? craftStatus(game, spell) : null;

    const onCraft = () => {
        if (!spell || !status?.enabled) return;
        dispatch(craftSpell(spell));
        const message = `Crafted 1 ${SPELL_DEFS[spell].name} L1`;
        setToast((t) => ({ id: (t?.id ?? 0) + 1, message }));
    };

    // --- Recipe picker ------------------------------------------------------
    if (view === "picker") {
        return (
            <div className={styles.blacksmith} style={STAT_VARS} data-testid="spell-recipe-picker">
                <section
                    className={styles.pickerList}
                    role="listbox"
                    aria-label="Your spell recipes"
                >
                    {known.length === 0 && (
                        <p className={styles.muted}>
                            No recipes yet. Trade a found scroll on the Merge tab to learn its
                            recipe.
                        </p>
                    )}
                    {known.map((s) => {
                        const ready = craftStatus(game, s).enabled;
                        return (
                            <button
                                key={s}
                                type="button"
                                role="option"
                                aria-selected={s === preview}
                                className={styles.pickerRow}
                                onClick={() => setPreviewed(s)}
                            >
                                <ForgeSlot>
                                    <ScrollIcon spell={s} level={1} />
                                </ForgeSlot>
                                <span className={styles.pickerText}>
                                    <span className={styles.pickerName}>{SPELL_DEFS[s].name}</span>
                                    <span className={ready ? styles.ready : styles.short}>
                                        {ready ? "Ready" : "Missing parts"}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </section>

                <section className={styles.pickerDetail} data-testid="spell-picker-detail">
                    {preview ? (
                        <ScrollCard spell={preview} />
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
                            setSlotted(preview);
                            setView("forge");
                        }}
                    />
                    <Button text="Back" onClick={() => setView("forge")} />
                </section>
            </div>
        );
    }

    // --- Forge --------------------------------------------------------------
    const recipe = spell ? SPELL_RECIPES[spell] : null;
    const special = recipe ? specialById(recipe.special) : undefined;
    const specialHave = recipe ? (specials[recipe.special] ?? 0) : 0;

    return (
        <div className={styles.blacksmith} style={STAT_VARS} data-testid="spell-forge">
            <section className={styles.forgeLine}>
                <button
                    type="button"
                    className={styles.recipeCard}
                    data-testid="spell-recipe-card"
                    onClick={() => (spell ? setSlotted(null) : setView("picker"))}
                >
                    <ForgeSlot empty="+">
                        {spell ? <ScrollIcon spell={spell} level={1} /> : undefined}
                    </ForgeSlot>
                    <span className={styles.recipeCardText}>
                        <span className={styles.sectionLabel}>Recipe</span>
                        <span className={styles.recipeName}>
                            {spell ? SPELL_DEFS[spell].name : "No recipe"}
                        </span>
                        <span className={styles.muted}>
                            {spell ? "Tap to remove" : "Tap to choose from your recipes"}
                        </span>
                    </span>
                    <span
                        className={spell ? styles.removeBadge : styles.chevron}
                        aria-hidden="true"
                    >
                        {spell ? "✕" : "›"}
                    </span>
                </button>

                <div className={styles.parts}>
                    <div>
                        <h4 className={styles.sectionLabel}>Components</h4>
                        <ul className={styles.componentRow} data-testid="spell-component-slots">
                            {Array.from({ length: SLOT_COUNT }, (_, i) => {
                                const entry = spell ? materialEntries(spell)[i] : undefined;
                                if (!entry) {
                                    return (
                                        <li key={i} className={styles.componentSlot}>
                                            <ForgeSlot />
                                            <span className={styles.muted}>Not needed</span>
                                        </li>
                                    );
                                }
                                const [type, need] = entry;
                                const have = componentTotal(components, type);
                                return (
                                    <li key={i} className={styles.componentSlot}>
                                        <ForgeSlot
                                            quality="common"
                                            category="crafting"
                                            icon={COMPONENT_DEFS[type].icon}
                                        />
                                        <span className={styles.componentName}>
                                            {COMPONENT_DEFS[type].name}
                                        </span>
                                        <span
                                            className={have >= need ? styles.ready : styles.short}
                                        >
                                            {have}/{need}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <span className={styles.partsPlus} aria-hidden="true">
                        +
                    </span>

                    {/* Required, fixed by the recipe: not a picker like the
                        Blacksmith's optional special slot. */}
                    <div className={styles.componentSlot} data-testid="spell-special-slot">
                        <h4 className={styles.sectionLabel}>Special</h4>
                        <ForgeSlot
                            quality={special?.quality}
                            category={special ? "misc" : undefined}
                            icon={special?.icon}
                            empty="+"
                            emptyTint={EMPTY_SPECIAL_TINT}
                        />
                        <span className={styles.componentName}>
                            {special ? special.name : "Required"}
                        </span>
                        {special && (
                            <span className={specialHave >= 1 ? styles.ready : styles.short}>
                                {specialHave}/1
                            </span>
                        )}
                    </div>
                </div>

                <Button
                    text={
                        recipe
                            ? `${status?.enabled ? "Craft" : "Can't craft"} · ${recipe.coins} coins`
                            : "Choose a recipe"
                    }
                    disabled={!status?.enabled}
                    onClick={onCraft}
                />
                {toast && <Toast key={toast.id} message={toast.message} onDone={clearToast} />}
            </section>

            <section
                className={styles.resultCard}
                data-testid="spell-will-craft"
                style={{ "--rarity": spell ? SCROLL_RARITY : "transparent" } as React.CSSProperties}
            >
                {spell ? (
                    <>
                        <ForgeSlot>
                            <ScrollIcon spell={spell} level={1} />
                        </ForgeSlot>
                        <ScrollCard spell={spell} bare />
                        {status && !status.enabled && (
                            <p className={styles.short} data-testid="spell-shortfall">
                                {status.hint}
                            </p>
                        )}
                    </>
                ) : (
                    <p className={styles.muted}>Choose a recipe to see the scroll it makes.</p>
                )}
            </section>
        </div>
    );
};

// A crafted scroll's details: name, level + classes, effect and cost.
const ScrollCard: React.FC<{ spell: SpellType; bare?: boolean }> = ({ spell, bare }) => {
    const def = SPELL_DEFS[spell];
    const recipe = SPELL_RECIPES[spell];
    const body = (
        <>
            <h3 className={styles.resultName}>{def.name} Scroll</h3>
            <p className={styles.resultMeta}>L1 · {def.classes.join(", ")}</p>
            <p>{def.effect}</p>
            {!bare && (
                <>
                    <h4 className={styles.sectionLabel}>Needs</h4>
                    <ul className={styles.rows}>
                        {materialEntries(spell).map(([type, need]) => (
                            <li key={type}>
                                <span>{COMPONENT_DEFS[type].name}</span>
                                <span>{need}</span>
                            </li>
                        ))}
                        <li>
                            <span className={styles.bonus}>
                                {specialById(recipe.special)?.name}
                            </span>
                            <span className={styles.bonus}>1</span>
                        </li>
                    </ul>
                </>
            )}
            <p className={styles.costLine}>{recipe.coins} coins</p>
        </>
    );
    return bare ? (
        body
    ) : (
        <div
            className={styles.resultCard}
            style={{ "--rarity": SCROLL_RARITY } as React.CSSProperties}
        >
            {body}
        </div>
    );
};

export default ArcanumCraft;
