// Minimal request/response shapes for Vercel Node functions. Typed structurally
// (rather than depending on `@vercel/node`, which pulls a whole build toolchain
// and its audit advisories) — these cover exactly what the handlers use, and
// match the Vercel `(req, res)` runtime contract.

export interface ApiRequest {
    method?: string;
    query?: Record<string, string | string[] | undefined>;
    body?: unknown;
}

export interface ApiResponse {
    setHeader(name: string, value: string): void;
    status(code: number): ApiResponse;
    json(body: unknown): void;
    send(body: string): void;
    end(): void;
}

const applyCors = (res: ApiResponse): void => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

/** Returns true if the request was a CORS preflight and has been answered. */
export const handlePreflight = (req: ApiRequest, res: ApiResponse): boolean => {
    if (req.method === "OPTIONS") {
        applyCors(res);
        res.status(204).end();
        return true;
    }
    return false;
};

export const sendJson = (res: ApiResponse, status: number, data: unknown): void => {
    applyCors(res);
    res.status(status).json(data);
};

export const sendText = (res: ApiResponse, status: number, text: string): void => {
    applyCors(res);
    res.setHeader("Content-Type", "text/plain");
    res.status(status).send(text);
};

export const methodNotAllowed = (res: ApiResponse, allow: string): void => {
    applyCors(res);
    res.setHeader("Allow", allow);
    res.status(405).json({ error: "Method not allowed." });
};

/** Vercel parses JSON bodies into `req.body`; tolerate a raw string too. */
export const parseBody = (req: ApiRequest): unknown => {
    if (typeof req.body === "string") {
        if (req.body.trim() === "") return undefined;
        try {
            return JSON.parse(req.body);
        } catch {
            return undefined;
        }
    }
    return req.body;
};

/** Reads a single path-param value (`req.query.id` may be string | string[]). */
export const firstQueryValue = (value: string | string[] | undefined): string | undefined =>
    Array.isArray(value) ? value[0] : value;

/**
 * Wraps a handler so any thrown error becomes a JSON 500 (and a server log)
 * instead of an opaque FUNCTION_INVOCATION_FAILED. The error detail is logged
 * server-side only — never returned to the client.
 */
export const withErrors =
    (handler: (req: ApiRequest, res: ApiResponse) => Promise<void>) =>
    async (req: ApiRequest, res: ApiResponse): Promise<void> => {
        try {
            await handler(req, res);
        } catch (err) {
            console.error("[armory] handler error", err);
            sendJson(res, 500, { error: "Internal server error." });
        }
    };
