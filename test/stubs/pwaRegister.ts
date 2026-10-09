import type { Dispatch, SetStateAction } from "react";

// `virtual:pwa-register/react` only exists while vite-plugin-pwa is in the
// pipeline, and vitest.config.ts deliberately doesn't load it. This stub stands
// in for that module id (see the alias in vitest.config.ts) so components that
// import it are resolvable under test; UpdateBanner.test.tsx `vi.mock`s it to
// drive the update flow.
export function useRegisterSW(): {
    needRefresh: [boolean, Dispatch<SetStateAction<boolean>>];
    offlineReady: [boolean, Dispatch<SetStateAction<boolean>>];
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
} {
    return {
        needRefresh: [false, () => {}],
        offlineReady: [false, () => {}],
        updateServiceWorker: async () => {},
    };
}
