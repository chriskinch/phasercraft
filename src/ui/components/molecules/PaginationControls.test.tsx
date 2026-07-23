import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import PaginationControls from "./PaginationControls";

const noop = () => {};

describe("PaginationControls", () => {
    it("renders nothing for a single page", () => {
        const { container } = render(
            <PaginationControls
                page={0}
                pageCount={1}
                hasPrev={false}
                hasNext={false}
                onPrev={noop}
                onNext={noop}
            />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it("shows a 1-based page indicator", () => {
        render(
            <PaginationControls
                page={2}
                pageCount={5}
                hasPrev
                hasNext
                onPrev={noop}
                onNext={noop}
            />
        );
        expect(screen.getByText("Page 3 of 5")).toBeInTheDocument();
    });

    it("disables Prev on the first page and Next on the last", () => {
        const { rerender } = render(
            <PaginationControls
                page={0}
                pageCount={3}
                hasPrev={false}
                hasNext
                onPrev={noop}
                onNext={noop}
            />
        );
        const [prev, next] = screen.getAllByRole("button");
        expect(prev).toBeDisabled();
        expect(next).toBeEnabled();

        rerender(
            <PaginationControls
                page={2}
                pageCount={3}
                hasPrev
                hasNext={false}
                onPrev={noop}
                onNext={noop}
            />
        );
        const [prev2, next2] = screen.getAllByRole("button");
        expect(prev2).toBeEnabled();
        expect(next2).toBeDisabled();
    });

    it("fires onPrev/onNext when the buttons are clicked", () => {
        const onPrev = vi.fn();
        const onNext = vi.fn();
        render(
            <PaginationControls
                page={1}
                pageCount={3}
                hasPrev
                hasNext
                onPrev={onPrev}
                onNext={onNext}
            />
        );
        const [prev, next] = screen.getAllByRole("button");
        fireEvent.click(prev);
        fireEvent.click(next);
        expect(onPrev).toHaveBeenCalledTimes(1);
        expect(onNext).toHaveBeenCalledTimes(1);
    });
});
