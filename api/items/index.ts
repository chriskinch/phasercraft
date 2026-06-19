import type { VercelRequest, VercelResponse } from "@vercel/node";
import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";
import { generateItem } from "../_lib/generateItem";
import type { Item } from "../_lib/types";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
    try {
        if (req.method === "GET") {
            const raw = await kv.hgetall<Record<string, Item>>("items");
            const items: Item[] = raw ? Object.values(raw) : [];
            res.status(200).json(items);
            return;
        }

        if (req.method === "POST") {
            const id = uuidv4();
            const item = { id, createdAt: Date.now(), ...generateItem(req.body) } as Item;
            await kv.hset("items", { [id]: item });
            res.status(201).json(item);
            return;
        }

        res.status(405).json({ error: "Method not allowed" });
    } catch (e) {
        console.error("[api/items] handler error:", e);
        res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
}
