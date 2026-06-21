// TEMP diagnostic endpoint (Phase 7 bring-up): GET /api/armory/health
// Reports the runtime Node version and which KV-related env vars the Vercel KV
// store injected (names only — never values). Used to confirm the `armory-kv`
// binding is wired with the names @vercel/kv expects (KV_REST_API_URL /
// KV_REST_API_TOKEN). Remove before merging PR2.

import {
    type ApiRequest,
    type ApiResponse,
    handlePreflight,
    methodNotAllowed,
    sendJson,
    withErrors,
} from "./_lib/http";

async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
    if (handlePreflight(req, res)) return;
    if (req.method !== "GET") {
        methodNotAllowed(res, "GET, OPTIONS");
        return;
    }

    const storageEnvKeys = Object.keys(process.env)
        .filter((k) => /KV|REDIS|UPSTASH|STORAGE/i.test(k))
        .sort();

    sendJson(res, 200, {
        ok: true,
        node: process.version,
        redisUrlPresent: Boolean(process.env.REDIS_URL),
        storageEnvKeys,
    });
}

export default withErrors(handler);
