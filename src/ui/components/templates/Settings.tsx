import React, { useState } from "react";
import Button from "@components/Button";
import { DEFAULT_AREA_TUNING } from "@config/area";
import { spawnRadius } from "@helpers/spawnGeometry";
import { STARTER_ITEMS } from "@store/gameReducer";
import {
    readSettings,
    writeSettings,
    type Settings as SettingsData,
} from "@services/settingsStorage";

// Settings screen (#379). Reads the persisted settings on mount and lets the
// player tweak them. The spawn tuning is read each time an area is entered (see
// `resolveAreaTuning`) and the SFX volume on every sound played (services/sfx).
// The debug settings sit behind God mode, which only reveals them: `debug`
// feeds the Phaser physics config at boot (see PhaserGame.tsx), while
// `starterItems` and `startLocation` are read when a new game begins
// (CharacterCard / SelectScene). The layout is intentionally minimal (one row
// per setting) but structured so more rows drop in easily.
const rowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "1em",
};

const sectionStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1em",
};

// Indented under God mode: only shown while it is on.
const subsectionStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1em",
    marginLeft: "2em",
};

const hintStyle: React.CSSProperties = { opacity: 0.7 };

// Every number input shares one short width, sized for the values they hold.
const numberInputStyle: React.CSSProperties = { width: "6em", flex: "none" };

// Coerce a number input to a non-negative integer; empty or invalid becomes 0.
const toNonNegativeInt = (value: string): number => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

type SpawnNumberField =
    | "spawnRadiusOverride"
    | "liveCapOverride"
    | "killsToBossOverride"
    | "despawnDelaySeconds";

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
        field: "killsToBossOverride",
        label: "Kills to boss",
        defaultValue: () => DEFAULT_AREA_TUNING.killsToBoss,
        hint: `Default: ${DEFAULT_AREA_TUNING.killsToBoss}`,
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
        <div role="group" aria-label={`${label} setting`} style={rowStyle}>
            <label htmlFor={field}>{label}</label>
            <input
                id={field}
                type="number"
                min={0}
                style={numberInputStyle}
                value={draft ?? effective}
                onChange={onInput}
                onBlur={() => setDraft(null)}
            />
            <span style={hintStyle}>{hint}</span>
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

    const toggle = (field: "godMode" | "debug" | "spawnDebugOverlay" | "starterItems") => () =>
        update({ [field]: !settings[field] });

    const toggleStartLocation = () =>
        update({ startLocation: settings.startLocation === "combat" ? "default" : "combat" });

    const onSfxVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        update({ sfxVolume: Math.min(100, toNonNegativeInt(event.target.value)) });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
            <div style={rowStyle}>
                <label htmlFor="sfx-volume">Sound effects</label>
                <input
                    id="sfx-volume"
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={settings.sfxVolume}
                    onChange={onSfxVolumeChange}
                />
                <span style={hintStyle}>
                    {settings.sfxVolume === 0 ? "Muted" : `${settings.sfxVolume}%`}
                </span>
            </div>
            <div role="group" aria-label="Enemy spawning" style={sectionStyle}>
                <span style={hintStyle}>Spawn tuning applies the next time you enter an area.</span>
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
            <div style={rowStyle}>
                <span>God mode</span>
                <Button
                    text={settings.godMode ? "On" : "Off"}
                    on={settings.godMode}
                    onClick={toggle("godMode")}
                />
            </div>
            {settings.godMode && (
                <div role="group" aria-label="Debug settings" style={subsectionStyle}>
                    <div style={rowStyle}>
                        <span>Debug mode</span>
                        <Button
                            text={settings.debug ? "On" : "Off"}
                            on={settings.debug}
                            onClick={toggle("debug")}
                        />
                    </div>
                    {settings.debug && (
                        <div style={{ ...rowStyle, marginLeft: "2em" }}>
                            <span>Spawn debug overlay</span>
                            <Button
                                text={settings.spawnDebugOverlay ? "On" : "Off"}
                                on={settings.spawnDebugOverlay}
                                onClick={toggle("spawnDebugOverlay")}
                            />
                        </div>
                    )}
                    <div style={rowStyle}>
                        <span>Starter items</span>
                        <Button
                            text={settings.starterItems ? "On" : "Off"}
                            on={settings.starterItems}
                            onClick={toggle("starterItems")}
                        />
                        <span style={hintStyle}>
                            {STARTER_ITEMS.coins} coins, {STARTER_ITEMS.componentsEach} of each
                            part, {STARTER_ITEMS.specialsEach} of each special
                        </span>
                    </div>
                    <div style={rowStyle}>
                        <span>Start location</span>
                        <Button
                            text={settings.startLocation === "combat" ? "Combat" : "Default"}
                            on={settings.startLocation === "combat"}
                            onClick={toggleStartLocation}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
