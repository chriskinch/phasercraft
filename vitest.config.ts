import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
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
