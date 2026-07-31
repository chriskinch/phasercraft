import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Alchemist from "@components/Alchemist";

describe("Alchemist template", () => {
    it("renders its heading (skeleton shop)", () => {
        render(<Alchemist />);
        expect(screen.getByRole("heading", { name: "Alchemist" })).toBeTruthy();
    });
});
