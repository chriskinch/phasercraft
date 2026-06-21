/**
 * Standalone armory smoke test — exercises the real Vercel handlers against the
 * in-memory store (no Vercel, no KV, no network) so you can watch items being
 * generated, stored, retrieved and deleted.
 *
 *   npm run armory:smoke
 *
 * For an over-the-wire run use `vercel dev` with a Vercel KV binding (see
 * api/armory/README.md). The authoritative, CI-enforced version of these checks
 * lives in api/armory/handlers.test.ts.
 */
import itemsHandler from "../api/armory/items/index";
import itemByIdHandler from "../api/armory/items/[id]";
import storeCreateHandler from "../api/armory/store/create";
import storeClearHandler from "../api/armory/store/clear";
import { MemoryItemStore, setItemStore } from "../api/armory/_lib/itemStore";
import type { ApiRequest, ApiResponse } from "../api/armory/_lib/http";
import type { StoredItem } from "../api/armory/_lib/types";

type Handler = (req: ApiRequest, res: ApiResponse) => Promise<void>;
interface Result {
    status: number;
    body: unknown;
}

const call = async (
    handler: Handler,
    method: string,
    opts: { query?: ApiRequest["query"]; body?: unknown } = {}
): Promise<Result> => {
    const result: Result = { status: 0, body: undefined };
    const res: ApiResponse = {
        setHeader() {},
        status(code) {
            result.status = code;
            return res;
        },
        json(body) {
            result.body = body;
        },
        send(body) {
            result.body = body;
        },
        end() {},
    };
    await handler({ method, query: opts.query, body: opts.body }, res);
    return result;
};

const log = (label: string, result: Result) => {
    console.log(`\n▸ ${label}  →  HTTP ${result.status}`);
    console.log(JSON.stringify(result.body, null, 2));
};

const main = async () => {
    setItemStore(new MemoryItemStore());

    console.log("=== Armory standalone smoke (in-memory store) ===");

    log("POST /store/clear (start clean)", await call(storeClearHandler, "POST"));

    const created = await call(itemsHandler, "POST", { body: {} });
    log("POST /items (generate + store one)", created);
    const id = (created.body as StoredItem).id;

    log(
        "POST /store/create { amount: 3 } (batch generate)",
        await call(storeCreateHandler, "POST", { body: { amount: 3 } })
    );

    log("GET /items (list all)", await call(itemsHandler, "GET"));

    log(`GET /items/${id} (retrieve one)`, await call(itemByIdHandler, "GET", { query: { id } }));

    log(
        `DELETE /items/${id} (remove one)`,
        await call(itemByIdHandler, "DELETE", { query: { id } })
    );

    const finalList = (await call(itemsHandler, "GET")).body as StoredItem[];
    console.log(`\n✔ Done. ${finalList.length} items remain after deleting 1 of 4.`);
};

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
