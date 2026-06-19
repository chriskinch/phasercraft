import type { VercelRequest, VercelResponse } from "@vercel/node";
import { kv } from "@vercel/kv";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    try {
        await kv.del("items");
        res.status(200).json({ message: "Store cleared" });
    } catch (e) {
        console.error("[api/store/clear] handler error:", e);
        res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
}
