import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import { SAVE_SLOTS, writeSave, type SaveData } from "@services/saveStorage";
import MainMenu from "@components/MainMenu";

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
});

afterEach(() => {
    localStorage.clear();
});

describe("MainMenu template", () => {
    it("renders the title placeholder and core actions", () => {
        renderWithProviders(<MainMenu />);

        expect(screen.getByRole("heading", { name: /phasercraft/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "New Game" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Quit" })).toBeInTheDocument();
    });

    it("enables New Game and hides Load when there are no saves", () => {
        renderWithProviders(<MainMenu />);

        expect(screen.getByRole("button", { name: "New Game" })).toBeEnabled();
        expect(screen.queryByRole("button", { name: "Load" })).not.toBeInTheDocument();
    });

    it("disables New Game when all three slots are full", () => {
        SAVE_SLOTS.forEach((slot) => writeSave(slot, makeSave({ saveSlot: slot })));

        renderWithProviders(<MainMenu />);

        expect(screen.getByRole("button", { name: "New Game" })).toBeDisabled();
    });

    it("renders Load once at least one slot is populated", () => {
        writeSave(SAVE_SLOTS[0], makeSave({ saveSlot: SAVE_SLOTS[0] }));

        renderWithProviders(<MainMenu />);

        expect(screen.getByRole("button", { name: "Load" })).toBeInTheDocument();
    });

    it("New Game navigates to the save screen", () => {
        const { store } = renderWithProviders(<MainMenu />);

        fireEvent.click(screen.getByRole("button", { name: "New Game" }));

        expect(store.getState().game.menu).toBe("save");
    });

    it("Load navigates to the load screen", () => {
        writeSave(SAVE_SLOTS[0], makeSave({ saveSlot: SAVE_SLOTS[0] }));

        const { store } = renderWithProviders(<MainMenu />);

        fireEvent.click(screen.getByRole("button", { name: "Load" }));

        expect(store.getState().game.menu).toBe("load");
    });

    it("Settings navigates to the settings screen", () => {
        const { store } = renderWithProviders(<MainMenu />);

        fireEvent.click(screen.getByRole("button", { name: "Settings" }));

        expect(store.getState().game.menu).toBe("settings");
    });
});
