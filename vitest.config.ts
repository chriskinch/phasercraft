import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";

// `@components/X` maps to one of five atomic-design directories in tsconfig.json
// ("paths"). A plain Vite string alias can only point at a single directory, so
// resolve it here by probing each directory in the same precedence order the
// tsconfig declares. Test-only: mirrors the existing build/typecheck resolution
// so component tests can import siblings exactly as the components do.
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

export default defineConfig({
    // @vitejs/plugin-react owns the JSX transform for tests. tsconfig.json sets
    // `jsx: "preserve"` for Next's own compiler, which Vite's default transformer
    // can't parse; the React plugin uses the automatic runtime regardless.
    plugins: [componentsAliasPlugin(), react()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./vitest.setup.ts"],
        include: ["src/**/*.{test,spec}.{ts,tsx}"],
        exclude: ["node_modules", "dist", ".next", "server", "services"],
        css: false,
    },
    resolve: {
        alias: [
            // Phaser's package "main" is its raw src build, which requires the
            // dev-only phaser3spectorjs package. Use the bundled dist (what the
            // app build uses) so tests can import Phaser-dependent modules.
            // Exact-match regex: a string alias would also prefix-rewrite
            // "phaser/<subpath>" imports onto the dist file path.
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
            {
                find: "@queries",
                replacement: path.resolve(__dirname, "./src/ui/operations/queries"),
            },
            {
                find: "@mutations",
                replacement: path.resolve(__dirname, "./src/ui/operations/mutations"),
            },
            { find: "@", replacement: path.resolve(__dirname, "./src") },
        ],
    },
});
