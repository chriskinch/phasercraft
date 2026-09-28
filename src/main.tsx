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

const container = document.getElementById("root");
if (!container) throw new Error('Root element "#root" not found');

createRoot(container).render(
    <StrictMode>
        <App />
    </StrictMode>
);
