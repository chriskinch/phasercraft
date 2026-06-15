import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { GraphQLError } from "graphql";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import { GET_ITEMS } from "@queries/getItems";
import Armory from "@components/Armory";

// Armory drives its UI off the GET_ITEMS Apollo query. This covers the two
// states that exist today: the in-flight (loading) render and the GraphQL error
// render. The "merchant unavailable" state (no endpoint configured) is a Phase 5
// deliverable that is not implemented yet, so it is intentionally not tested here.
describe("Armory template", () => {
    it("renders the loading state while GET_ITEMS is in flight", () => {
        // No matching mock result resolves synchronously, so the query stays loading.
        renderWithProviders(<Armory />, {
            mocks: [{ request: { query: GET_ITEMS }, delay: Infinity }],
            preloadedGame: { coins: 100, filters: [] },
        });

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("renders the error state when GET_ITEMS fails", async () => {
        renderWithProviders(<Armory />, {
            mocks: [
                {
                    request: { query: GET_ITEMS },
                    result: { errors: [new GraphQLError("merchant exploded")] },
                },
            ],
            preloadedGame: { coins: 100, filters: [] },
        });

        await waitFor(() => expect(screen.getByText(/^ERROR:/)).toBeInTheDocument());
        expect(screen.getByText(/merchant exploded/)).toBeInTheDocument();
    });

    it("surfaces a network error through the error branch", async () => {
        renderWithProviders(<Armory />, {
            mocks: [
                {
                    request: { query: GET_ITEMS },
                    error: new Error("network down"),
                },
            ],
            preloadedGame: { coins: 100, filters: [] },
        });

        await waitFor(() => expect(screen.getByText(/ERROR:/)).toBeInTheDocument());
    });
});
