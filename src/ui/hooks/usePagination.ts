import { useCallback, useEffect, useRef, useState } from "react";

// Presentation-only pagination primitive shared by the inventory grids (gear +
// components). `usePagination` is pure list-slicing logic with page-index
// clamping; `useMeasuredPageSize` derives a responsive page size from a
// container's measured size so pages fill with real items (no placeholder cells).

export interface Pagination<T> {
    // 0-based current page, always clamped into [0, pageCount - 1].
    page: number;
    // Total number of pages, always >= 1 (an empty list is a single empty page).
    pageCount: number;
    // The items belonging to the current page.
    pageItems: T[];
    hasPrev: boolean;
    hasNext: boolean;
    next: () => void;
    prev: () => void;
    setPage: (page: number) => void;
}

export function usePagination<T>(items: T[], pageSize: number): Pagination<T> {
    // A page must hold at least one item; guard against 0/NaN/negative sizes.
    const size = Math.max(1, Math.floor(pageSize) || 1);
    const pageCount = Math.max(1, Math.ceil(items.length / size));

    const [requestedPage, setRequestedPage] = useState(0);

    // Clamp on read: when the list length or page size shrinks, a previously
    // valid page index can fall past the end. Deriving the effective page from the
    // requested one (rather than mutating state in an effect) means a shrinking
    // list/viewport can never strand the view out of range (R2), with no extra
    // render and no set-state-in-effect.
    const page = Math.min(Math.max(0, requestedPage), pageCount - 1);

    const setPage = useCallback((next: number) => {
        setRequestedPage(Math.max(0, Math.floor(next)));
    }, []);
    const next = useCallback(() => setRequestedPage(page + 1), [page]);
    const prev = useCallback(() => setRequestedPage(page - 1), [page]);

    const start = page * size;
    const pageItems = items.slice(start, start + size);

    return {
        page,
        pageCount,
        pageItems,
        hasPrev: page > 0,
        hasNext: page < pageCount - 1,
        next,
        prev,
        setPage,
    };
}

export interface MeasuredPageSize {
    // Attach to the container whose available space determines the page size.
    ref: React.RefObject<HTMLDivElement | null>;
    // How many whole cells fit in the measured container; >= 1 (cols * rows).
    pageSize: number;
    // The measured grid dimensions, exposed so a consumer can lay its grid out
    // with the same column count the page size was derived from.
    cols: number;
    rows: number;
}

interface GridDims {
    pageSize: number;
    cols: number;
    rows: number;
}

// Derives how many cells of `cellWidth` × `cellHeight` (with `gap` between them)
// fit inside the referenced container, updating live on resize. Until the first
// measurement — and in environments without ResizeObserver — it reports
// `fallback` cells in a single column, so a page always has a sensible size.
export function useMeasuredPageSize(
    cellWidth: number,
    cellHeight: number,
    gap = 0,
    fallback = 1
): MeasuredPageSize {
    const ref = useRef<HTMLDivElement | null>(null);
    const [dims, setDims] = useState<GridDims>(() => ({
        pageSize: Math.max(1, fallback),
        cols: 1,
        rows: Math.max(1, fallback),
    }));

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof ResizeObserver === "undefined") return;

        const measure = () => {
            const { width, height } = el.getBoundingClientRect();
            // (n cells + (n-1) gaps) fit when width >= n*cell + (n-1)*gap, i.e.
            // n <= (width + gap) / (cell + gap).
            const cols = Math.max(1, Math.floor((width + gap) / (cellWidth + gap)));
            const rows = Math.max(1, Math.floor((height + gap) / (cellHeight + gap)));
            setDims({ pageSize: cols * rows, cols, rows });
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, [cellWidth, cellHeight, gap]);

    return { ref, ...dims };
}
