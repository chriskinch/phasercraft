import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import fs from "node:fs";
import path from "node:path";
import Dialog, { DIALOG_ROOT_ID } from "@components/Dialog";

// Regression cover for a silent-failure bug: Dialog used to portal into a `#app`
// node that no page ever rendered, and returned null when it was missing. Every
// confirm dialog in the app (save, delete-save) therefore rendered nothing at
// all, with no error. These tests deliberately start from a document with *no*
// mount point — the previous implementation passes only if a test fabricates the
// node for it, which is exactly how the bug slipped through.

afterEach(() => {
    cleanup();
    document.getElementById(DIALOG_ROOT_ID)?.remove();
});

describe("Dialog", () => {
    it("renders its children when no portal root exists yet", () => {
        expect(document.getElementById(DIALOG_ROOT_ID)).toBeNull();

        render(<Dialog>confirm me</Dialog>);

        expect(screen.getByText("confirm me")).toBeInTheDocument();
    });

    it("creates the portal root on demand and renders into it", () => {
        render(<Dialog>confirm me</Dialog>);

        const root = document.getElementById(DIALOG_ROOT_ID);
        expect(root).not.toBeNull();
        expect(root).toContainElement(screen.getByText("confirm me"));
    });

    it("reuses an existing portal root rather than creating a second one", () => {
        const existing = document.createElement("div");
        existing.id = DIALOG_ROOT_ID;
        document.body.appendChild(existing);

        render(<Dialog>confirm me</Dialog>);

        expect(document.querySelectorAll(`#${DIALOG_ROOT_ID}`)).toHaveLength(1);
        expect(existing).toContainElement(screen.getByText("confirm me"));
    });

    it("keeps concurrently mounted dialogs in their own containers", () => {
        render(
            <>
                <Dialog>first</Dialog>
                <Dialog>second</Dialog>
            </>
        );

        const root = document.getElementById(DIALOG_ROOT_ID)!;
        expect(root.children).toHaveLength(2);
        expect(screen.getByText("first")).toBeInTheDocument();
        expect(screen.getByText("second")).toBeInTheDocument();
    });

    it("removes its container from the portal root on unmount", () => {
        const { unmount } = render(<Dialog>confirm me</Dialog>);
        const root = document.getElementById(DIALOG_ROOT_ID)!;
        expect(root.children).toHaveLength(1);

        unmount();

        expect(root.children).toHaveLength(0);
        expect(screen.queryByText("confirm me")).not.toBeInTheDocument();
    });

    // Dialog self-heals a missing root, but the node belongs in the served HTML
    // so its stacking context is a declared sibling of #root rather than an
    // append-on-first-dialog accident. Pin that contract: this assertion is what
    // catches the id drifting apart again.
    it("has its portal root declared in index.html", () => {
        const html = fs.readFileSync(path.resolve(__dirname, "../../../../index.html"), "utf8");

        expect(html).toContain(`id="${DIALOG_ROOT_ID}"`);
    });
});
