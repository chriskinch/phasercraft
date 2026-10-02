import { installRandomHook } from "./rng";

// Imported first by main.tsx so it runs before any module captures
// Math.random (#527). The flag is replaced at build time: outside a
// `VITE_PERF=1` build this module is empty.
if (import.meta.env.VITE_PERF === "1") installRandomHook();
