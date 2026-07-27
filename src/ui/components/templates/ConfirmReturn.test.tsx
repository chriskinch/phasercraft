import { describe, it, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import ConfirmReturn from "@components/ConfirmReturn";

describe("ConfirmReturn", () => {
    it("sets the travel intent to town on Return", () => {
        const { store } = renderWithProviders(<ConfirmReturn />, {
            preloadedGame: { showUi: true, menu: "confirmReturn" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Return" }));

        const state = store.getState().game;
        expect(state.travelTo).toBe("town");
        expect(state.showUi).toBe(false);
    });

    it("closes without travelling on Cancel", () => {
        const { store } = renderWithProviders(<ConfirmReturn />, {
            preloadedGame: { showUi: true, menu: "confirmReturn" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

        const state = store.getState().game;
        expect(state.travelTo).toBeNull();
        expect(state.showUi).toBe(false);
    });
});
