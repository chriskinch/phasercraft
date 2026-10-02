/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** Armory REST API base URL (e.g. "/api/armory"); unset → merchant unavailable. */
    readonly VITE_ARMORY_URL?: string;
    /** Public base path for the build (empty for Vercel, "/phasercraft/" for GitHub Pages). */
    readonly VITE_BASE_URL?: string;
    /** "1" builds the perf harness (`window.__perf`, #526) into the bundle. */
    readonly VITE_PERF?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
