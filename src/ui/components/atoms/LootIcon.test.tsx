import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LootIcon from "@components/LootIcon";
import { ICON_TILE } from "@ui/themes";

const props = { category: "helmet", color: "#abcdef", icon: "helmet_1" };

describe("LootIcon", () => {
    it("renders every icon as the shared square tile", () => {
        render(<LootIcon {...props} />);
        const img = screen.getByAltText("Loot!");
        expect(img.style.width).toBe(`${ICON_TILE}px`);
        expect(img.style.height).toBe(`${ICON_TILE}px`);
    });

    it("uses the item colour for the border, or red when selected", () => {
        const { rerender } = render(<LootIcon {...props} />);
        const img = screen.getByAltText("Loot!");
        expect(img.style.getPropertyValue("--loot-border")).toBe("#abcdef");
        rerender(<LootIcon {...props} selected />);
        expect(img.style.getPropertyValue("--loot-border")).toBe("red");
    });

    it("applies a raw override declaration as an inline style", () => {
        render(<LootIcon {...props} styles={{ override: "margin-right:0.5em;" }} />);
        expect(screen.getByAltText("Loot!").style.marginRight).toBe("0.5em");
    });
});
