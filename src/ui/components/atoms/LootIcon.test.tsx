import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LootIcon from "@components/LootIcon";
import { ICON_TILE } from "@ui/themes";
import iconStyles from "./LootIcon.module.css";

const props = { category: "helmet", color: "#abcdef", icon: "helmet_1" };

describe("LootIcon", () => {
    it("renders as the shared square tile by default", () => {
        // Guard: CSS-module class names must resolve in tests for the class checks.
        expect(iconStyles.tile).toBeTruthy();
        render(<LootIcon {...props} />);
        const img = screen.getByAltText("Loot!");
        expect(img).toHaveClass(iconStyles.tile);
        expect(img.style.width).toBe(`${ICON_TILE}px`);
        expect(img.style.height).toBe(`${ICON_TILE}px`);
    });

    it("opts out of the tile when styles.width is set (inline thumbnails)", () => {
        render(<LootIcon {...props} styles={{ width: 16 }} />);
        const img = screen.getByAltText("Loot!");
        expect(img).not.toHaveClass(iconStyles.tile);
        expect(img.style.width).toBe("16px");
        expect(img.style.height).toBe("");
    });
});
