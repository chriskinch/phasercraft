import React, { useEffect } from "react";
import styles from "./Toast.module.css";

export const TOAST_MS = 2500;

interface ToastProps {
    message: string;
    // Called once the toast has been up for TOAST_MS; the parent clears it.
    onDone: () => void;
}

// Short-lived status card (same white card language as the tooltips), pinned to
// the top of a positioned parent. Never takes clicks. A new message restarts the
// timer, so the parent should key it by message instance.
const Toast: React.FC<ToastProps> = ({ message, onDone }) => {
    useEffect(() => {
        const timer = setTimeout(onDone, TOAST_MS);
        return () => clearTimeout(timer);
    }, [onDone]);

    return (
        <div className={styles.toast} role="status">
            {message}
        </div>
    );
};

export default Toast;
