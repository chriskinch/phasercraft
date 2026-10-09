import { describe, it, expect } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import ArcanumTabs from "./ArcanumTabs";

describe("ArcanumTabs", () => {
    it("switches the store's Arcanum tab between Merge and Craft", () => {
        const { store } = renderWithProviders(<ArcanumTabs />);
        const tabs = within(screen.getByTestId("arcanum-tabs"));

        expect(store.getState().game.arcanumTab).toBe("merge");
        fireEvent.click(tabs.getByRole("button", { name: "Craft" }));
        expect(store.getState().game.arcanumTab).toBe("craft");
        fireEvent.click(tabs.getByRole("button", { name: "Merge" }));
        expect(store.getState().game.arcanumTab).toBe("merge");
    });
});
