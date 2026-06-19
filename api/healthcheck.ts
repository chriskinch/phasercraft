import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse): void {
    res.status(200).json({
        nodeVersion: process.version,
        kvUrl: process.env.KV_REST_API_URL ? "set" : "missing",
        kvToken: process.env.KV_REST_API_TOKEN ? "set" : "missing",
    });
}
