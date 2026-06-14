import { describe, it, expect } from "vitest";
import { fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import LootListDrag from "@components/LootListDrag";
import type { LootItem } from "@/types/game";

function makeItem(overrides: Partial<LootItem> = {}): LootItem {
    return {
        __typename: "Item",
        id: "item-1",
        category: "helmet",
        color: "#abcdef",
        icon: "iron-helm",
        set: "helm",
        uuid: "uuid-1",
        stats: [{ id: "stat-def", name: "defence", value: 5 }],
        cost: 30,
        name: "Iron Helm",
        ...overrides,
    };
}

describe("LootListDrag (Inventory grid)", () => {
    it("renders one draggable entry per item in the list", () => {
        const list = [
            makeItem({ id: "a", uuid: "ua", icon: "helm-a" }),
            makeItem({ id: "b", uuid: "ub", icon: "helm-b" }),
            makeItem({ id: "c", uuid: "uc", icon: "helm-c" }),
        ];
        const { container } = renderWithProviders(<LootListDrag list={list} name="inventory" />);

        const grid = container.querySelector(".loot-grid");
        expect(grid).toBeInTheDocument();
        // Each item renders a LootIcon image; the grid wraps the draggable nodes.
        expect(container.querySelectorAll(".styled-loot-icon")).toHaveLength(3);
    });

    it("renders nothing for an empty list but still mounts the drop grid", () => {
        const { container } = renderWithProviders(<LootListDrag list={[]} name="inventory" />);
        expect(container.querySelector(".loot-grid")).toBeInTheDocument();
        expect(container.querySelectorAll(".styled-loot-icon")).toHaveLength(0);
    });

    it("dispatches selectLoot with the clicked item", () => {
        const item = makeItem({ id: "pick-me", uuid: "u-pick" });
        const { store, container } = renderWithProviders(
            <LootListDrag list={[item]} name="inventory" />
        );

        // Loot wires onClick onto the icon's wrapper div (data-tooltip-id == item id).
        const clickable = container.querySelector(`[data-tooltip-id="pick-me"]`) as HTMLElement;
        expect(clickable).toBeInTheDocument();
        fireEvent.click(clickable);

        expect(store.getState().game.selected?.id).toBe("pick-me");
    });

    it("marks the matching item as selected via the selected store slice", () => {
        const item = makeItem({ id: "sel-1", uuid: "u-sel" });
        const { container } = renderWithProviders(<LootListDrag list={[item]} name="inventory" />, {
            preloadedGame: { selected: item },
        });
        // A selected icon renders with a red border (see LootIcon styling).
        const icon = container.querySelector(".styled-loot-icon");
        expect(icon).toBeInTheDocument();
    });
});
