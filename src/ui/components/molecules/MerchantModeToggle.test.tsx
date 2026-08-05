import { describe, it, expect } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import MerchantModeToggle from "./MerchantModeToggle";

describe("MerchantModeToggle", () => {
    it("switches the store's merchant mode between buy and sell", () => {
        const { store } = renderWithProviders(<MerchantModeToggle />);
        const modes = within(screen.getByTestId("merchant-modes"));

        expect(store.getState().game.merchant.mode).toBe("buy");

        fireEvent.click(modes.getByRole("button", { name: "Sell" }));
        expect(store.getState().game.merchant.mode).toBe("sell");

        fireEvent.click(modes.getByRole("button", { name: "Buy" }));
        expect(store.getState().game.merchant.mode).toBe("buy");
    });
});
