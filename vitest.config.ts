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
        alias: {
            // Phaser's package "main" is its raw src build, which requires the
            // dev-only phaser3spectorjs package. Use the bundled dist (what the
            // app build uses) so tests can import Phaser-dependent modules.
            phaser: path.resolve(__dirname, "./node_modules/phaser/dist/phaser.esm.js"),
            "@store": path.resolve(__dirname, "./src/store"),
            "@ui": path.resolve(__dirname, "./src/ui"),
            "@helpers": path.resolve(__dirname, "./src/helpers"),
            "@scenes": path.resolve(__dirname, "./src/scenes"),
            "@entities": path.resolve(__dirname, "./src/entities"),
            "@config": path.resolve(__dirname, "./src/config"),
            "@queries": path.resolve(__dirname, "./src/ui/operations/queries"),
            "@mutations": path.resolve(__dirname, "./src/ui/operations/mutations"),
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
