import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import atlas from "../../../../public/graphics/atlas/scrolls.json";
import ScrollIcon from "./ScrollIcon";

describe("ScrollIcon", () => {
    it("shows the spell × level frame of the committed scroll atlas, centred in the tile", () => {
        const { container } = render(<ScrollIcon spell="Fireball" level={2} />);
        const tile = container.firstElementChild as HTMLElement;
        const { x, y } = atlas.frames.Fireball_l2.frame;

        expect(tile).toHaveAttribute("data-frame", "Fireball_l2");
        expect(tile.style.backgroundImage).toContain("graphics/atlas/scrolls.png");
        expect(tile.style.backgroundPosition).toBe(`${5 - x}px ${5 - y}px`);
        expect(tile.style.width).toBe("56px");
    });

    it("has no border unless selected (red)", () => {
        const { container, rerender } = render(<ScrollIcon spell="Heal" level={3} />);
        const tile = () => container.firstElementChild as HTMLElement;
        expect(tile().style.getPropertyValue("--loot-border")).toBe("transparent");
        rerender(<ScrollIcon spell="Heal" level={3} selected />);
        expect(tile().style.getPropertyValue("--loot-border")).toBe("red");
    });
});
