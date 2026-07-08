import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import { readSettings, writeSettings } from "@services/settingsStorage";
import Settings from "@components/Settings";

// Template tests for the Settings screen (#379). Verify it reflects the
// persisted debug flag on mount and that toggling persists the new value.

beforeEach(() => {
    localStorage.clear();
});

afterEach(() => {
    localStorage.clear();
});

describe("Settings template", () => {
    it("reflects the default (debug off) when nothing is persisted", () => {
        renderWithProviders(<Settings />);

        expect(screen.getByRole("button", { name: "Off" })).toBeInTheDocument();
    });

    it("reflects a persisted debug-on setting on mount", () => {
        writeSettings({ debug: true, installBannerDismissed: false });

        renderWithProviders(<Settings />);

        expect(screen.getByRole("button", { name: "On" })).toBeInTheDocument();
    });

    it("persists the new value and updates the control when toggled on", () => {
        renderWithProviders(<Settings />);

        fireEvent.click(screen.getByRole("button", { name: "Off" }));

        // The write happened...
        expect(readSettings().debug).toBe(true);
        // ...and the control reflects it.
        expect(screen.getByRole("button", { name: "On" })).toBeInTheDocument();
    });

    it("toggles back off and persists that too", () => {
        writeSettings({ debug: true, installBannerDismissed: false });

        renderWithProviders(<Settings />);

        fireEvent.click(screen.getByRole("button", { name: "On" }));

        expect(readSettings().debug).toBe(false);
        expect(screen.getByRole("button", { name: "Off" })).toBeInTheDocument();
    });
});
