import React, { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

interface DialogProps {
    children: React.ReactNode;
}

export const DIALOG_ROOT_ID = "dialog-root";

// Resolve the dedicated portal node declared in index.html, recreating it if it
// is absent. The previous implementation targeted a `#app` node that no page
// ever rendered and returned null when it was missing, which silently swallowed
// every confirm dialog in the app — the save and delete-save flows both became
// no-ops with no error. A dialog must never fail to render because its mount
// point is missing, so we self-heal instead of bailing out.
function getDialogRoot(): HTMLElement {
    const existing = document.getElementById(DIALOG_ROOT_ID);
    if (existing) return existing;

    const created = document.createElement("div");
    created.id = DIALOG_ROOT_ID;
    document.body.appendChild(created);
    return created;
}

const Dialog: React.FC<DialogProps> = ({ children }) => {
    // One container per Dialog instance, so concurrently mounted dialogs don't
    // clobber each other inside the shared portal root.
    const el = useMemo(() => document.createElement("div"), []);

    useEffect(() => {
        getDialogRoot().appendChild(el);
        return () => {
            el.remove();
        };
    }, [el]);

    return createPortal(children, el);
};

export default Dialog;
