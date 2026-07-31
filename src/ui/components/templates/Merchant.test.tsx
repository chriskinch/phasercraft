import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Merchant from "@components/Merchant";

describe("Merchant template", () => {
    it("renders its heading (skeleton shop)", () => {
        render(<Merchant />);
        expect(screen.getByRole("heading", { name: "Merchant" })).toBeTruthy();
    });
});
