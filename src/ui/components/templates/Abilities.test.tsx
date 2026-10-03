import { describe, it, expect } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import Abilities from "@components/Abilities";
import type { GameState } from "@store/gameReducer";
import type { PlayerStats } from "@/types/game";

const mage = (overrides: Partial<GameState> = {}): Partial<GameState> => ({
    character: "Mage",
    currentArea: "town",
    stats: { resource_type: "Mana" } as PlayerStats,
    learnedSpells: { Fireball: 2, Frostbolt: 1, ManaShield: 3 },
    abilityLoadout: ["Fireball", "Frostbolt", null, "ManaShield", null],
    ...overrides,
});

const slot = (n: number) => screen.getByRole("button", { name: new RegExp(`^Slot ${n}:`) });
const card = () => screen.getByTestId("ability-card");

describe("Abilities template", () => {
    it("renders the loadout: 5 active slots in HUD order, icons or +", () => {
        const { container } = renderWithProviders(<Abilities />, { preloadedGame: mage() });

        expect(screen.getAllByRole("button", { name: /^Slot \d:/ })).toHaveLength(5);
        expect(slot(1)).toHaveAccessibleName("Slot 1: Fireball");
        expect(slot(2)).toHaveAccessibleName("Slot 2: Frostbolt");
        expect(slot(3)).toHaveAccessibleName("Slot 3: empty");
        expect(slot(4)).toHaveAccessibleName("Slot 4: Mana Shield");
        expect(slot(3)).toHaveTextContent("+");
        expect(slot(1).querySelector("[data-icon]")).toHaveAttribute(
            "data-icon",
            "icon_0017_fire-ball"
        );
        // Bare icons only: no white loot face.
        expect(container.querySelector(`img[alt="Loot!"]`)).toBeNull();
    });

    it("shows 5 locked, untappable passive slots", () => {
        renderWithProviders(<Abilities />, { preloadedGame: mage() });

        const locked = screen.getAllByTestId("locked-slot");
        expect(locked).toHaveLength(5);
        locked.forEach((l) => {
            expect(l.tagName).not.toBe("BUTTON");
            expect(within(l).getByRole("img", { name: "Locked" })).toBeInTheDocument();
        });
        expect(screen.getByText("Passive · coming soon")).toBeInTheDocument();
    });

    it("selects slot 1 by default and shows its card", () => {
        renderWithProviders(<Abilities />, { preloadedGame: mage() });

        expect(slot(1)).toHaveAttribute("aria-pressed", "true");
        expect(within(card()).getByRole("heading", { name: "Fireball" })).toBeInTheDocument();
        expect(card()).toHaveTextContent("Level 2 · Mage, Occultist");
        expect(card()).toHaveTextContent("Cost50 mana");
        expect(card()).toHaveTextContent("Cooldown1s");
        expect(card()).toHaveTextContent("Range250");
        expect(card()).toHaveTextContent("Next: L3 · 180% power");
    });

    it("selecting a slot shows its ability card", () => {
        renderWithProviders(<Abilities />, { preloadedGame: mage() });

        fireEvent.click(slot(4));
        expect(slot(4)).toHaveAttribute("aria-pressed", "true");
        expect(slot(1)).toHaveAttribute("aria-pressed", "false");
        expect(within(card()).getByRole("heading", { name: "Mana Shield" })).toBeInTheDocument();
        expect(card()).toHaveTextContent("Level 3 · Mage");
        expect(card()).toHaveTextContent("RangeSelf");
        // Max level: no next-level preview.
        expect(card()).not.toHaveTextContent("Next:");
    });

    it("an empty slot shows the empty card and Choose", () => {
        renderWithProviders(<Abilities />, { preloadedGame: mage() });

        fireEvent.click(slot(3));
        expect(card()).toHaveTextContent("Tap a slot to see its ability.");
        expect(screen.getByRole("button", { name: "Choose" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Remove" })).toBeDisabled();
    });

    it("Remove empties the selected slot", () => {
        const { store } = renderWithProviders(<Abilities />, { preloadedGame: mage() });

        fireEvent.click(slot(2));
        fireEvent.click(screen.getByRole("button", { name: "Remove" }));

        expect(store.getState().game.abilityLoadout).toEqual([
            "Fireball",
            null,
            null,
            "ManaShield",
            null,
        ]);
        expect(slot(2)).toHaveAccessibleName("Slot 2: empty");
        expect(screen.getByRole("button", { name: "Choose" })).toBeInTheDocument();
    });

    it("in a dungeon: shows the town note and disables Change/Remove; the card still works", () => {
        const { store } = renderWithProviders(<Abilities />, {
            preloadedGame: mage({ currentArea: "forest" }),
        });

        expect(screen.getByText("Change in town")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Change" })).toBeDisabled();
        const remove = screen.getByRole("button", { name: "Remove" });
        expect(remove).toBeDisabled();
        fireEvent.click(remove);
        expect(store.getState().game.abilityLoadout[0]).toBe("Fireball");

        fireEvent.click(slot(2));
        expect(within(card()).getByRole("heading", { name: "Frostbolt" })).toBeInTheDocument();
    });

    it("shows the cost in the player's resource", () => {
        renderWithProviders(<Abilities />, {
            preloadedGame: mage({
                character: "Warrior",
                stats: { resource_type: "Rage" } as PlayerStats,
                learnedSpells: { Whirlwind: 1 },
                abilityLoadout: ["Whirlwind", null, null, null, null],
            }),
        });
        expect(card()).toHaveTextContent("Cost50 rage");
    });

    it("has no town note in town", () => {
        renderWithProviders(<Abilities />, { preloadedGame: mage() });
        expect(screen.queryByText("Change in town")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Remove" })).toBeEnabled();
    });
});
