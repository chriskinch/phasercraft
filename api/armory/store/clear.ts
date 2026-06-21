// /api/armory/store/clear
//   POST → empty the store (legacy: POST /clearStore)
// Matches the legacy plain-text response body, not JSON.

import {
    type ApiRequest,
    type ApiResponse,
    handlePreflight,
    methodNotAllowed,
    sendText,
} from "../_lib/http";
import { getItemStore } from "../_lib/itemStore";

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
    if (handlePreflight(req, res)) return;
    if (req.method !== "POST") {
        methodNotAllowed(res, "POST, OPTIONS");
        return;
    }

    await getItemStore().clear();
    sendText(res, 200, "Success, store cleared!");
}
