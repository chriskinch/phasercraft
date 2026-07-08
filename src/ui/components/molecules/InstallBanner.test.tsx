import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fireEvent, screen, act } from "@testing-library/react";

import InstallBanner from "./InstallBanner";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import { readSettings, writeSettings } from "@services/settingsStorage";

// The banner sits at the top of the render tree and decides visibility from
// three signals: `beforeinstallprompt` (Chromium), iOS Safari UA, and the
// persisted `installBannerDismissed` setting. These tests cover each branch.

const IOS_UA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const DESKTOP_UA =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

// jsdom does not implement matchMedia. Provide a controllable stub the tests
// can flip to model an installed / standalone PWA.
function stubMatchMedia(matches: boolean) {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
}

function setUserAgent(ua: string) {
    Object.defineProperty(window.navigator, "userAgent", {
        value: ua,
        configurable: true,
    });
}

function fireBeforeInstallPrompt(prompt = vi.fn().mockResolvedValue(undefined)) {
    // Chromium's event exposes `prompt()` and a `userChoice` promise. jsdom's
    // Event constructor won't take arbitrary properties, so decorate after
    // construction.
    const event = new Event("beforeinstallprompt") as Event & {
        prompt: () => Promise<void>;
        userChoice: Promise<{ outcome: string }>;
        platforms: string[];
    };
    event.prompt = prompt;
    event.userChoice = Promise.resolve({ outcome: "dismissed" });
    event.platforms = ["web"];
    act(() => {
        window.dispatchEvent(event);
    });
    return { event, prompt };
}

beforeEach(() => {
    stubMatchMedia(false);
    setUserAgent(DESKTOP_UA);
    localStorage.clear();
});

afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
});

describe("InstallBanner", () => {
    it("stays hidden on a plain desktop browser with no install event", () => {
        renderWithProviders(<InstallBanner />);
        expect(screen.queryByTestId("install-banner")).toBeNull();
    });

    it("shows the iOS variant on iOS Safari when not standalone", () => {
        setUserAgent(IOS_UA);
        renderWithProviders(<InstallBanner />);
        const banner = screen.getByTestId("install-banner");
        expect(banner).toBeInTheDocument();
        expect(banner.textContent).toMatch(/Add to Home Screen/i);
        // The native "Install" button must NOT appear on iOS — there is no
        // programmatic install path.
        expect(screen.queryByRole("button", { name: /^Install$/i })).toBeNull();
    });

    it("shows the native variant when beforeinstallprompt fires", async () => {
        renderWithProviders(<InstallBanner />);
        const { prompt } = fireBeforeInstallPrompt();

        const installButton = await screen.findByRole("button", { name: /^Install$/i });
        expect(installButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(installButton);
            // let the async prompt/userChoice chain resolve
            await Promise.resolve();
            await Promise.resolve();
        });
        expect(prompt).toHaveBeenCalledTimes(1);
    });

    it("hides itself once dismissed and persists the choice", () => {
        setUserAgent(IOS_UA);
        renderWithProviders(<InstallBanner />);
        expect(screen.getByTestId("install-banner")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /Dismiss install banner/i }));

        expect(screen.queryByTestId("install-banner")).toBeNull();
        expect(readSettings().installBannerDismissed).toBe(true);
    });

    it("stays hidden on iOS Safari when the user already dismissed it", () => {
        setUserAgent(IOS_UA);
        writeSettings({ debug: false, installBannerDismissed: true });
        renderWithProviders(<InstallBanner />);
        expect(screen.queryByTestId("install-banner")).toBeNull();
    });

    it("stays hidden when running as an installed standalone PWA", () => {
        setUserAgent(IOS_UA);
        stubMatchMedia(true); // display-mode: standalone
        renderWithProviders(<InstallBanner />);
        expect(screen.queryByTestId("install-banner")).toBeNull();
    });
});
