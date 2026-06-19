import type { VercelRequest, VercelResponse } from "@vercel/node";
import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";
import { generateItem } from "../_lib/generateItem";
import type { Item } from "../_lib/types";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    const amount: number = req.body?.amount ?? 1;
    const items: Item[] = Array.from({ length: amount }, () => {
        const id = uuidv4();
        return { id, createdAt: Date.now(), ...generateItem() } as Item;
    });

    const fields: Record<string, Item> = {};
    for (const item of items) {
        fields[item.id] = item;
    }
    await kv.hset("items", fields);

    res.status(200).json(items);
}
