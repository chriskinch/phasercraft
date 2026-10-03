import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import atlas from "../../../../public/graphics/atlas/scrolls.json";
import ScrollIcon from "./ScrollIcon";

describe("ScrollIcon", () => {
    it("shows the spell × level frame of the committed scroll atlas, centred in the tile", () => {
        const { container } = render(<ScrollIcon spell="Fireball" level={2} />);
        const tile = container.firstElementChild as HTMLElement;
        const { x, y } = atlas.frames.Fireball_l2.frame;

        expect(tile).toHaveAttribute("data-frame", "Fireball_l2");
        const sprite = screen.getByTestId("scroll-sprite");
        expect(sprite.style.backgroundImage).toContain("graphics/atlas/scrolls.png");
        expect(sprite.style.backgroundPosition.split(" ").map(parseFloat)).toEqual(
            [-x, -y].map((n) => n + 0)
        );
        expect(sprite.style.width).toBe("45px");
        expect(tile.style.width).toBe("56px");
    });

    it("outlines the sprite only when selected", () => {
        const { rerender } = render(<ScrollIcon spell="Heal" level={3} />);
        const sprite = () => screen.getByTestId("scroll-sprite");
        const selectedClass = () => [...sprite().classList].some((c) => /selected/.test(c));
        expect(selectedClass()).toBe(false);
        rerender(<ScrollIcon spell="Heal" level={3} selected />);
        expect(selectedClass()).toBe(true);
    });
});
