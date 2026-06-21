// /api/armory/items/[id]
//   GET    → item by id (legacy: GET /items/{id})
//   DELETE → remove + return the item (legacy: DELETE /items/{id}, ReturnValues ALL_OLD)

import {
    type ApiRequest,
    type ApiResponse,
    firstQueryValue,
    handlePreflight,
    methodNotAllowed,
    sendJson,
    withErrors,
} from "../_lib/http";
import { getItemStore } from "../_lib/itemStore";

async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
    if (handlePreflight(req, res)) return;

    const id = firstQueryValue(req.query?.id);
    if (!id) {
        sendJson(res, 400, { error: "Missing a valid item id." });
        return;
    }

    const store = getItemStore();

    if (req.method === "GET") {
        const item = await store.get(id);
        if (!item) {
            sendJson(res, 404, { error: "No item found with that ID." });
            return;
        }
        sendJson(res, 200, item);
        return;
    }

    if (req.method === "DELETE") {
        const removed = await store.remove(id);
        if (!removed) {
            sendJson(res, 404, { error: "No item found with that ID." });
            return;
        }
        sendJson(res, 200, removed);
        return;
    }

    methodNotAllowed(res, "GET, DELETE, OPTIONS");
}

export default withErrors(handler);
