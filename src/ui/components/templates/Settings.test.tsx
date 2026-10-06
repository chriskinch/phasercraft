import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import { readSettings, writeSettings, DEFAULT_SETTINGS } from "@services/settingsStorage";
import Settings from "@components/Settings";
import { DEFAULT_AREA_TUNING } from "@config/area";

// Template tests for the Settings screen (#379). Verify it reflects the
// persisted settings on mount and that changing a control persists the new
// value: God mode revealing the debug settings, the debug toggles, starter
// items, start location, and the always-visible spawn tuning.

beforeEach(() => {
    localStorage.clear();
});

afterEach(() => {
    localStorage.clear();
});

// The toggle button in the row labelled `label`.
const toggleFor = (label: string) => {
    const row = screen.getByText(label).parentElement as HTMLElement;
    return within(row).getByRole("button");
};
const debugGroup = () => screen.queryByRole("group", { name: "Debug settings" });

describe("Settings template", () => {
    describe("God mode", () => {
        it("hides the debug settings by default", () => {
            renderWithProviders(<Settings />);

            expect(toggleFor("God mode")).toHaveTextContent("Off");
            expect(debugGroup()).toBeNull();
            expect(screen.queryByText("Debug mode")).toBeNull();
            expect(screen.queryByText("Starter items")).toBeNull();
            expect(screen.queryByText("Start location")).toBeNull();
        });

        it("reveals the debug settings when toggled on, persists it, and hides them again", () => {
            renderWithProviders(<Settings />);

            fireEvent.click(toggleFor("God mode"));
            expect(readSettings().godMode).toBe(true);
            expect(debugGroup()).toBeInTheDocument();

            fireEvent.click(toggleFor("God mode"));
            expect(readSettings().godMode).toBe(false);
            expect(debugGroup()).toBeNull();
        });

        it("resets every setting behind it when switched off, leaving the volume", () => {
            writeSettings({
                ...DEFAULT_SETTINGS,
                godMode: true,
                debug: true,
                spawnDebugOverlay: true,
                starterItems: true,
                startLocation: "combat",
                liveCapOverride: 2,
                sfxVolume: 40,
            });
            renderWithProviders(<Settings />);

            fireEvent.click(toggleFor("God mode"));

            expect(readSettings()).toEqual({ ...DEFAULT_SETTINGS, sfxVolume: 40 });

            // Revealed again, every setting reads Off.
            fireEvent.click(toggleFor("God mode"));
            expect(toggleFor("Debug mode")).toHaveTextContent("Off");
            expect(toggleFor("Starter items")).toHaveTextContent("Off");
            expect(screen.getByRole("button", { name: "Default" })).toBeInTheDocument();
        });
    });

    describe("debug settings (under God mode)", () => {
        beforeEach(() => {
            writeSettings({ ...DEFAULT_SETTINGS, godMode: true });
        });

        it("toggles and persists Debug mode", () => {
            renderWithProviders(<Settings />);
            expect(toggleFor("Debug mode")).toHaveTextContent("Off");

            fireEvent.click(toggleFor("Debug mode"));
            expect(readSettings().debug).toBe(true);
            expect(toggleFor("Debug mode")).toHaveTextContent("On");

            fireEvent.click(toggleFor("Debug mode"));
            expect(readSettings().debug).toBe(false);
        });

        it("shows the spawn debug overlay only while Debug mode is on, and persists it", () => {
            renderWithProviders(<Settings />);
            expect(screen.queryByText("Spawn overlay")).toBeNull();

            fireEvent.click(toggleFor("Debug mode"));
            fireEvent.click(toggleFor("Spawn overlay"));

            expect(readSettings().spawnDebugOverlay).toBe(true);
            expect(toggleFor("Spawn overlay")).toHaveTextContent("On");
        });

        it("toggles and persists Starter items", () => {
            renderWithProviders(<Settings />);
            expect(toggleFor("Starter items")).toHaveTextContent("Off");

            fireEvent.click(toggleFor("Starter items"));

            expect(readSettings().starterItems).toBe(true);
            expect(toggleFor("Starter items")).toHaveTextContent("On");
        });

        it("defaults the start-location control to Default and toggles to Combat", () => {
            renderWithProviders(<Settings />);

            expect(screen.getByRole("button", { name: "Default" })).toBeInTheDocument();

            fireEvent.click(screen.getByRole("button", { name: "Default" }));

            expect(readSettings().startLocation).toBe("combat");
            expect(screen.getByRole("button", { name: "Combat" })).toBeInTheDocument();
        });

        it("reflects a persisted combat start location and toggles back to default", () => {
            writeSettings({ ...DEFAULT_SETTINGS, godMode: true, startLocation: "combat" });

            renderWithProviders(<Settings />);

            fireEvent.click(screen.getByRole("button", { name: "Combat" }));

            expect(readSettings().startLocation).toBe("default");
            expect(screen.getByRole("button", { name: "Default" })).toBeInTheDocument();
        });
    });

    describe("spawn tuning (under God mode, independent of Debug mode)", () => {
        it("is hidden while God mode is off", () => {
            renderWithProviders(<Settings />);

            expect(screen.queryByRole("group", { name: "Enemy spawning" })).toBeNull();
            expect(screen.queryByLabelText("Live cap")).toBeNull();
        });

        it("is shown with God mode on and Debug mode off", () => {
            writeSettings({ ...DEFAULT_SETTINGS, godMode: true });
            renderWithProviders(<Settings />);

            expect(screen.getByRole("group", { name: "Enemy spawning" })).toBeInTheDocument();
            expect(screen.getByLabelText("Live cap")).toBeInTheDocument();
        });

        // jsdom's default window is 1024x768: half its 1280px diagonal plus the
        // 64px margin is what the auto spawn radius works out to.
        const AUTO_RADIUS = 704;

        it("shows each override's codified default, not 0", () => {
            writeSettings({ ...DEFAULT_SETTINGS, godMode: true });

            renderWithProviders(<Settings />);

            expect(screen.getByLabelText("Spawn radius (px)")).toHaveValue(AUTO_RADIUS);
            expect(screen.getByLabelText("Live cap")).toHaveValue(DEFAULT_AREA_TUNING.liveCap);
            expect(screen.getByLabelText("Despawn delay (s)")).toHaveValue(
                DEFAULT_AREA_TUNING.despawnDelayMs / 1000
            );
        });

        it("styles every number input the same (one grid column width)", () => {
            writeSettings({ ...DEFAULT_SETTINGS, godMode: true });

            renderWithProviders(<Settings />);

            const classes = screen.getAllByRole("spinbutton").map((input) => input.className);
            expect(classes).toHaveLength(3);
            expect(new Set(classes).size).toBe(1);
        });

        it("shows a stored override instead of the default", () => {
            writeSettings({ ...DEFAULT_SETTINGS, godMode: true, liveCapOverride: 2 });

            renderWithProviders(<Settings />);

            expect(screen.getByLabelText("Live cap")).toHaveValue(2);
        });

        it("persists each numeric override", () => {
            writeSettings({ ...DEFAULT_SETTINGS, godMode: true });
            renderWithProviders(<Settings />);

            fireEvent.change(screen.getByLabelText("Spawn radius (px)"), {
                target: { value: "200" },
            });
            fireEvent.change(screen.getByLabelText("Live cap"), { target: { value: "2" } });
            fireEvent.change(screen.getByLabelText("Despawn delay (s)"), {
                target: { value: "5" },
            });

            expect(readSettings()).toMatchObject({
                spawnRadiusOverride: 200,
                liveCapOverride: 2,
                despawnDelaySeconds: 5,
            });
            expect(screen.getByLabelText("Live cap")).toHaveValue(2);
        });

        it("stores entering the default value itself as following the default", () => {
            writeSettings({ ...DEFAULT_SETTINGS, godMode: true, liveCapOverride: 2 });
            renderWithProviders(<Settings />);

            fireEvent.change(screen.getByLabelText("Live cap"), {
                target: { value: String(DEFAULT_AREA_TUNING.liveCap) },
            });

            expect(readSettings().liveCapOverride).toBe(0);
        });

        it("lets a field be cleared while typing, and shows the default again on blur", () => {
            writeSettings({ ...DEFAULT_SETTINGS, godMode: true, liveCapOverride: 4 });
            renderWithProviders(<Settings />);
            const input = screen.getByLabelText("Live cap");

            // Cleared mid-edit: the field stays empty rather than snapping back.
            fireEvent.change(input, { target: { value: "" } });
            expect(input).toHaveValue(null);
            expect(readSettings().liveCapOverride).toBe(0);

            fireEvent.blur(input);
            expect(input).toHaveValue(DEFAULT_AREA_TUNING.liveCap);
        });

        it("stores a negative entry as following the default", () => {
            writeSettings({ ...DEFAULT_SETTINGS, godMode: true });
            renderWithProviders(<Settings />);

            fireEvent.change(screen.getByLabelText("Despawn delay (s)"), {
                target: { value: "-5" },
            });

            expect(readSettings().despawnDelaySeconds).toBe(0);
        });

        describe("Reset", () => {
            const resetFor = (label: string) =>
                within(screen.getByRole("group", { name: `${label} setting` })).getByRole(
                    "button",
                    { name: "Reset" }
                );

            it("is disabled while the field already follows its default", () => {
                writeSettings({ ...DEFAULT_SETTINGS, godMode: true });
                renderWithProviders(<Settings />);

                for (const label of ["Spawn radius (px)", "Live cap", "Despawn delay (s)"]) {
                    expect(resetFor(label)).toBeDisabled();
                }
            });

            it("returns an overridden field to its codified default", () => {
                writeSettings({ ...DEFAULT_SETTINGS, godMode: true, despawnDelaySeconds: 5 });
                renderWithProviders(<Settings />);

                fireEvent.click(resetFor("Despawn delay (s)"));

                expect(readSettings().despawnDelaySeconds).toBe(0);
                expect(screen.getByLabelText("Despawn delay (s)")).toHaveValue(
                    DEFAULT_AREA_TUNING.despawnDelayMs / 1000
                );
                expect(resetFor("Despawn delay (s)")).toBeDisabled();
            });

            it("returns the radius to automatic, showing the value auto works out to", () => {
                writeSettings({ ...DEFAULT_SETTINGS, godMode: true, spawnRadiusOverride: 200 });
                renderWithProviders(<Settings />);

                fireEvent.click(resetFor("Spawn radius (px)"));

                expect(readSettings().spawnRadiusOverride).toBe(0);
                expect(screen.getByLabelText("Spawn radius (px)")).toHaveValue(AUTO_RADIUS);
            });

            it("only resets its own field", () => {
                writeSettings({
                    ...DEFAULT_SETTINGS,
                    godMode: true,
                    liveCapOverride: 2,
                    despawnDelaySeconds: 5,
                });
                renderWithProviders(<Settings />);

                fireEvent.click(resetFor("Live cap"));

                expect(readSettings().liveCapOverride).toBe(0);
                expect(readSettings().despawnDelaySeconds).toBe(5);
            });
        });
    });

    describe("sound effects volume", () => {
        const slider = () => screen.getByLabelText("Sound effects");

        it("defaults to 70%", () => {
            renderWithProviders(<Settings />);

            expect(slider()).toHaveValue("70");
            expect(screen.getByText("70%")).toBeInTheDocument();
        });

        it("persists a new volume", () => {
            renderWithProviders(<Settings />);

            fireEvent.change(slider(), { target: { value: "35" } });

            expect(readSettings().sfxVolume).toBe(35);
            expect(screen.getByText("35%")).toBeInTheDocument();
        });

        it("shows Muted at 0", () => {
            writeSettings({ ...DEFAULT_SETTINGS, sfxVolume: 0 });
            renderWithProviders(<Settings />);

            expect(slider()).toHaveValue("0");
            expect(screen.getByText("Muted")).toBeInTheDocument();
        });
    });
});
