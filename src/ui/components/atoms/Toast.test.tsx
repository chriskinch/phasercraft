import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import Toast, { TOAST_MS } from "./Toast";

afterEach(() => {
    vi.useRealTimers();
});

describe("Toast", () => {
    it("shows the message as a status and calls onDone after TOAST_MS", () => {
        vi.useFakeTimers();
        const onDone = vi.fn();
        render(<Toast message="Learned Heal (L1)" onDone={onDone} />);

        expect(screen.getByRole("status")).toHaveTextContent("Learned Heal (L1)");
        act(() => vi.advanceTimersByTime(TOAST_MS - 1));
        expect(onDone).not.toHaveBeenCalled();
        act(() => vi.advanceTimersByTime(1));
        expect(onDone).toHaveBeenCalledTimes(1);
    });

    it("clears its timer on unmount", () => {
        vi.useFakeTimers();
        const onDone = vi.fn();
        const { unmount } = render(<Toast message="x" onDone={onDone} />);
        unmount();
        act(() => vi.advanceTimersByTime(TOAST_MS));
        expect(onDone).not.toHaveBeenCalled();
    });
});
