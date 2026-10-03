import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { equipAbility } from "@store/gameReducer";
import Button from "@components/Button";
import AbilitySlot, { LockedSlot } from "@components/AbilitySlot";
import AbilityCard from "@components/AbilityCard";
import SpellIcon from "@components/SpellIcon";
import { ABILITY_SLOTS, SPELL_DEFS } from "@/types/game";
import type { SpellCost, SpellType } from "@/types/game";
import { isOnClass } from "@/lib/classKits";
import type { RootState } from "@store";
import styles from "./Abilities.module.css";

const RESOURCES: readonly (keyof SpellCost)[] = ["rage", "mana", "energy"];
// Player classes store it capitalised ("Rage"); SpellCost keys are lowercase.
const toResource = (type: string | undefined): keyof SpellCost =>
    RESOURCES.find((r) => r === type?.toLowerCase()) ?? "mana";

// Picker order (spec open question 4, issue default): equipped first in slot
// order, then the rest by name.
const pickerOrder = (spells: SpellType[], loadout: (SpellType | null)[]): SpellType[] => {
    const rank = (s: SpellType) => {
        const i = loadout.indexOf(s);
        return i === -1 ? ABILITY_SLOTS : i;
    };
    return [...spells].sort(
        (a, b) => rank(a) - rank(b) || SPELL_DEFS[a].name.localeCompare(SPELL_DEFS[b].name)
    );
};

// Abilities tab (spec: docs/specs/abilities-ui.md → Abilities (main), Ability
// picker). Active slots | ability card | action column; the passive row is
// shown locked. Change/Choose swaps the slots area for the picker view (like
// the Blacksmith recipe picker), not a separate menu.
const Abilities: React.FC = () => {
    const dispatch = useDispatch();
    const loadout = useSelector((state: RootState) => state.game.abilityLoadout);
    const learned = useSelector((state: RootState) => state.game.learnedSpells);
    const character = useSelector((state: RootState) => state.game.character);
    const resourceType = useSelector((state: RootState) => state.game.stats.resource_type);
    // Loadout changes are town-only (equipAbility refuses them elsewhere).
    const inTown = useSelector((state: RootState) => state.game.currentArea === "town");

    const [selected, setSelected] = useState(0);
    const spell = loadout[selected] ?? null;
    const [view, setView] = useState<"slots" | "picker">("slots");
    // The spell highlighted inside the picker.
    const [previewed, setPreviewed] = useState<SpellType | null>(null);
    // Spells tapped in the picker; an unslotted, untapped spell shows "New".
    // Component state, so not saved (see the PR's open questions).
    const [seen, setSeen] = useState<ReadonlySet<SpellType>>(() => new Set());

    // Learned, on-class spells (an off-class spell can't be learned anyway).
    const choices = useMemo(
        () =>
            pickerOrder(
                (Object.keys(learned) as SpellType[]).filter(
                    (s) => learned[s] && isOnClass(character, s)
                ),
                loadout
            ),
        [learned, loadout, character]
    );

    const levelOf = (s: SpellType | null) => (s ? (learned[s] ?? 1) : 1);
    const resource = toResource(resourceType);

    const openPicker = () => {
        setPreviewed(spell && choices.includes(spell) ? spell : null);
        setView("picker");
    };

    if (view === "picker") {
        const from = previewed ? loadout.indexOf(previewed) : -1;
        const swap = from !== -1 && from !== selected;
        const onEquip = () => {
            if (!previewed) return;
            dispatch(equipAbility(selected, previewed));
            setView("slots");
        };
        return (
            <div className={styles.abilitiesContainer} data-testid="ability-picker">
                <section className={styles.slotsSection}>
                    <h3 className={styles.sectionLabel} id="abilities-picker">
                        Choose for slot {selected + 1}
                    </h3>
                    {choices.length === 0 ? (
                        <p className={styles.emptyNote}>Read scrolls to learn new abilities.</p>
                    ) : (
                        <div
                            className={styles.pickerGrid}
                            role="group"
                            aria-labelledby="abilities-picker"
                        >
                            {choices.map((s) => {
                                const at = loadout.indexOf(s);
                                const isNew = at === -1 && !seen.has(s);
                                const label = [
                                    SPELL_DEFS[s].name,
                                    at !== -1 ? `in slot ${at + 1}` : null,
                                    isNew ? "new" : null,
                                ]
                                    .filter(Boolean)
                                    .join(", ");
                                return (
                                    <AbilitySlot
                                        key={s}
                                        label={label}
                                        selected={s === previewed}
                                        isNew={isNew}
                                        badge={at !== -1 ? `${at + 1}` : undefined}
                                        onClick={() => {
                                            setPreviewed(s);
                                            setSeen((prev) => new Set(prev).add(s));
                                        }}
                                    >
                                        <SpellIcon icon={SPELL_DEFS[s].icon_name} />
                                    </AbilitySlot>
                                );
                            })}
                        </div>
                    )}
                </section>
                <AbilityCard
                    spell={previewed}
                    level={levelOf(previewed)}
                    resourceType={resource}
                    emptyText="Tap an ability to see it."
                    note={from !== -1 ? `Equipped in slot ${from + 1}` : undefined}
                />
                <section className={styles.actionsSection}>
                    {!inTown && <p className={styles.townNote}>Change in town</p>}
                    <Button
                        text={swap ? "Swap" : "Equip"}
                        disabled={!inTown || !previewed || from === selected}
                        onClick={onEquip}
                    />
                    <Button text="Back" onClick={() => setView("slots")} />
                </section>
            </div>
        );
    }

    return (
        <div className={styles.abilitiesContainer}>
            <section className={styles.slotsSection}>
                <h3 className={styles.sectionLabel} id="abilities-active">
                    Active
                </h3>
                <div className={styles.slotRow} role="group" aria-labelledby="abilities-active">
                    {Array.from({ length: ABILITY_SLOTS }, (_, i) => {
                        const slotted = loadout[i] ?? null;
                        const name = slotted ? SPELL_DEFS[slotted].name : "empty";
                        return (
                            <AbilitySlot
                                key={i}
                                label={`Slot ${i + 1}: ${name}`}
                                selected={i === selected}
                                onClick={() => setSelected(i)}
                            >
                                {slotted ? (
                                    <SpellIcon icon={SPELL_DEFS[slotted].icon_name} />
                                ) : null}
                            </AbilitySlot>
                        );
                    })}
                </div>
                <h3 className={styles.sectionLabel} id="abilities-passive">
                    Passive · coming soon
                </h3>
                <div className={styles.slotRow} role="group" aria-labelledby="abilities-passive">
                    {Array.from({ length: ABILITY_SLOTS }, (_, i) => (
                        <LockedSlot key={i} />
                    ))}
                </div>
            </section>
            <AbilityCard spell={spell} level={levelOf(spell)} resourceType={resource} />
            <section className={styles.actionsSection}>
                {!inTown && <p className={styles.townNote}>Change in town</p>}
                <Button
                    text={spell ? "Change" : "Choose"}
                    disabled={!inTown}
                    onClick={openPicker}
                />
                <Button
                    text="Remove"
                    disabled={!inTown || !spell}
                    onClick={() => dispatch(equipAbility(selected, null))}
                />
            </section>
        </div>
    );
};

export default Abilities;
