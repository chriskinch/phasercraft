import { useCallback, useEffect, useState } from "react";

import { readSettings, writeSettings } from "@services/settingsStorage";

// PWA install-prompt discovery. Two paths, one hook:
//   - "native": Chromium fires `beforeinstallprompt` before showing its own
//     mini-infobar; we capture the event, suppress the default UI, and expose
//     `install()` so our own banner can call `prompt()` at the right moment.
//   - "ios":    iOS Safari does not implement `beforeinstallprompt` at all —
//     the ONLY install path is manual (Share sheet → Add to Home Screen). We
//     surface an in-app hint pointing users at that flow.
// The banner is hidden entirely once the user dismisses it (persisted via the
// typed settings service) or once the app is already running standalone.

// The event type ships in `lib.dom` on modern TS versions but is not always in
// scope here; declare the minimal shape we rely on.
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: readonly string[];
    prompt(): Promise<void>;
    readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type InstallPromptMode = "native" | "ios";

export interface UseInstallPrompt {
    shown: boolean;
    mode: InstallPromptMode | null;
    install: () => Promise<void>;
    dismiss: () => void;
}

function isIosSafari(): boolean {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent;
    // Exclude non-Safari iOS browsers (CriOS = Chrome, FxiOS = Firefox,
    // EdgiOS = Edge) and desktop Chromium/Firefox/Edge — those either don't
    // honor Add-to-Home-Screen for arbitrary sites, or aren't iOS at all.
    if (/CriOS|FxiOS|EdgiOS|OPiOS|Chrome\/|Firefox\/|Edg\//.test(ua)) return false;
    // Match iPhone/iPad/iPod (and the "iPad on macOS" desktop-mode case where
    // Safari reports Mac + touch support).
    return (
        /iPad|iPhone|iPod/.test(ua) ||
        (ua.includes("Mac") && typeof document !== "undefined" && "ontouchend" in document)
    );
}

function isStandalone(): boolean {
    if (typeof window === "undefined") return false;
    if (window.matchMedia?.("(display-mode: standalone)").matches) return true;
    // iOS exposes `navigator.standalone` (not in the TS lib type).
    const nav = navigator as Navigator & { standalone?: boolean };
    return nav.standalone === true;
}

export function useInstallPrompt(): UseInstallPrompt {
    const [nativeEvent, setNativeEvent] = useState<BeforeInstallPromptEvent | null>(null);
    const [dismissed, setDismissed] = useState<boolean>(
        () => readSettings().installBannerDismissed
    );
    const [installed, setInstalled] = useState<boolean>(() => isStandalone());
    const [iosEligible] = useState<boolean>(() => isIosSafari());

    useEffect(() => {
        const onBeforeInstall = (event: Event) => {
            event.preventDefault();
            setNativeEvent(event as BeforeInstallPromptEvent);
        };
        const onInstalled = () => {
            setNativeEvent(null);
            setInstalled(true);
        };
        window.addEventListener("beforeinstallprompt", onBeforeInstall);
        window.addEventListener("appinstalled", onInstalled);
        return () => {
            window.removeEventListener("beforeinstallprompt", onBeforeInstall);
            window.removeEventListener("appinstalled", onInstalled);
        };
    }, []);

    const install = useCallback(async () => {
        if (!nativeEvent) return;
        await nativeEvent.prompt();
        // Whatever the user chose, we've done our job — clear the saved event
        // (it can only be used once) and hide the banner. Accepted installs
        // will also fire `appinstalled` below.
        try {
            await nativeEvent.userChoice;
        } catch {
            // ignore — Chromium resolves this, but we don't want a stray
            // rejection to bubble out of the banner click handler.
        }
        setNativeEvent(null);
    }, [nativeEvent]);

    const dismiss = useCallback(() => {
        const current = readSettings();
        writeSettings({ ...current, installBannerDismissed: true });
        setDismissed(true);
    }, []);

    const mode: InstallPromptMode | null = nativeEvent
        ? "native"
        : iosEligible && !installed
          ? "ios"
          : null;

    const shown = mode !== null && !dismissed && !installed;

    return { shown, mode, install, dismiss };
}
