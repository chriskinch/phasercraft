import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "@typescript-eslint/eslint-plugin";

const compat = new FlatCompat({
    // import.meta.dirname is available after Node.js v20.11.0
    baseDirectory: import.meta.dirname,
});

const eslintConfig = [
    ...compat.config({
        extends: ["next", "prettier"],
        rules: {
            "@next/next/no-img-element": "off",
        },
    }),
    {
        // Phase 3 (#308): forbid `any` across the TypeScript sources. The
        // @typescript-eslint plugin/parser ship transitively with
        // eslint-config-next, so no new dependency is required; we register the
        // plugin here so the rule resolves under flat config.
        files: ["**/*.ts", "**/*.tsx"],
        plugins: {
            "@typescript-eslint": tseslint,
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "error",
        },
    },
    {
        ignores: [
            ".next/**",
            "dist/**",
            "out/**",
            "node_modules/**",
            "server/**",
            "services/**",
            "assets/**",
            "public/**",
        ],
    },
];

export default eslintConfig;
