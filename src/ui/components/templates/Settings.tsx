import React, { useState } from "react";
import Button from "@components/Button";
import {
    readSettings,
    writeSettings,
    type Settings as SettingsData,
} from "@services/settingsStorage";

// Settings screen (#379). Reads the persisted settings on mount and lets the
// player tweak them. Every setting applies on next launch: `debug` feeds the
// Phaser physics config at boot (see PhaserGame.tsx), while `startingCoins` and
// `startLocation` are read when a new game begins (CharacterCard / SelectScene).
// The layout is intentionally minimal (one row per setting) but structured so
// more rows drop in easily.
const rowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "1em",
};

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

    const onStartingCoinsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Coerce to a non-negative integer; an empty or invalid entry becomes 0.
        const parsed = Number.parseInt(event.target.value, 10);
        update({ startingCoins: Number.isFinite(parsed) && parsed > 0 ? parsed : 0 });
    };

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
