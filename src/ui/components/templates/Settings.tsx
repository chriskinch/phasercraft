import React, { useState } from "react";
import Button from "@components/Button";
import {
    readSettings,
    writeSettings,
    type Settings as SettingsData,
} from "@services/settingsStorage";

// Settings screen (#379). Reads the persisted settings on mount and lets the
// player toggle debug mode. The debug flag applies on next launch — it feeds the
// Phaser physics config at boot (see PhaserGame.tsx). The layout is intentionally
// minimal (one toggle row) but structured so more rows drop in easily.
const Settings: React.FC = () => {
    const [settings, setSettings] = useState<SettingsData>(() => readSettings());

    const toggleDebug = () => {
        const next: SettingsData = { ...settings, debug: !settings.debug };
        writeSettings(next);
        setSettings(next);
    };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
                <span>Debug mode</span>
                <Button
                    text={settings.debug ? "On" : "Off"}
                    on={settings.debug}
                    onClick={toggleDebug}
                />
            </div>
        </div>
    );
};

export default Settings;
