import type { VercelRequest, VercelResponse } from "@vercel/node";
import { kv } from "@vercel/kv";
import type { Item } from "../_lib/types";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
    const { id } = req.query;
    if (!id || Array.isArray(id)) {
        res.status(400).json({ error: "Invalid or missing item id" });
        return;
    }

    try {
        if (req.method === "GET") {
            const item = await kv.hget<Item>("items", id);
            if (!item) {
                res.status(404).json({ error: "Item not found" });
                return;
            }
            res.status(200).json(item);
            return;
        }

        if (req.method === "DELETE") {
            const item = await kv.hget<Item>("items", id);
            if (!item) {
                res.status(404).json({ error: "Item not found" });
                return;
            }
            await kv.hdel("items", id);
            res.status(200).json(item);
            return;
        }

        res.status(405).json({ error: "Method not allowed" });
    } catch (e) {
        console.error("[api/items/[id]] handler error:", e);
        res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
}
