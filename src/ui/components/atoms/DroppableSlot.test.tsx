import { describe, it, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import DroppableSlot from "@components/DroppableSlot";
import type { LootItem } from "@/types/game";

const helm: LootItem = {
    __typename: "Item",
    id: "helm-1",
    category: "helmet",
    color: "#abcdef",
    icon: "iron-helm",
    set: "helm",
    uuid: "uuid-helm-1",
    stats: [{ id: "stat-def", name: "defence", value: 5 }],
    cost: 30,
    name: "Iron Helm",
};

describe("DroppableSlot", () => {
    it("registers as a react-dnd drop target without an equipped item", () => {
        const { container } = renderWithProviders(<DroppableSlot slot="helm" loot={null} />);
        const slot = container.querySelector(`[data-testid="droppable-slot"]`);
        expect(slot).toBeInTheDocument();
        // Empty slot renders no loot icon.
        expect(container.querySelector(`img[alt="Loot!"]`)).not.toBeInTheDocument();
    });

    it("renders the equipped item's icon when a loot item is provided", () => {
        const { container } = renderWithProviders(<DroppableSlot slot="helm" loot={helm} />);
        const icon = container.querySelector(`img[alt="Loot!"]`);
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute("src", "graphics/images/loot/helmet/iron-helm.png");
    });

    it("dispatches unequipLoot when an occupied slot is clicked", () => {
        const { store, container } = renderWithProviders(
            <DroppableSlot slot="helm" loot={helm} />,
            {
                preloadedGame: {
                    equipment: { amulet: null, body: null, helm, weapon: null },
                    base_stats: { defence: 10 } as never,
                },
            }
        );

        const slot = container.querySelector(`[data-testid="droppable-slot"]`) as HTMLElement;
        fireEvent.click(slot);

        const state = store.getState().game;
        // unequipLoot clears the slot and moves the item back into the inventory.
        expect(state.equipment.helm).toBeNull();
        expect(state.inventory.map((l) => l.id)).toContain("helm-1");
    });

    it("does nothing when an empty slot is clicked", () => {
        const { store, container } = renderWithProviders(<DroppableSlot slot="helm" loot={null} />);
        const before = store.getState().game;
        const slot = container.querySelector(`[data-testid="droppable-slot"]`) as HTMLElement;
        fireEvent.click(slot);
        expect(store.getState().game).toEqual(before);
        // Sanity: an unrelated query confirms nothing rendered/changed.
        expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });
});
