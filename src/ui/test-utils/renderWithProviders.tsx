import React, { type ReactElement, type ReactNode } from "react";
import { render, type RenderOptions, type RenderResult } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore, type Store } from "@reduxjs/toolkit";
import { DndProvider } from "react-dnd";
import { TestBackend } from "react-dnd-test-backend";
import { gameReducer, type GameState } from "@store/gameReducer";
import type { RootState } from "@store";

// Shared React Testing Library harness for the UI component tests. The app wires
// two providers around the React tree (Redux store, react-dnd backend); this
// helper assembles the same shape with test-friendly doubles:
//   - a real Redux store built from the production `gameReducer`, optionally
//     seeded with a partial preloaded `game` slice, and
//   - react-dnd's `TestBackend` for deterministic, headless drag-and-drop.
// It is test-only and changes no production behaviour.

export function makeTestStore(preloadedGame?: Partial<GameState>): Store<RootState> {
    const base = gameReducer(undefined, { type: "@@INIT" });
    return configureStore({
        reducer: { game: gameReducer },
        preloadedState: preloadedGame ? { game: { ...base, ...preloadedGame } } : undefined,
    }) as unknown as Store<RootState>;
}

export interface ProviderOptions extends Omit<RenderOptions, "wrapper"> {
    preloadedGame?: Partial<GameState>;
    store?: Store<RootState>;
}

export interface RenderWithProvidersResult extends RenderResult {
    store: Store<RootState>;
}

export function renderWithProviders(
    ui: ReactElement,
    { preloadedGame, store = makeTestStore(preloadedGame), ...renderOptions }: ProviderOptions = {}
): RenderWithProvidersResult {
    const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
        <Provider store={store}>
            <DndProvider backend={TestBackend}>{children}</DndProvider>
        </Provider>
    );

    return {
        store,
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    };
}
