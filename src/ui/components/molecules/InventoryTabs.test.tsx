import { describe, it, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import InventoryTabs from "./InventoryTabs";
import type { ComponentStack, LootItem } from "@/types/game";

const gear: LootItem = {
    __typename: "Item",
    id: "gear-1",
    category: "sword",
    color: "#fff",
    icon: "blade",
    set: "weapon",
    uuid: "u1",
    stats: [],
    cost: 30,
    name: "Blade",
};

const components: ComponentStack[] = [{ id: "a", type: "scrap", quantity: 7 }];

describe("InventoryTabs", () => {
    it("shows the Gear tab (drag grid) by default", () => {
        renderWithProviders(<InventoryTabs />, {
            preloadedGame: { inventory: [gear], components },
        });

        expect(screen.getByTestId("loot-grid")).toBeInTheDocument();
        expect(screen.queryByTestId("components-grid")).not.toBeInTheDocument();
    });

    it("switches to the Components tab and back", () => {
        renderWithProviders(<InventoryTabs />, {
            preloadedGame: { inventory: [gear], components },
        });

        fireEvent.click(screen.getByRole("button", { name: "Components" }));
        expect(screen.getByTestId("components-grid")).toBeInTheDocument();
        expect(screen.queryByTestId("loot-grid")).not.toBeInTheDocument();
        // The stack's badge is visible on the Components tab.
        expect(screen.getByText("7")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Gear" }));
        expect(screen.getByTestId("loot-grid")).toBeInTheDocument();
        expect(screen.queryByTestId("components-grid")).not.toBeInTheDocument();
    });
});
