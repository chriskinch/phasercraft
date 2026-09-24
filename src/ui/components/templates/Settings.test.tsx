import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import { readSettings, writeSettings, DEFAULT_SETTINGS } from "@services/settingsStorage";
import Settings from "@components/Settings";
import { DEFAULT_AREA_TUNING } from "@config/area";

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

    describe("spawn debugging (under Debug mode)", () => {
        const spawnGroup = () => screen.getByRole("group", { name: "Spawn debugging" });

        it("is hidden while Debug mode is off", () => {
            renderWithProviders(<Settings />);

            expect(screen.queryByRole("group", { name: "Spawn debugging" })).toBeNull();
            expect(screen.queryByLabelText("Live cap")).toBeNull();
        });

        it("appears when Debug mode is switched on, and hides again when it is off", () => {
            renderWithProviders(<Settings />);

            fireEvent.click(screen.getByRole("button", { name: "Off" }));
            expect(spawnGroup()).toBeInTheDocument();

            // The Debug mode toggle is the first "On" button; the overlay's is inside the group.
            fireEvent.click(screen.getAllByRole("button", { name: "On" })[0]);
            expect(screen.queryByRole("group", { name: "Spawn debugging" })).toBeNull();
        });

        // jsdom's default window is 1024x768: half its 1280px diagonal plus the
        // 64px margin is what the auto spawn radius works out to.
        const AUTO_RADIUS = 704;

        it("shows each override's codified default, not 0", () => {
            writeSettings({ ...DEFAULT_SETTINGS, debug: true });

            renderWithProviders(<Settings />);

            expect(screen.getByLabelText("Spawn radius (px)")).toHaveValue(AUTO_RADIUS);
            expect(screen.getByLabelText("Live cap")).toHaveValue(DEFAULT_AREA_TUNING.liveCap);
            expect(screen.getByLabelText("Kills to boss")).toHaveValue(
                DEFAULT_AREA_TUNING.killsToBoss
            );
            expect(screen.getByLabelText("Despawn delay (s)")).toHaveValue(
                DEFAULT_AREA_TUNING.despawnDelayMs / 1000
            );
        });

        it("shows a stored override instead of the default", () => {
            writeSettings({ ...DEFAULT_SETTINGS, debug: true, liveCapOverride: 2 });

            renderWithProviders(<Settings />);

            expect(screen.getByLabelText("Live cap")).toHaveValue(2);
        });

        it("persists each numeric override", () => {
            writeSettings({ ...DEFAULT_SETTINGS, debug: true });
            renderWithProviders(<Settings />);

            fireEvent.change(screen.getByLabelText("Spawn radius (px)"), {
                target: { value: "200" },
            });
            fireEvent.change(screen.getByLabelText("Live cap"), { target: { value: "2" } });
            fireEvent.change(screen.getByLabelText("Kills to boss"), { target: { value: "3" } });
            fireEvent.change(screen.getByLabelText("Despawn delay (s)"), {
                target: { value: "5" },
            });

            expect(readSettings()).toMatchObject({
                spawnRadiusOverride: 200,
                liveCapOverride: 2,
                killsToBossOverride: 3,
                despawnDelaySeconds: 5,
            });
            expect(screen.getByLabelText("Live cap")).toHaveValue(2);
        });

        it("stores entering the default value itself as following the default", () => {
            writeSettings({ ...DEFAULT_SETTINGS, debug: true, liveCapOverride: 2 });
            renderWithProviders(<Settings />);

            fireEvent.change(screen.getByLabelText("Live cap"), {
                target: { value: String(DEFAULT_AREA_TUNING.liveCap) },
            });

            expect(readSettings().liveCapOverride).toBe(0);
        });

        it("lets a field be cleared while typing, and shows the default again on blur", () => {
            writeSettings({ ...DEFAULT_SETTINGS, debug: true, liveCapOverride: 4 });
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
            writeSettings({ ...DEFAULT_SETTINGS, debug: true });
            renderWithProviders(<Settings />);

            fireEvent.change(screen.getByLabelText("Kills to boss"), { target: { value: "-5" } });

            expect(readSettings().killsToBossOverride).toBe(0);
        });

        describe("Reset", () => {
            const resetFor = (label: string) =>
                within(screen.getByRole("group", { name: `${label} setting` })).getByRole(
                    "button",
                    { name: "Reset" }
                );

            it("is disabled while the field already follows its default", () => {
                writeSettings({ ...DEFAULT_SETTINGS, debug: true });
                renderWithProviders(<Settings />);

                for (const label of [
                    "Spawn radius (px)",
                    "Live cap",
                    "Kills to boss",
                    "Despawn delay (s)",
                ]) {
                    expect(resetFor(label)).toBeDisabled();
                }
            });

            it("returns an overridden field to its codified default", () => {
                writeSettings({ ...DEFAULT_SETTINGS, debug: true, killsToBossOverride: 3 });
                renderWithProviders(<Settings />);

                fireEvent.click(resetFor("Kills to boss"));

                expect(readSettings().killsToBossOverride).toBe(0);
                expect(screen.getByLabelText("Kills to boss")).toHaveValue(
                    DEFAULT_AREA_TUNING.killsToBoss
                );
                expect(resetFor("Kills to boss")).toBeDisabled();
            });

            it("returns the radius to automatic, showing the value auto works out to", () => {
                writeSettings({ ...DEFAULT_SETTINGS, debug: true, spawnRadiusOverride: 200 });
                renderWithProviders(<Settings />);

                fireEvent.click(resetFor("Spawn radius (px)"));

                expect(readSettings().spawnRadiusOverride).toBe(0);
                expect(screen.getByLabelText("Spawn radius (px)")).toHaveValue(AUTO_RADIUS);
            });

            it("only resets its own field", () => {
                writeSettings({
                    ...DEFAULT_SETTINGS,
                    debug: true,
                    liveCapOverride: 2,
                    killsToBossOverride: 3,
                });
                renderWithProviders(<Settings />);

                fireEvent.click(resetFor("Live cap"));

                expect(readSettings().liveCapOverride).toBe(0);
                expect(readSettings().killsToBossOverride).toBe(3);
            });
        });

        it("toggles and persists the spawn debug overlay", () => {
            writeSettings({ ...DEFAULT_SETTINGS, debug: true });
            renderWithProviders(<Settings />);

            fireEvent.click(within(spawnGroup()).getByRole("button", { name: "Off" }));

            expect(readSettings().spawnDebugOverlay).toBe(true);
            expect(within(spawnGroup()).getByRole("button", { name: "On" })).toBeInTheDocument();
        });

        it("keeps the overrides when Debug mode is switched off, so they return with it", () => {
            writeSettings({ ...DEFAULT_SETTINGS, debug: true, liveCapOverride: 2 });
            renderWithProviders(<Settings />);

            fireEvent.click(screen.getAllByRole("button", { name: "On" })[0]);

            expect(readSettings().debug).toBe(false);
            expect(readSettings().liveCapOverride).toBe(2);
        });
    });
});
