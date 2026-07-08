import React from "react";

import Button from "@components/Button";
import { useInstallPrompt } from "@ui/hooks/useInstallPrompt";
import styles from "./InstallBanner.module.css";

// Discovery UI for the PWA install flow. Chromium can show its own "Install"
// UI via `beforeinstallprompt`; iOS Safari never prompts, so we point users at
// the Share sheet manually. See `useInstallPrompt` for the detection logic.

// iOS Share glyph, drawn to match Apple's icon closely enough that users
// recognise it. Inline so the banner has no external asset dependency.
const ShareIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
    <svg
        className={styles.shareIcon}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
    >
        <path d="M12 3.5l-4 4 1.4 1.4L11 7.3V15h2V7.3l1.6 1.6L16 7.5l-4-4z" fill="currentColor" />
        <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10h-2v9H7v-9H5z" fill="currentColor" />
    </svg>
);

const InstallBanner: React.FC = () => {
    const { shown, mode, install, dismiss } = useInstallPrompt();

    if (!shown || !mode) return null;

    return (
        <div
            className={styles.banner}
            role="region"
            aria-label="Install Phasercraft"
            data-testid="install-banner"
        >
            {mode === "ios" ? (
                <span className={styles.message}>
                    Install Phasercraft: tap <ShareIcon /> then <b>Add to Home Screen</b>
                </span>
            ) : (
                <span className={styles.message}>Install Phasercraft for full-screen play</span>
            )}
            <span className={styles.actions}>
                {mode === "native" && (
                    <Button
                        text="Install"
                        size={1}
                        onClick={() => {
                            void install();
                        }}
                    />
                )}
                <button
                    type="button"
                    className={styles.close}
                    aria-label="Dismiss install banner"
                    onClick={dismiss}
                >
                    ×
                </button>
            </span>
        </div>
    );
};

export default InstallBanner;
