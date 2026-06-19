import type { VercelRequest, VercelResponse } from "@vercel/node";
import { kv } from "@vercel/kv";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    await kv.del("items");
    res.status(200).json({ message: "Store cleared" });
}
