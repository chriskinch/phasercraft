import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AbilityCard, { LEVEL_COLORS } from "@components/AbilityCard";

const card = () => screen.getByTestId("ability-card");

describe("AbilityCard", () => {
    it("borders the card in the level colour", () => {
        const { rerender } = render(<AbilityCard spell="Fireball" level={1} resourceType="mana" />);
        expect(card().style.getPropertyValue("--level-color")).toBe(LEVEL_COLORS[1]);
        rerender(<AbilityCard spell="Fireball" level={2} resourceType="mana" />);
        expect(card().style.getPropertyValue("--level-color")).toBe("#00dd00");
        rerender(<AbilityCard spell="Fireball" level={3} resourceType="mana" />);
        expect(card().style.getPropertyValue("--level-color")).toBe("#0077ff");
    });

    it("shows the optional note line only when given", () => {
        const { rerender } = render(<AbilityCard spell="Fireball" level={1} resourceType="mana" />);
        expect(card()).not.toHaveTextContent("Equipped in slot");
        rerender(
            <AbilityCard spell="Fireball" level={1} resourceType="mana" note="Equipped in slot 2" />
        );
        expect(screen.getByText("Equipped in slot 2")).toBeInTheDocument();
    });

    it("shows name, level line, description, effect and stat rows", () => {
        render(<AbilityCard spell="Whirlwind" level={1} resourceType="rage" />);
        expect(screen.getByRole("heading", { name: "Whirlwind" })).toBeInTheDocument();
        expect(card()).toHaveTextContent("Level 1 · Warrior");
        expect(screen.getByText("Spin into the fray.")).toBeInTheDocument();
        expect(screen.getByText("Strikes several nearby enemies.")).toBeInTheDocument();
        // Cost in the player's resource; no cast range and not self-cast → dash.
        expect(card()).toHaveTextContent("Cost50 rage");
        expect(card()).toHaveTextContent("Cooldown2s");
        expect(card()).toHaveTextContent("Range—");
        expect(card()).toHaveTextContent("Next: L2 · 135% power");
    });

    it("lists every scaled aspect in the next-level preview", () => {
        render(<AbilityCard spell="SnareTrap" level={2} resourceType="energy" />);
        expect(card()).toHaveTextContent("Next: L3 · 180% duration, 180% damage");
    });

    it("hides the next-level preview at L3", () => {
        render(<AbilityCard spell="Heal" level={3} resourceType="mana" />);
        expect(card()).not.toHaveTextContent("Next:");
    });

    it("renders the empty text without a spell", () => {
        render(<AbilityCard spell={null} level={1} resourceType="mana" emptyText="Nothing here" />);
        expect(card()).toHaveTextContent("Nothing here");
        expect(screen.queryByRole("heading")).toBeNull();
    });
});
