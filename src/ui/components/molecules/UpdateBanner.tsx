import React from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

import Button from "@components/Button";
import styles from "./UpdateBanner.module.css";

// PWA update prompt. With `registerType: "prompt"` (vite.config.ts) a new build
// installs its service worker and then *waits* — nothing changes under the
// player until they act. `needRefresh` flips once that worker is waiting;
// `updateServiceWorker()` activates it and reloads the page.
//
// Reloading mid-run would drop unsaved progress, so the choice is the player's.
// Dismissal is deliberately not persisted (unlike the install banner): it hides
// this banner for this page only, and the next build prompts again.

const UpdateBanner: React.FC = () => {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW();

    if (!needRefresh) return null;

    return (
        <div
            className={styles.banner}
            role="region"
            aria-label="Update Phasercraft"
            data-testid="update-banner"
        >
            <span className={styles.message}>A new version of Phasercraft is ready</span>
            <span className={styles.actions}>
                <Button
                    text="Reload"
                    size={1}
                    onClick={() => {
                        void updateServiceWorker();
                    }}
                />
                <button
                    type="button"
                    className={styles.close}
                    aria-label="Dismiss update banner"
                    onClick={() => setNeedRefresh(false)}
                >
                    ×
                </button>
            </span>
        </div>
    );
};

export default UpdateBanner;
