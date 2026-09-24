import React, { useState } from "react";
import Button from "@components/Button";
import { DEFAULT_AREA_TUNING } from "@config/area";
import {
    readSettings,
    writeSettings,
    type Settings as SettingsData,
} from "@services/settingsStorage";

// Settings screen (#379). Reads the persisted settings on mount and lets the
// player tweak them. Every setting applies on next launch: `debug` feeds the
// Phaser physics config at boot (see PhaserGame.tsx), while `startingCoins` and
// `startLocation` are read when a new game begins (CharacterCard / SelectScene).
// The spawn tuning under Debug mode is read each time an area is entered (see
// `resolveAreaTuning`). The layout is intentionally minimal (one row per
// setting) but structured so more rows drop in easily.
const rowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "1em",
};

// Indented under Debug mode: these only exist, and only apply, while it is on.
const subsectionStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1em",
    marginLeft: "2em",
};

const hintStyle: React.CSSProperties = { opacity: 0.7 };

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

// One numeric spawn override per row. `hint` says what 0 falls back to.
const SPAWN_FIELDS: { field: SpawnNumberField; label: string; hint: string }[] = [
    { field: "spawnRadiusOverride", label: "Spawn radius (px)", hint: "0 = just off screen" },
    {
        field: "liveCapOverride",
        label: "Live cap",
        hint: `0 = default (${DEFAULT_AREA_TUNING.liveCap})`,
    },
    {
        field: "killsToBossOverride",
        label: "Kills to boss",
        hint: `0 = default (${DEFAULT_AREA_TUNING.killsToBoss})`,
    },
    {
        field: "despawnDelaySeconds",
        label: "Despawn delay (s)",
        hint: `0 = default (${DEFAULT_AREA_TUNING.despawnDelayMs / 1000})`,
    },
];

const Settings: React.FC = () => {
    const [settings, setSettings] = useState<SettingsData>(() => readSettings());

    // Persist and reflect a single-field change in one place.
    const update = (patch: Partial<SettingsData>) => {
        const next: SettingsData = { ...settings, ...patch };
        writeSettings(next);
        setSettings(next);
    };

    const toggleDebug = () => update({ debug: !settings.debug });

    const toggleStartLocation = () =>
        update({ startLocation: settings.startLocation === "combat" ? "default" : "combat" });

    const onStartingCoinsChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        update({ startingCoins: toNonNegativeInt(event.target.value) });

    const toggleSpawnOverlay = () => update({ spawnDebugOverlay: !settings.spawnDebugOverlay });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
            <div style={rowStyle}>
                <span>Debug mode</span>
                <Button
                    text={settings.debug ? "On" : "Off"}
                    on={settings.debug}
                    onClick={toggleDebug}
                />
            </div>
            {settings.debug && (
                <div role="group" aria-label="Spawn debugging" style={subsectionStyle}>
                    <span style={hintStyle}>
                        Spawn tuning applies the next time you enter an area.
                    </span>
                    <div style={rowStyle}>
                        <span>Spawn debug overlay</span>
                        <Button
                            text={settings.spawnDebugOverlay ? "On" : "Off"}
                            on={settings.spawnDebugOverlay}
                            onClick={toggleSpawnOverlay}
                        />
                    </div>
                    {SPAWN_FIELDS.map(({ field, label, hint }) => (
                        <div style={rowStyle} key={field}>
                            <label htmlFor={field}>{label}</label>
                            <input
                                id={field}
                                type="number"
                                min={0}
                                value={settings[field]}
                                onChange={(event) =>
                                    update({ [field]: toNonNegativeInt(event.target.value) })
                                }
                            />
                            <span style={hintStyle}>{hint}</span>
                        </div>
                    ))}
                </div>
            )}
            <div style={rowStyle}>
                <label htmlFor="starting-coins">Starting coins</label>
                <input
                    id="starting-coins"
                    type="number"
                    min={0}
                    value={settings.startingCoins}
                    onChange={onStartingCoinsChange}
                />
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
    );
};

export default Settings;
