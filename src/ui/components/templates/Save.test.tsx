import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import { SAVE_SLOTS, writeSave, type SaveData } from "@services/saveStorage";
import Save from "@components/Save";

// Build a minimal persisted save (root state shape: `{ game: {...} }`) for a slot.
function makeSave(overrides: Partial<SaveData["game"]> = {}): SaveData {
    return {
        game: {
            character: "Warrior",
            coins: 250,
            wave: 7,
            saveSlot: "slot_a",
            ...overrides,
        },
    } as unknown as SaveData;
}

beforeEach(() => {
    localStorage.clear();
    // Dialog portals into #app; provide the mount point for the delete flow.
    const app = document.createElement("div");
    app.id = "app";
    document.body.appendChild(app);
});

afterEach(() => {
    localStorage.clear();
    document.getElementById("app")?.remove();
});

describe("Save template (save slots)", () => {
    it("renders one slot per SAVE_SLOTS entry in the default (save) mode", () => {
        const { container } = renderWithProviders(<Save />);
        expect(container.querySelectorAll("ol > li")).toHaveLength(SAVE_SLOTS.length);
    });

    it("shows save metadata and a Load action for a populated slot", () => {
        writeSave(SAVE_SLOTS[0], makeSave({ character: "Mage", coins: 500, wave: 12 }));

        renderWithProviders(<Save />);

        expect(screen.getByText("Wave: 12")).toBeInTheDocument();
        expect(screen.getByText("Gold: 500")).toBeInTheDocument();
        // A populated slot offers Load; an empty slot offers Select instead.
        expect(screen.getAllByRole("button", { name: "Load" }).length).toBeGreaterThanOrEqual(1);
    });

    it("offers Select (not Load) for empty slots and dispatches slot selection", () => {
        const { store } = renderWithProviders(<Save />);

        const selectButtons = screen.getAllByRole("button", { name: "Select" });
        expect(selectButtons).toHaveLength(SAVE_SLOTS.length);

        fireEvent.click(selectButtons[0]);

        const state = store.getState().game;
        expect(state.saveSlot).toBe(SAVE_SLOTS[0]);
        // switchUi("select") swaps the visible menu.
        expect(state.menu).toBe("select");
    });

    it("dispatches loadGame and selectCharacter when loading a populated slot", () => {
        writeSave(SAVE_SLOTS[0], makeSave({ character: "Ranger", coins: 99, wave: 3 }));

        const { store } = renderWithProviders(<Save load />);

        fireEvent.click(screen.getByRole("button", { name: "Load" }));

        const state = store.getState().game;
        expect(state.coins).toBe(99);
        expect(state.wave).toBe(3);
        expect(state.character).toBe("Ranger");
    });

    it("in load mode only renders populated slots", () => {
        writeSave(SAVE_SLOTS[1], makeSave({ character: "Cleric", coins: 10, wave: 1 }));

        const { container } = renderWithProviders(<Save load />);

        // Two of three slots are empty, so load mode shows a single slot.
        expect(container.querySelectorAll("ol > li")).toHaveLength(1);
        expect(screen.getByText("Gold: 10")).toBeInTheDocument();
    });

    it("disables Delete on empty slots and confirms removal via the dialog", () => {
        writeSave(SAVE_SLOTS[0], makeSave({ character: "Mage", saveSlot: SAVE_SLOTS[0] }));

        renderWithProviders(<Save />);

        const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
        // First slot is populated (enabled); the other two are empty (disabled).
        expect(deleteButtons[0]).toBeEnabled();
        expect(deleteButtons[1]).toBeDisabled();
        expect(deleteButtons[2]).toBeDisabled();

        fireEvent.click(deleteButtons[0]);

        // The confirmation dialog appears (portaled into #app).
        const app = document.getElementById("app") as HTMLElement;
        const dialog = within(app);
        expect(dialog.getByText(/Are you sure/i)).toBeInTheDocument();

        fireEvent.click(dialog.getByRole("button", { name: "Confirm" }));

        // The slot is cleared from storage after confirmation.
        expect(localStorage.getItem(SAVE_SLOTS[0])).toBeNull();
    });

    it("cancels deletion and leaves the save intact", () => {
        writeSave(SAVE_SLOTS[0], makeSave({ saveSlot: SAVE_SLOTS[0] }));

        renderWithProviders(<Save />);

        fireEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);
        const app = document.getElementById("app") as HTMLElement;
        fireEvent.click(within(app).getByRole("button", { name: "Cancel" }));

        expect(localStorage.getItem(SAVE_SLOTS[0])).not.toBeNull();
    });
});
