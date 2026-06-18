/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** GraphQL gateway URL (was NEXT_PUBLIC_GRAPHQL_URL before the Vite migration). */
    readonly VITE_GRAPHQL_URL?: string;
    /** Public base path for the build (empty for Vercel, "/phasercraft/" for GitHub Pages). */
    readonly VITE_BASE_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
