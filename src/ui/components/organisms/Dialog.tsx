import React, { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

interface DialogProps {
    children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ children }) => {
    const el = useMemo(() => document.createElement("div"), []);

    useEffect(() => {
        const root = document.querySelector("#app");
        if (!root) return;
        root.appendChild(el);
        return () => {
            root.removeChild(el);
        };
    }, [el]);

    const root = document.querySelector("#app");
    return root ? createPortal(children, el) : null;
};

export default Dialog;
