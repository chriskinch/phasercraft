import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Stat from "./Stat";
import Attribute from "./Attribute";
import { STAT_POSITIVE, STAT_NEGATIVE } from "@ui/themes";

// Stat prefixes gains with "+" and colours via --stat-color; Attribute shows the
// bare value and colours via --attribute-color. Both share the polarity colours.
describe.each([
    { name: "Stat", Component: Stat, colorVar: "--stat-color", plus: "+" },
    { name: "Attribute", Component: Attribute, colorVar: "--attribute-color", plus: "" },
])("$name polarity colour", ({ Component, colorVar, plus }) => {
    const colorOf = (text: string) => screen.getByText(text).style.getPropertyValue(colorVar);

    it("uses the shared gain colour for a positive polarity", () => {
        render(<Component label="defence" value={4} polarity={1} />);
        expect(colorOf(`${plus}4`)).toBe(STAT_POSITIVE);
    });

    it("uses the shared loss colour for a negative polarity", () => {
        render(<Component label="defence" value={-4} polarity={-1} />);
        expect(colorOf("-4")).toBe(STAT_NEGATIVE);
    });

    it("stays black with no polarity", () => {
        render(<Component label="defence" value={4} />);
        expect(colorOf("4")).toBe("black");
    });
});
