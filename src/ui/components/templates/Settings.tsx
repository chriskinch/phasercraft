import React, { useState } from "react";
import Button from "@components/Button";
import { DEFAULT_AREA_TUNING } from "@config/area";
import { spawnRadius } from "@helpers/spawnGeometry";
import { STARTER_ITEMS } from "@store/gameReducer";
import {
    readSettings,
    withGodModeGate,
    writeSettings,
    type Settings as SettingsData,
} from "@services/settingsStorage";

import styles from "./Settings.module.css";

// Settings screen (#379). Reads the persisted settings on mount and lets the
// player tweak them. Only the SFX volume (read on every sound, services/sfx) is
// always shown; everything else sits behind God mode, which reveals it and
// resets it when switched off (see `withGodModeGate`). The spawn tuning is read
// each time an area is entered (`resolveAreaTuning`); `debug` feeds the Phaser
// physics config at boot (PhaserGame.tsx); `starterItems` and `startLocation`
// are read when a new game begins (CharacterCard / SelectScene). Rows share one
// grid (label | control | hint | action) and the two sections sit side by side
// when there is room.

// Coerce a number input to a non-negative integer; empty or invalid becomes 0.
const toNonNegativeInt = (value: string): number => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

type SpawnNumberField = "spawnRadiusOverride" | "liveCapOverride" | "despawnDelaySeconds";

// The radius has no fixed default: it is derived from the viewport so enemies
// spawn just off screen. Show what that works out to for this window (the game
// camera is unzoomed), so the input starts from the value actually in use.
const autoSpawnRadius = (): number =>
    Math.round(
        spawnRadius({
            viewWidth: window.innerWidth,
            viewHeight: window.innerHeight,
            zoom: 1,
            margin: DEFAULT_AREA_TUNING.radiusMargin,
            override: 0,
        })
    );

// One numeric spawn override per row. Each is stored as 0 when it follows its
// codified default, so a change to the default in config/area.ts carries
// through; the input shows the default itself rather than the 0.
const SPAWN_FIELDS: {
    field: SpawnNumberField;
    label: string;
    defaultValue: () => number;
    hint: string;
}[] = [
    {
        field: "spawnRadiusOverride",
        label: "Spawn radius (px)",
        defaultValue: autoSpawnRadius,
        hint: "Default: just off screen",
    },
    {
        field: "liveCapOverride",
        label: "Live cap",
        defaultValue: () => DEFAULT_AREA_TUNING.liveCap,
        hint: `Default: ${DEFAULT_AREA_TUNING.liveCap}`,
    },
    {
        field: "despawnDelaySeconds",
        label: "Despawn delay (s)",
        defaultValue: () => DEFAULT_AREA_TUNING.despawnDelayMs / 1000,
        hint: `Default: ${DEFAULT_AREA_TUNING.despawnDelayMs / 1000}`,
    },
];

interface SpawnOverrideRowProps {
    field: SpawnNumberField;
    label: string;
    hint: string;
    // The stored override; 0 means "use the default".
    value: number;
    defaultValue: number;
    onChange: (value: number) => void;
}

/**
 * One override: shows the value in effect (the override, or the default when
 * there is none), and a Reset that returns it to the codified default.
 *
 * While the field is being edited it shows exactly what was typed, so clearing
 * it to type a new number does not snap back to the default mid-edit. An empty
 * or non-positive entry, or the default itself, is stored as 0 (follow the
 * default).
 */
const SpawnOverrideRow: React.FC<SpawnOverrideRowProps> = ({
    field,
    label,
    hint,
    value,
    defaultValue,
    onChange,
}) => {
    const [draft, setDraft] = useState<string | null>(null);
    const effective = value > 0 ? value : defaultValue;

    const onInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDraft(event.target.value);
        const parsed = toNonNegativeInt(event.target.value);
        onChange(parsed === defaultValue ? 0 : parsed);
    };

    const reset = () => {
        setDraft(null);
        onChange(0);
    };

    return (
        <div role="group" aria-label={`${label} setting`} className={styles.row}>
            <label htmlFor={field} className={styles.label}>
                {label}
            </label>
            <input
                id={field}
                type="number"
                min={0}
                className={styles.input}
                value={draft ?? effective}
                onChange={onInput}
                onBlur={() => setDraft(null)}
            />
            <span className={styles.hint}>{hint}</span>
            <Button text="Reset" size={1} disabled={value === 0} onClick={reset} />
        </div>
    );
};

