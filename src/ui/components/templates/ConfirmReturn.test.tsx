import { describe, it, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import ConfirmReturn from "@components/ConfirmReturn";

// Template tests for the return-to-town confirmation. Verify Return records
// the travel request and closes the overlay, and Cancel closes without ever
// dispatching one — the actual scene transition is BiomeScene's job.

describe("ConfirmReturn template", () => {
    it("dispatches requestTravel(town) and closes the overlay on Return", () => {
        const { store } = renderWithProviders(<ConfirmReturn />, {
            preloadedGame: { showUi: true, menu: "confirmReturn" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Return" }));

        expect(store.getState().game.travelRequest).toBe("town");
        expect(store.getState().game.showUi).toBe(false);
    });

    it("closes without dispatching a travel request on Cancel", () => {
        const { store } = renderWithProviders(<ConfirmReturn />, {
            preloadedGame: { showUi: true, menu: "confirmReturn" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

        expect(store.getState().game.travelRequest).toBeNull();
        expect(store.getState().game.showUi).toBe(false);
    });
});
