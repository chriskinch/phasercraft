import tseslintParser from "@typescript-eslint/parser";
import tseslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";

// Flat config. Replaced eslint-config-next (Phase 5 Vite migration) with the
// react + react-hooks plugins it used to bundle, keeping the Phase 3 ban on
// `any`. Prettier is applied last to switch off any formatting-related rules.
const eslintConfig = [
    {
        ignores: [
            ".next/**",
            "dist/**",
            "out/**",
            "coverage/**",
            "playwright-report/**",
            "test-results/**",
            "node_modules/**",
            "server/**",
            "services/**",
            "assets/**",
            "public/**",
        ],
    },
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parser: tseslintParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: { jsx: true },
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
            react,
            "react-hooks": reactHooks,
        },
        settings: {
            react: { version: "detect" },
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            // Phase 3 (#308): forbid `any` across the TypeScript sources.
            "@typescript-eslint/no-explicit-any": "error",
            // The automatic JSX runtime (jsx: "react-jsx") means React need not
            // be in scope.
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",
        },
    },
    prettier,
];

export default eslintConfig;
