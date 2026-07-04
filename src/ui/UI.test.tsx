import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import UI from "./UI";

beforeEach(() => {
    localStorage.clear();
    // Some screens portal dialogs into #app; provide the mount point.
    const app = document.createElement("div");
    app.id = "app";
    document.body.appendChild(app);
});

afterEach(() => {
    localStorage.clear();
    document.getElementById("app")?.remove();
});

describe("UI overlay close/back navigation", () => {
    it("closing Settings returns to the previous screen instead of closing the overlay", () => {
        const { store } = renderWithProviders(<UI />, {
            preloadedGame: { showUi: true, menu: "settings", previousMenu: "menu" },
        });

        fireEvent.click(screen.getByRole("button", { name: "X" }));

        const state = store.getState().game;
        expect(state.menu).toBe("menu");
        expect(state.showUi).toBe(true);
    });

    it("closing Settings falls back to the main menu when no previous screen was recorded", () => {
        const { store } = renderWithProviders(<UI />, {
            preloadedGame: { showUi: true, menu: "settings", previousMenu: undefined },
        });

        fireEvent.click(screen.getByRole("button", { name: "X" }));

        const state = store.getState().game;
        expect(state.menu).toBe("menu");
        expect(state.showUi).toBe(true);
    });

    it("closing a non-back screen still closes the whole overlay", () => {
        const { store } = renderWithProviders(<UI />, {
            preloadedGame: { showUi: true, menu: "load", previousMenu: "menu" },
        });

        fireEvent.click(screen.getByRole("button", { name: "X" }));

        expect(store.getState().game.showUi).toBe(false);
    });
});
