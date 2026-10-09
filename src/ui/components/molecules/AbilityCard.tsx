import React from "react";
import { SPELL_DEFS } from "@/types/game";
import { levelSummary } from "@/lib/levelScaling";
import type { SpellCost, SpellLevel, SpellType } from "@/types/game";
import styles from "./AbilityCard.module.css";

// Card border by spell level: L1 grey, L2 green (fine), L3 blue (rare) — the
// item rarity colours, as on scroll tooltips.
export const LEVEL_COLORS: Record<SpellLevel, string> = {
    1: "#bbbbbb",
    2: "#00dd00",
    3: "#0077ff",
};

const MAX_LEVEL: SpellLevel = 3;

interface AbilityCardProps {
    spell: SpellType | null;
    level: SpellLevel;
    // The player's resource; the card shows the cost in it.
    resourceType: keyof SpellCost;
    // Shown when no spell is given (an empty slot).
    emptyText?: string;
    // Extra line under the level (picker: "Equipped in slot N").
    note?: string;
}

const formatRange = (spell: SpellType): string => {
    const { castRange, targetKind } = SPELL_DEFS[spell];
    if (castRange !== undefined) return `${castRange}`;
    return targetKind === "self" ? "Self" : "—";
};

// The ability card (spec: docs/specs/abilities-ui.md → Ability card): the
// Blacksmith result card's white face with a 5px border in the level colour.
const AbilityCard: React.FC<AbilityCardProps> = ({
    spell,
    level,
    resourceType,
    emptyText = "Tap a slot to see its ability.",
    note,
}) => {
    if (!spell) {
        return (
            <section className={styles.card} data-testid="ability-card">
                <p className={styles.muted}>{emptyText}</p>
            </section>
        );
    }

    const def = SPELL_DEFS[spell];
    const next = level < MAX_LEVEL ? ((level + 1) as SpellLevel) : null;
    // Hidden at max level and for spells with no level scaling.
    const nextSummary = next ? levelSummary(spell, next) : "";

    return (
        <section
            className={styles.card}
            style={{ "--level-color": LEVEL_COLORS[level] } as React.CSSProperties}
            data-testid="ability-card"
            aria-label={`${def.name} details`}
        >
            <h3 className={styles.name}>{def.name}</h3>
            <p className={styles.muted}>
                Level {level} · {def.classes.join(", ")}
            </p>
            {note && <p className={styles.note}>{note}</p>}
            <p className={styles.description}>{def.description}</p>
            <p className={styles.effect}>{def.effect}</p>
            <dl className={styles.rows}>
                <div>
                    <dt>Cost</dt>
                    <dd>
                        {def.cost[resourceType]} {resourceType}
                    </dd>
                </div>
                <div>
                    <dt>Cooldown</dt>
                    <dd>{def.cooldown}s</dd>
                </div>
                <div>
                    <dt>Range</dt>
                    <dd>{formatRange(spell)}</dd>
                </div>
            </dl>
            {next && nextSummary && (
                <p className={styles.next}>
                    Next: L{next} · {nextSummary}
                </p>
            )}
        </section>
    );
};

export default AbilityCard;
