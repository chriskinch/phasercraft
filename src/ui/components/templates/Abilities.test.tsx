import { describe, it, expect } from "vitest";
import { act, fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import Abilities from "@components/Abilities";
import { setCurrentArea } from "@store/gameReducer";
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
        const change = screen.getByRole("button", { name: "Change" });
        expect(change).toBeDisabled();
        fireEvent.click(change);
        expect(screen.queryByTestId("ability-picker")).not.toBeInTheDocument();
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

describe("Abilities picker", () => {
    // Mage with Fireball (slot 1), Frostbolt (slot 2), Mana Shield (slot 4)
    // slotted; Earth Shield learned but unslotted.
    const withSpare = (overrides: Partial<GameState> = {}) =>
        mage({
            learnedSpells: { Fireball: 2, Frostbolt: 1, ManaShield: 3, EarthShield: 1 },
            ...overrides,
        });
    const tile = (name: string) => screen.getByRole("button", { name: new RegExp(`^${name}`) });
    const open = (n: number) => {
        fireEvent.click(slot(n));
        fireEvent.click(screen.getByRole("button", { name: /^(Change|Choose)$/ }));
    };

    it("Change opens the picker for the slot; Back returns", () => {
        renderWithProviders(<Abilities />, { preloadedGame: withSpare() });

        open(2);
        expect(screen.getByText("Choose for slot 2")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /^Slot \d:/ })).not.toBeInTheDocument();
        // The slot's current spell is preselected.
        expect(tile("Frostbolt")).toHaveAttribute("aria-pressed", "true");
        expect(card()).toHaveTextContent("Equipped in slot 2");

        fireEvent.click(screen.getByRole("button", { name: "Back" }));
        expect(screen.queryByTestId("ability-picker")).not.toBeInTheDocument();
        expect(slot(2)).toHaveAttribute("aria-pressed", "true");
    });

    it("lists learned, on-class spells: equipped first in slot order, then by name", () => {
        renderWithProviders(<Abilities />, {
            preloadedGame: withSpare({
                // An off-class (Warrior) spell is not offered.
                learnedSpells: {
                    Fireball: 2,
                    Frostbolt: 1,
                    ManaShield: 3,
                    Invocation: 1,
                    EarthShield: 1,
                    Whirlwind: 1,
                },
            }),
        });

        open(1);
        const names = within(screen.getByRole("group"))
            .getAllByRole("button")
            .map((b) => b.getAttribute("aria-label"));
        expect(names).toEqual([
            "Fireball, in slot 1",
            "Frostbolt, in slot 2",
            "Mana Shield, in slot 4",
            "Earth Shield, new",
            "Invocation, new",
        ]);
    });

    it("equips into an empty slot", () => {
        const { store } = renderWithProviders(<Abilities />, { preloadedGame: withSpare() });

        open(3);
        expect(screen.getByText("Choose for slot 3")).toBeInTheDocument();
        expect(card()).toHaveTextContent("Tap an ability to see it.");
        expect(screen.getByRole("button", { name: "Equip" })).toBeDisabled();
        fireEvent.click(tile("Earth Shield"));
        expect(within(card()).getByRole("heading", { name: "Earth Shield" })).toBeInTheDocument();
        expect(card()).not.toHaveTextContent("Equipped in slot");
        fireEvent.click(screen.getByRole("button", { name: "Equip" }));

        expect(store.getState().game.abilityLoadout).toEqual([
            "Fireball",
            "Frostbolt",
            "EarthShield",
            "ManaShield",
            null,
        ]);
        expect(screen.queryByTestId("ability-picker")).not.toBeInTheDocument();
        expect(slot(3)).toHaveAccessibleName("Slot 3: Earth Shield");
        expect(slot(3)).toHaveAttribute("aria-pressed", "true");
    });

    it("Swap trades places with the spell's other slot", () => {
        const { store } = renderWithProviders(<Abilities />, { preloadedGame: withSpare() });

        open(1);
        fireEvent.click(tile("Mana Shield"));
        expect(card()).toHaveTextContent("Equipped in slot 4");
        expect(screen.queryByRole("button", { name: "Equip" })).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Swap" }));

        expect(store.getState().game.abilityLoadout).toEqual([
            "ManaShield",
            "Frostbolt",
            null,
            "Fireball",
            null,
        ]);
    });

    it("Equip is disabled for the spell already in this slot", () => {
        renderWithProviders(<Abilities />, { preloadedGame: withSpare() });

        open(1);
        expect(tile("Fireball")).toHaveAttribute("aria-pressed", "true");
        expect(screen.getByRole("button", { name: "Equip" })).toBeDisabled();
    });

    it("the New pill clears once tapped", () => {
        renderWithProviders(<Abilities />, { preloadedGame: withSpare() });

        open(3);
        expect(tile("Earth Shield")).toHaveAccessibleName("Earth Shield, new");
        expect(tile("Earth Shield")).toHaveTextContent("New");
        // Slotted spells are not new.
        expect(tile("Fireball")).not.toHaveTextContent("New");

        fireEvent.click(tile("Earth Shield"));
        expect(tile("Earth Shield")).toHaveAccessibleName("Earth Shield");
        expect(tile("Earth Shield")).not.toHaveTextContent("New");

        // Stays cleared after Back and reopening.
        fireEvent.click(screen.getByRole("button", { name: "Back" }));
        open(3);
        expect(tile("Earth Shield")).not.toHaveTextContent("New");
    });

    it("marks spells already slotted with their slot number", () => {
        renderWithProviders(<Abilities />, { preloadedGame: withSpare() });

        open(3);
        expect(tile("Mana Shield")).toHaveTextContent("4");
        expect(tile("Mana Shield")).toHaveAccessibleName("Mana Shield, in slot 4");
    });

    it("shows the empty state when no abilities are learned", () => {
        renderWithProviders(<Abilities />, {
            preloadedGame: mage({
                learnedSpells: {},
                abilityLoadout: [null, null, null, null, null],
            }),
        });

        open(1);
        expect(screen.getByText("Read scrolls to learn new abilities.")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Equip" })).toBeDisabled();
    });

    it("town-only: leaving town with the picker open disables Equip", () => {
        const { store } = renderWithProviders(<Abilities />, { preloadedGame: withSpare() });

        open(3);
        fireEvent.click(tile("Earth Shield"));
        act(() => {
            store.dispatch(setCurrentArea("forest"));
        });

        expect(screen.getByText("Change in town")).toBeInTheDocument();
        const equip = screen.getByRole("button", { name: "Equip" });
        expect(equip).toBeDisabled();
        fireEvent.click(equip);
        expect(store.getState().game.abilityLoadout[2]).toBeNull();
        expect(screen.getByRole("button", { name: "Back" })).toBeEnabled();
    });
});
