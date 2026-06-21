// /api/armory/items
//   GET  → all items (legacy: GET /items)
//   POST → generate + store one item, optional overrides in body (legacy: POST /items)

import {
    type ApiRequest,
    type ApiResponse,
    handlePreflight,
    methodNotAllowed,
    parseBody,
    sendJson,
    withErrors,
} from "../_lib/http";
import { getItemStore } from "../_lib/itemStore";
import { createStoredItem } from "../_lib/item";
import type { ItemInput } from "../_lib/types";

async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
    if (handlePreflight(req, res)) return;
    const store = getItemStore();

    if (req.method === "GET") {
        sendJson(res, 200, await store.list());
        return;
    }

    if (req.method === "POST") {
        const input = (parseBody(req) ?? undefined) as ItemInput | undefined;
        const item = createStoredItem(input);
        await store.put(item);
        sendJson(res, 200, item);
        return;
    }

    methodNotAllowed(res, "GET, POST, OPTIONS");
}

export default withErrors(handler);
