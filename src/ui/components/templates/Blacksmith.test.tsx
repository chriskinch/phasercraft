import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Blacksmith from "@components/Blacksmith";

describe("Blacksmith template", () => {
    it("renders its heading (skeleton shop)", () => {
        render(<Blacksmith />);
        expect(screen.getByRole("heading", { name: "Blacksmith" })).toBeTruthy();
    });
});
