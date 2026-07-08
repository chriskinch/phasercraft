// /api/coop/session
//   POST { offer: { type: "offer", sdp } } → { code }
//
// The host calls this once with its (non-trickle) SDP offer and reads the join
// code to the guest out-of-band. See api/coop/README.md for the full handshake.

import {
    type ApiRequest,
    type ApiResponse,
    handlePreflight,
    methodNotAllowed,
    parseBody,
    sendJson,
    withErrors,
} from "../../armory/_lib/http";
import { getCoopSessionStore } from "../_lib/sessionStore";
import { generateJoinCode } from "../_lib/code";
import { parseSignal } from "../_lib/types";

async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
    if (handlePreflight(req, res)) return;

    if (req.method !== "POST") {
        methodNotAllowed(res, "POST, OPTIONS");
        return;
    }

    const body = parseBody(req) as { offer?: unknown } | undefined;
    const offer = parseSignal(body?.offer, "offer");
    if (!offer) {
        sendJson(res, 400, { error: "Body must be { offer: { type: 'offer', sdp } }." });
        return;
    }

    const store = getCoopSessionStore();
    // Codes are random; retry a few times in the (astronomically unlikely)
    // event of colliding with a live session.
    for (let attempt = 0; attempt < 5; attempt++) {
        const code = generateJoinCode();
        if (await store.create(code, offer)) {
            sendJson(res, 201, { code });
            return;
        }
    }
    sendJson(res, 503, { error: "Could not allocate a session code. Try again." });
}

export default withErrors(handler);
