import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePagination } from "./usePagination";

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

describe("usePagination", () => {
    it("slices the list into pages of the given size", () => {
        const { result } = renderHook(() => usePagination(range(10), 4));
        expect(result.current.pageCount).toBe(3);
        expect(result.current.page).toBe(0);
        expect(result.current.pageItems).toEqual([0, 1, 2, 3]);
    });

    it("reports a single empty page for an empty list", () => {
        const { result } = renderHook(() => usePagination([], 4));
        expect(result.current.pageCount).toBe(1);
        expect(result.current.pageItems).toEqual([]);
        expect(result.current.hasPrev).toBe(false);
        expect(result.current.hasNext).toBe(false);
    });

    it("next/prev move between pages and stop at the bounds", () => {
        const { result } = renderHook(() => usePagination(range(10), 4));

        expect(result.current.hasPrev).toBe(false);
        act(() => result.current.prev());
        expect(result.current.page).toBe(0); // clamped at the lower bound

        act(() => result.current.next());
        expect(result.current.page).toBe(1);
        expect(result.current.pageItems).toEqual([4, 5, 6, 7]);

        act(() => result.current.next());
        expect(result.current.page).toBe(2);
        expect(result.current.pageItems).toEqual([8, 9]);
        expect(result.current.hasNext).toBe(false);

        act(() => result.current.next());
        expect(result.current.page).toBe(2); // clamped at the upper bound
    });

    it("setPage jumps to a clamped page index", () => {
        const { result } = renderHook(() => usePagination(range(10), 4));
        act(() => result.current.setPage(99));
        expect(result.current.page).toBe(2);
        act(() => result.current.setPage(-5));
        expect(result.current.page).toBe(0);
    });

    it("clamps the current page when the list shrinks (never strands the view)", () => {
        const { result, rerender } = renderHook(
            ({ items }: { items: number[] }) => usePagination(items, 4),
            { initialProps: { items: range(10) } }
        );

        act(() => result.current.setPage(2));
        expect(result.current.page).toBe(2);

        // List shrinks to a single page — the view must fall back into range.
        rerender({ items: range(3) });
        expect(result.current.pageCount).toBe(1);
        expect(result.current.page).toBe(0);
        expect(result.current.pageItems).toEqual([0, 1, 2]);
    });

    it("re-slices and clamps when the page size changes", () => {
        const { result, rerender } = renderHook(
            ({ size }: { size: number }) => usePagination(range(10), size),
            { initialProps: { size: 2 } }
        );

        act(() => result.current.setPage(4)); // last page with size 2
        expect(result.current.page).toBe(4);
        expect(result.current.pageItems).toEqual([8, 9]);

        // Bigger pages → fewer pages → the page index is clamped down.
        rerender({ size: 5 });
        expect(result.current.pageCount).toBe(2);
        expect(result.current.page).toBe(1);
        expect(result.current.pageItems).toEqual([5, 6, 7, 8, 9]);
    });

    it("treats a non-positive page size as 1", () => {
        const { result } = renderHook(() => usePagination(range(3), 0));
        expect(result.current.pageCount).toBe(3);
        expect(result.current.pageItems).toEqual([0]);
    });
});
