import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import { readSettings, writeSettings, DEFAULT_SETTINGS } from "@services/settingsStorage";
import Settings from "@components/Settings";

// Template tests for the Settings screen (#379). Verify it reflects the
// persisted settings on mount and that changing a control persists the new
// value: the debug toggle, the starting-coins input, and the start-location
// toggle.

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
        writeSettings({ ...DEFAULT_SETTINGS, debug: true });

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
        writeSettings({ ...DEFAULT_SETTINGS, debug: true });

        renderWithProviders(<Settings />);

        fireEvent.click(screen.getByRole("button", { name: "On" }));

        expect(readSettings().debug).toBe(false);
        expect(screen.getByRole("button", { name: "Off" })).toBeInTheDocument();
    });

    it("reflects the persisted starting-coins value on mount", () => {
        writeSettings({ ...DEFAULT_SETTINGS, startingCoins: 250 });

        renderWithProviders(<Settings />);

        expect(screen.getByLabelText("Starting coins")).toHaveValue(250);
    });

    it("persists an edited starting-coins value", () => {
        renderWithProviders(<Settings />);

        fireEvent.change(screen.getByLabelText("Starting coins"), { target: { value: "42" } });

        expect(readSettings().startingCoins).toBe(42);
        expect(screen.getByLabelText("Starting coins")).toHaveValue(42);
    });

    it("coerces an empty or invalid starting-coins entry to zero", () => {
        renderWithProviders(<Settings />);

        fireEvent.change(screen.getByLabelText("Starting coins"), { target: { value: "" } });

        expect(readSettings().startingCoins).toBe(0);
    });

    it("defaults the start-location control to Default and toggles to Combat", () => {
        renderWithProviders(<Settings />);

        expect(screen.getByRole("button", { name: "Default" })).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Default" }));

        expect(readSettings().startLocation).toBe("combat");
        expect(screen.getByRole("button", { name: "Combat" })).toBeInTheDocument();
    });

    it("reflects a persisted combat start location and toggles back to default", () => {
        writeSettings({ ...DEFAULT_SETTINGS, startLocation: "combat" });

        renderWithProviders(<Settings />);

        fireEvent.click(screen.getByRole("button", { name: "Combat" }));

        expect(readSettings().startLocation).toBe("default");
        expect(screen.getByRole("button", { name: "Default" })).toBeInTheDocument();
    });
});
