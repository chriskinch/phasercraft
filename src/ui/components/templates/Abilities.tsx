import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { equipAbility } from "@store/gameReducer";
import Button from "@components/Button";
import AbilitySlot, { LockedSlot } from "@components/AbilitySlot";
import AbilityCard from "@components/AbilityCard";
import SpellIcon from "@components/SpellIcon";
import { ABILITY_SLOTS, SPELL_DEFS } from "@/types/game";
import type { SpellCost } from "@/types/game";
import type { RootState } from "@store";
import styles from "./Abilities.module.css";

const RESOURCES: readonly (keyof SpellCost)[] = ["rage", "mana", "energy"];
// Player classes store it capitalised ("Rage"); SpellCost keys are lowercase.
const toResource = (type: string | undefined): keyof SpellCost =>
    RESOURCES.find((r) => r === type?.toLowerCase()) ?? "mana";

// Abilities tab (spec: docs/specs/abilities-ui.md → Abilities (main)). Active
// slots | ability card | action column; the passive row is shown locked.
const Abilities: React.FC = () => {
    const dispatch = useDispatch();
    const loadout = useSelector((state: RootState) => state.game.abilityLoadout);
    const learned = useSelector((state: RootState) => state.game.learnedSpells);
    const resourceType = useSelector((state: RootState) => state.game.stats.resource_type);
    // Loadout changes are town-only (equipAbility refuses them elsewhere).
    const inTown = useSelector((state: RootState) => state.game.currentArea === "town");

    const [selected, setSelected] = useState(0);
    const spell = loadout[selected] ?? null;

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
            <AbilityCard
                spell={spell}
                level={spell ? (learned[spell] ?? 1) : 1}
                resourceType={toResource(resourceType)}
            />
            <section className={styles.actionsSection}>
                {!inTown && <p className={styles.townNote}>Change in town</p>}
                {/* The picker is #551; until it lands Change has nowhere to go. */}
                <Button text={spell ? "Change" : "Choose"} disabled />
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
