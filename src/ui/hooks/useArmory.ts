import { useCallback, useEffect, useState } from "react";

import {
    isArmoryConfigured,
    listItems,
    removeItem,
    restock,
    type StoreItem,
} from "@/lib/armoryClient";

// Lightweight data hook for the merchant store, replacing Apollo's
// useQuery/useMutation. It owns the item list and exposes the two mutations the
// Armory needs (buy = remove, restock). On load failure or when no endpoint is
// configured it reports `unavailable`, which the UI renders as a graceful
// "merchant unavailable" state.

export type ArmoryStatus = "loading" | "ready" | "unavailable";

export interface UseArmory {
    items: StoreItem[];
    status: ArmoryStatus;
    error?: string;
    refetch: () => void;
    buy: (id: string) => Promise<void>;
    restockStore: (amount: number) => Promise<void>;
}

export function useArmory(): UseArmory {
    const [items, setItems] = useState<StoreItem[]>([]);
    const [status, setStatus] = useState<ArmoryStatus>(() =>
        isArmoryConfigured() ? "loading" : "unavailable"
    );
    const [error, setError] = useState<string>();

    const load = useCallback(async () => {
        if (!isArmoryConfigured()) {
            setStatus("unavailable");
            return;
        }
        setStatus("loading");
        setError(undefined);
        try {
            setItems(await listItems());
            setStatus("ready");
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setStatus("unavailable");
        }
    }, []);

    // Initial fetch on mount. All setState calls happen in .then()/.catch()
    // callbacks (not synchronously in the effect body) to satisfy
    // react-hooks/set-state-in-effect. Subsequent loads go through `load`.
    useEffect(() => {
        if (!isArmoryConfigured()) return;
        listItems().then(
            (result) => {
                setItems(result);
                setStatus("ready");
            },
            (err: unknown) => {
                setError(err instanceof Error ? err.message : String(err));
                setStatus("unavailable");
            }
        );
    }, []);

    const buy = useCallback(
        async (id: string) => {
            await removeItem(id);
            await load();
        },
        [load]
    );

    const restockStore = useCallback(
        async (amount: number) => {
            await restock(amount);
            await load();
        },
        [load]
    );

    return { items, status, error, refetch: () => void load(), buy, restockStore };
}
