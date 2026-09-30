import { fireEvent, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import ItemTooltip from "./ItemTooltip";
import type { LootItem } from "@/types/game";

afterEach(() => {
    vi.unstubAllGlobals();
});

const loot: LootItem = {
    __typename: "Item",
    id: "tooltip-item",
    category: "helmet",
    color: "#abcdef",
    icon: "iron-helm",
    set: "helm",
    uuid: "uuid-1",
    stats: [],
    cost: 30,
    name: "Iron Helm",
};

describe("ItemTooltip", () => {
    it("renders above other UI layers", async () => {
        vi.stubGlobal(
            "ResizeObserver",
            class {
                observe() {}
                unobserve() {}
                disconnect() {}
            }
        );
        const { container } = renderWithProviders(
            <>
                <div data-tooltip-id="tooltip-item" />
                <ItemTooltip id="tooltip-item" loot={loot} />
            </>
        );
        fireEvent.mouseEnter(container.querySelector('[data-tooltip-id="tooltip-item"]')!);

        await waitFor(() => {
            expect(document.getElementById("tooltip-item")).toHaveStyle({ zIndex: "10000" });
        });
    });
});
