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
