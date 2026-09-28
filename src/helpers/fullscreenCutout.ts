// Android Chrome launches an installed (display: fullscreen) web app
// letterboxed away from the camera cutout: a black bar sits where the camera
// is, and the page only extends under it (viewport-fit=cover) after a window
// relayout such as leaving and returning to the app. Entering fullscreen
// forces that relayout, so the installed app does it on the first tap
// (requestFullscreen needs a user gesture). Android only; plain browser tabs
// and other platforms' installed apps are left alone.

const INSTALLED = "(display-mode: fullscreen), (display-mode: standalone)";

export function enterFullscreenOnFirstTap(
    doc: Document = document,
    userAgent: string = navigator.userAgent
): void {
    if (!/Android/i.test(userAgent)) return;
    if (!window.matchMedia?.(INSTALLED).matches) return;
    const root = doc.documentElement;
    if (!root.requestFullscreen) return;

    doc.addEventListener(
        "pointerdown",
        () => {
            if (doc.fullscreenElement) return;
            // Rejected (unsupported / denied) just leaves the letterbox as is.
            root.requestFullscreen({ navigationUI: "hide" }).catch(() => {});
        },
        { once: true, capture: true }
    );
}
