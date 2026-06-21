// /api/armory/store/create
//   POST { amount } → batch-generate + store N items, return them
//   (legacy: POST /createStore)

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

// Legacy `createStore` defaulted to 1 and had no upper bound. The default and
// generation are unchanged; the cap is a new safety guard (the frontend restock
// asks for 45, well within it) so a single request can't generate unbounded items.
const MAX_AMOUNT = 200;

async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
    if (handlePreflight(req, res)) return;
    if (req.method !== "POST") {
        methodNotAllowed(res, "POST, OPTIONS");
        return;
    }

    const body = (parseBody(req) ?? {}) as { amount?: unknown };
    const amount = body.amount === undefined ? 1 : Number(body.amount);

    if (!Number.isInteger(amount) || amount < 1 || amount > MAX_AMOUNT) {
        sendJson(res, 400, { error: `amount must be an integer between 1 and ${MAX_AMOUNT}.` });
        return;
    }

    const store = getItemStore();
    const items = Array.from({ length: amount }, () => createStoredItem());
    await store.putMany(items);
    sendJson(res, 200, items);
}

export default withErrors(handler);
