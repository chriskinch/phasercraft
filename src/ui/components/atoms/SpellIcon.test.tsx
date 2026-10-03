import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import iconAtlas from "../../../../public/graphics/atlas/atlas-icons.json";
import SpellIcon from "./SpellIcon";

const ICON = "icon_0017_fire-ball";
const frame = iconAtlas.frames.find((f) => f.filename === ICON)!.frame;

describe("SpellIcon", () => {
    it("sizes and offsets the sprite from the atlas frame", () => {
        const { container } = render(<SpellIcon icon={ICON} />);
        const el = container.querySelector<HTMLElement>(`[data-icon="${ICON}"]`)!;
        expect(el.style.width).toBe(`${frame.w}px`);
        expect(el.style.height).toBe(`${frame.h}px`);
        // jsdom normalises "-0px" to "0px", so compare numerically.
        const [x, y] = el.style.backgroundPosition.split(" ").map(parseFloat);
        expect([x, y]).toEqual([-frame.x, -frame.y].map((n) => n + 0));
    });

    it("renders nothing for an unknown icon", () => {
        const { container } = render(<SpellIcon icon="no_such_icon" />);
        expect(container).toBeEmptyDOMElement();
    });

    it("is a named image when labelled", () => {
        render(<SpellIcon icon={ICON} label="Fireball" />);
        expect(screen.getByRole("img", { name: "Fireball" })).toBeInTheDocument();
    });

    it("is hidden from assistive tech when unlabelled", () => {
        const { container } = render(<SpellIcon icon={ICON} />);
        const el = container.querySelector(`[data-icon="${ICON}"]`)!;
        expect(el).toHaveAttribute("aria-hidden", "true");
        expect(el).not.toHaveAttribute("role");
    });
});
