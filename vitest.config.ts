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
        // `src/**` is the app suite; `test/**` holds cross-cutting suites that
        // aren't tied to a single source file (e.g. the armory REST contract).
        include: ["src/**/*.{test,spec}.{ts,tsx}", "test/**/*.{test,spec}.{ts,tsx}"],
        exclude: ["node_modules", "dist", ".next", "server", "services"],
        css: false,
        coverage: {
            provider: "v8",
            // Count untested source files too, not just files an executed test
            // happened to import — otherwise the ratchet would ignore whole
            // modules with zero coverage. In Vitest 4 the old `all: true` option
            // was removed; an explicit `include` glob is now what pulls every
            // matching source file into the report (covered or not).
            include: ["src/**/*.{ts,tsx}"],
            reporter: ["text", "text-summary", "json-summary", "html", "lcov"],
            exclude: [
                // Test files and their helpers.
                "**/*.{test,spec}.{ts,tsx}",
                // Type-only declarations carry no executable logic.
                "src/types/**",
                "**/*.d.ts",
                // Static config/asset data (real logic in src/config/*.ts stays in scope).
                "src/config/**/*.json",
                "**/*.json",
                // React/Phaser boot seam — wiring that can't be meaningfully unit-tested.
                "src/main.tsx",
                "**/PhaserGame.tsx",
                // E2E lives outside the unit suite (Playwright, separate workflow).
                "e2e/**",
            ],
            // Ratcheting floor: set to the current measured coverage (floored to
            // whole percents, with a small margin) so the suite passes today but
            // ANY regression below these numbers fails CI. Bump these up as
            // coverage improves — do not lower them. Aspirational target is
            // ~80% on non-Phaser code. Do not enable autoUpdate (the ratchet
            // must be a deliberate, reviewed change).
            // Measured 2026-06-17: lines 21.52, functions 24.3, branches 22.66,
            // statements 22.14. Floored to whole percents below.
            thresholds: {
                lines: 21,
                functions: 24,
                branches: 22,
                statements: 22,
            },
        },
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
