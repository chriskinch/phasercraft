import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";

// `@components/X` maps to one of five atomic-design directories (see
// tsconfig.json "paths"). A plain Vite string alias can only point at a single
// directory, so resolve it here by probing each directory in the same
// precedence order the tsconfig declares. Mirrors vitest.config.ts so the app
// build, typecheck, and tests all resolve component imports identically.
const COMPONENT_DIRS = ["protons", "atoms", "molecules", "organisms", "templates"].map((dir) =>
    path.resolve(__dirname, "./src/ui/components", dir)
);

function componentsAliasPlugin() {
    return {
        name: "phasercraft-components-alias",
        enforce: "pre" as const,
        resolveId(source: string) {
            if (!source.startsWith("@components/")) return null;
            const subpath = source.slice("@components/".length);
            for (const dir of COMPONENT_DIRS) {
                for (const ext of [".tsx", ".ts", ".jsx", ".js", "/index.tsx", "/index.ts"]) {
                    const candidate = path.join(dir, subpath + ext);
                    if (fs.existsSync(candidate)) return candidate;
                }
            }
            return null;
        },
    };
}

export default defineConfig(() => ({
    plugins: [componentsAliasPlugin(), react()],
    // GitHub Pages serves the app under /phasercraft/ during the Vercel
    // transition (set via VITE_BASE_URL in the Pages workflow); Vercel and local
    // dev serve from the root.
    base: process.env.VITE_BASE_URL || "/",
    publicDir: "public",
    build: {
        // Keep the historical output directory so the Pages/Playwright tooling
        // that serves `dist/` is unchanged.
        outDir: "dist",
        emptyOutDir: true,
    },
    server: {
        port: 8080,
    },
    resolve: {
        alias: [
            // Phaser's package "main" is its raw src build, which pulls in the
            // dev-only phaser3spectorjs package. Use the bundled dist (exact
            // match so "phaser/<subpath>" imports are left alone).
            {
                find: /^phaser$/,
                replacement: path.resolve(__dirname, "./node_modules/phaser/dist/phaser.esm.js"),
            },
            { find: "@store", replacement: path.resolve(__dirname, "./src/store") },
            { find: "@ui", replacement: path.resolve(__dirname, "./src/ui") },
            { find: "@helpers", replacement: path.resolve(__dirname, "./src/helpers") },
            { find: "@scenes", replacement: path.resolve(__dirname, "./src/scenes") },
            { find: "@entities", replacement: path.resolve(__dirname, "./src/entities") },
            { find: "@services", replacement: path.resolve(__dirname, "./src/services") },
            { find: "@config", replacement: path.resolve(__dirname, "./src/config") },
            { find: "@", replacement: path.resolve(__dirname, "./src") },
        ],
    },
}));
