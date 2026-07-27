import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import { DIALOG_ROOT_ID } from "@components/Dialog";
import { readSave } from "@services/saveStorage";
import System from "@components/System";

beforeEach(() => {
    localStorage.clear();
});

afterEach(() => {
    localStorage.clear();
    document.getElementById(DIALOG_ROOT_ID)?.remove();
});

describe("System template", () => {
    it("renders the in-game system actions", () => {
        renderWithProviders(<System />);

        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Quit" })).toBeInTheDocument();
    });

    it("Settings navigates to the settings screen and records the return path", () => {
        const { store } = renderWithProviders(<System />, {
            preloadedGame: { menu: "system" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Settings" }));

        const { menu, previousMenu } = store.getState().game;
        // Settings can now be reached mid-run; closing it returns to the system menu.
        expect(menu).toBe("settings");
        expect(previousMenu).toBe("system");
    });

    // The save flow had no coverage at all, which is how two separate bugs shipped:
    // the confirm dialog never rendered (missing portal root), and the state to
    // persist arrived as `undefined` because the menu registry never passed the
    // prop it required — so every save wrote the literal string "undefined".
    describe("save flow", () => {
        it("Save opens the overwrite confirmation", () => {
            renderWithProviders(<System />, { preloadedGame: { saveSlot: "slot_a" } });

            expect(
                screen.queryByText(/overwrite your existing save game/i)
            ).not.toBeInTheDocument();

            fireEvent.click(screen.getByRole("button", { name: "Save" }));

            expect(screen.getByText(/overwrite your existing save game/i)).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Yes" })).toBeInTheDocument();
        });

        it("confirming writes the live store state to the selected slot", () => {
            const { store } = renderWithProviders(<System />, {
                preloadedGame: { saveSlot: "slot_a", coins: 250, wave: 7, character: "Mage" },
            });

            fireEvent.click(screen.getByRole("button", { name: "Save" }));
            // Confirming also dispatches toggleUi, so snapshot the state that is
            // being persisted before it changes underneath the assertion.
            const persisted = JSON.stringify(store.getState());
            fireEvent.click(screen.getByRole("button", { name: "Yes" }));

            expect(localStorage.getItem("slot_a")).toBe(persisted);
        });

        it("writes a save the loader can actually read back", () => {
            renderWithProviders(<System />, {
                preloadedGame: { saveSlot: "slot_a", coins: 250, wave: 7, character: "Mage" },
            });

            fireEvent.click(screen.getByRole("button", { name: "Save" }));
            fireEvent.click(screen.getByRole("button", { name: "Yes" }));

            // The round trip is the property that actually matters: a slot the
            // Save menu reads as empty is indistinguishable from never saving.
            const loaded = readSave("slot_a");
            expect(loaded).not.toBeNull();
            expect(loaded!.game.character).toBe("Mage");
            expect(loaded!.game.coins).toBe(250);
            expect(loaded!.game.wave).toBe(7);
        });

        it("never persists a non-object payload", () => {
            renderWithProviders(<System />, { preloadedGame: { saveSlot: "slot_a" } });

            fireEvent.click(screen.getByRole("button", { name: "Save" }));
            fireEvent.click(screen.getByRole("button", { name: "Yes" }));

            const raw = localStorage.getItem("slot_a");
            // `JSON.stringify(undefined)` returns undefined, which setItem coerces
            // to the string "undefined" and writeSave reports as a success.
            expect(raw).not.toBe("undefined");
            expect(() => JSON.parse(raw!)).not.toThrow();
            expect(JSON.parse(raw!)).toMatchObject({ game: expect.any(Object) });
        });

        it("persists state changes made after mount", () => {
            const { store } = renderWithProviders(<System />, {
                preloadedGame: { saveSlot: "slot_a", wave: 1 },
            });

            store.dispatch({ type: "NEXT_WAVE" });
            fireEvent.click(screen.getByRole("button", { name: "Save" }));
            fireEvent.click(screen.getByRole("button", { name: "Yes" }));

            expect(readSave("slot_a")!.game.wave).toBe(2);
        });

        it("Cancel closes the dialog without writing", () => {
            renderWithProviders(<System />, { preloadedGame: { saveSlot: "slot_a" } });

            fireEvent.click(screen.getByRole("button", { name: "Save" }));
            fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

            expect(
                screen.queryByText(/overwrite your existing save game/i)
            ).not.toBeInTheDocument();
            expect(localStorage.getItem("slot_a")).toBeNull();
        });

        it("does not write when no save slot has been selected", () => {
            renderWithProviders(<System />, { preloadedGame: { saveSlot: undefined } });

            fireEvent.click(screen.getByRole("button", { name: "Save" }));
            fireEvent.click(screen.getByRole("button", { name: "Yes" }));

            expect(localStorage).toHaveLength(0);
        });
    });

    // The menu registry (UI.tsx) widens every template to a prop-erased component
    // type before rendering it, which deletes the type error a missing required
    // prop would otherwise raise. Render System the same way the registry does:
    // with no props at all, which must still produce a valid save.
    it("saves correctly when rendered the way the menu registry renders it", () => {
        const AsMenuComponent = System as React.ComponentType<Record<string, unknown>>;

        renderWithProviders(<AsMenuComponent />, { preloadedGame: { saveSlot: "slot_a" } });

        fireEvent.click(screen.getByRole("button", { name: "Save" }));
        fireEvent.click(screen.getByRole("button", { name: "Yes" }));

        expect(readSave("slot_a")).not.toBeNull();
    });
});