const Settings: React.FC = () => {
    const [settings, setSettings] = useState<SettingsData>(() => readSettings());

    // Persist and reflect a single-field change in one place.
    const update = (patch: Partial<SettingsData>) => {
        const next: SettingsData = { ...settings, ...patch };
        writeSettings(next);
        setSettings(next);
    };

    const toggle = (field: "debug" | "spawnDebugOverlay" | "starterItems") => () =>
        update({ [field]: !settings[field] });

    // Switching God mode off also switches off everything behind it, so no hidden
    // debug setting keeps taking effect. Anything a game already received (e.g.
    // starter items, now in a save) is untouched.
    const toggleGodMode = () =>
        update(withGodModeGate({ ...settings, godMode: !settings.godMode }));

    const toggleStartLocation = () =>
        update({ startLocation: settings.startLocation === "combat" ? "default" : "combat" });

    const onSfxVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        update({ sfxVolume: Math.min(100, toNonNegativeInt(event.target.value)) });

    // A labelled On/Off toggle row, with an optional hint beside it.
    const toggleRow = (
        label: string,
        on: boolean,
        onClick: () => void,
        hint?: string,
        className = styles.row
    ) => (
        <div className={className}>
            <span className={styles.label}>{label}</span>
            <Button text={on ? "On" : "Off"} on={on} onClick={onClick} />
            {hint && <span className={styles.hint}>{hint}</span>}
        </div>
    );

    return (
        <div className={styles.settings}>
            <div className={styles.row}>
                <label htmlFor="sfx-volume" className={styles.label}>
                    Sound effects
                </label>
                <div className={styles.wide}>
                    <input
                        id="sfx-volume"
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={settings.sfxVolume}
                        onChange={onSfxVolumeChange}
                    />
                    <span className={styles.hint}>
                        {settings.sfxVolume === 0 ? "Muted" : `${settings.sfxVolume}%`}
                    </span>
                </div>
            </div>
            {toggleRow(
                "God mode",
                settings.godMode,
                toggleGodMode,
                "Shows the testing settings; off resets them."
            )}
            {settings.godMode && (
                <div className={styles.sections}>
                    <div role="group" aria-label="Enemy spawning" className={styles.section}>
                        <h3 className={styles.heading}>Enemy spawning</h3>
                        <span className={styles.hint}>
                            Applies the next time you enter an area.
                        </span>
                        {SPAWN_FIELDS.map(({ field, label, hint, defaultValue }) => (
                            <SpawnOverrideRow
                                key={field}
                                field={field}
                                label={label}
                                hint={hint}
                                value={settings[field]}
                                defaultValue={defaultValue()}
                                onChange={(value) => update({ [field]: value })}
                            />
                        ))}
                    </div>
                    <div role="group" aria-label="Debug settings" className={styles.section}>
                        <h3 className={styles.heading}>Debug</h3>
                        {toggleRow(
                            "Debug mode",
                            settings.debug,
                            toggle("debug"),
                            "Physics debug; applies on next launch."
                        )}
                        {settings.debug &&
                            toggleRow(
                                "Spawn overlay",
                                settings.spawnDebugOverlay,
                                toggle("spawnDebugOverlay"),
                                undefined,
                                `${styles.row} ${styles.nested}`
                            )}
                        {toggleRow(
                            "Starter items",
                            settings.starterItems,
                            toggle("starterItems"),
                            `${STARTER_ITEMS.coins} coins, ${STARTER_ITEMS.componentsEach} of each part, ${STARTER_ITEMS.specialsEach} of each special`
                        )}
                        <div className={styles.row}>
                            <span className={styles.label}>Start location</span>
                            <Button
                                text={settings.startLocation === "combat" ? "Combat" : "Default"}
                                on={settings.startLocation === "combat"}
                                onClick={toggleStartLocation}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
