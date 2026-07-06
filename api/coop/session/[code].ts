// /api/coop/session/:code
//   GET  → { offer, answer } — guest fetches the offer; host polls for the answer.
//   POST { answer: { type: "answer", sdp } } → 204 — guest submits its answer.
//
// Sessions expire after SESSION_TTL_SECONDS; an expired or unknown code is 404.

import {
    type ApiRequest,
    type ApiResponse,
    firstQueryValue,
    handlePreflight,
    methodNotAllowed,
    parseBody,
    sendJson,
    withErrors,
} from "../../armory/_lib/http";
import { getCoopSessionStore } from "../_lib/sessionStore";
import { isValidJoinCode, normalizeJoinCode } from "../_lib/code";
import { parseSignal } from "../_lib/types";

async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
    if (handlePreflight(req, res)) return;

    const raw = firstQueryValue(req.query?.code);
    const code = raw ? normalizeJoinCode(raw) : "";
    if (!isValidJoinCode(code)) {
        sendJson(res, 400, { error: "Invalid join code." });
        return;
    }

    const store = getCoopSessionStore();

    if (req.method === "GET") {
        const session = await store.get(code);
        if (!session) {
            sendJson(res, 404, { error: "Session not found (it may have expired)." });
            return;
        }
        sendJson(res, 200, { offer: session.offer, answer: session.answer });
        return;
    }

    if (req.method === "POST") {
        const body = parseBody(req) as { answer?: unknown } | undefined;
        const answer = parseSignal(body?.answer, "answer");
        if (!answer) {
            sendJson(res, 400, { error: "Body must be { answer: { type: 'answer', sdp } }." });
            return;
        }
        const stored = await store.setAnswer(code, answer);
        if (!stored) {
            sendJson(res, 404, { error: "Session not found (it may have expired)." });
            return;
        }
        sendJson(res, 200, { ok: true });
        return;
    }

    methodNotAllowed(res, "GET, POST, OPTIONS");
}

export default withErrors(handler);
