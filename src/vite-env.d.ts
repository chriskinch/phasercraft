/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** Vercel Functions base URL for the Armory REST API. */
    readonly VITE_ARMORY_URL?: string;
    /** Public base path for the build (empty for Vercel, "/phasercraft/" for GitHub Pages). */
    readonly VITE_BASE_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
