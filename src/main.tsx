import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "@store";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider } from "react-dnd";
import UI from "@ui/UI";
import "./styles/globals.css";

// The Phaser engine is a large, browser-only dependency. Under Next it was
// loaded with `dynamic(..., { ssr: false })`; the Vite equivalent is a lazy
// import behind <Suspense>, which also keeps Phaser out of the initial chunk.
const PhaserGame = lazy(() => import("./PhaserGame"));

function App() {
    return (
        <Provider store={store}>
            <DndProvider
                backend={TouchBackend}
                options={{ enableMouseEvents: true, preview: true }}
            >
                <UI />
                <Suspense fallback={null}>
                    <PhaserGame />
                </Suspense>
            </DndProvider>
        </Provider>
    );
}

// E2E test hook (spike, see docs/ROADMAP.md): an allowlisted action space on
// `window` so the smoke pack can reach the flows the Phaser canvas owns. The
// condition folds to a constant at build time, so `npm run build` drops both the
// branch and the module's chunk; `npm run build:e2e` (Vite mode `e2e`) and
// `npm run dev` keep it.
if (import.meta.env.MODE === "e2e" || import.meta.env.DEV) {
    void import("@services/testHook").then(({ installTestHook }) => installTestHook(store));
}

const container = document.getElementById("root");
if (!container) throw new Error('Root element "#root" not found');

createRoot(container).render(
    <StrictMode>
        <App />
    </StrictMode>
);
