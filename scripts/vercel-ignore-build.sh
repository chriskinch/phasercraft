#!/usr/bin/env bash
#
# Vercel "Ignored Build Step" gate (Phase 6).
#
# Vercel runs this before every deployment and reads its EXIT CODE:
#   exit 1 -> continue the build
#   exit 0 -> skip (cancel) the build
# (see https://vercel.com/docs/project-configuration/project-settings)
#
# Policy (per docs/ROADMAP.md, Phase 6):
#   - Production (merge to the production branch) always builds.
#   - Preview builds are opt-in: a PR only builds a preview when it carries the
#     `deploy-preview` label. This keeps the free hobby tier from building a
#     preview for every push.
#
# Wired up via vercel.json -> "ignoreCommand". No dashboard setting required.

set -euo pipefail

# Always build Production.
if [ "${VERCEL_ENV:-}" = "production" ]; then
    echo "▲ Production deployment — building."
    exit 1
fi

PR_ID="${VERCEL_GIT_PULL_REQUEST_ID:-}"
OWNER="${VERCEL_GIT_REPO_OWNER:-}"
SLUG="${VERCEL_GIT_REPO_SLUG:-}"

# Not a PR build (e.g. a branch push with no open PR) — nothing to preview.
if [ -z "$PR_ID" ] || [ "$PR_ID" = "0" ]; then
    echo "No associated pull request (VERCEL_GIT_PULL_REQUEST_ID='$PR_ID') — skipping preview build."
    exit 0
fi

API="https://api.github.com/repos/${OWNER}/${SLUG}/issues/${PR_ID}/labels"
echo "Checking labels for ${OWNER}/${SLUG} PR #${PR_ID}: ${API}"

# Phasercraft is a public repo, so an unauthenticated read works; pass a token
# if one is available to avoid rate limits. Fail closed (skip the build) if the
# label can't be confirmed.
AUTH_HEADER=()
if [ -n "${GITHUB_TOKEN:-}" ]; then
    AUTH_HEADER=(-H "Authorization: Bearer ${GITHUB_TOKEN}")
fi

if curl -fsS "${AUTH_HEADER[@]}" "$API" | grep -q '"name"[[:space:]]*:[[:space:]]*"deploy-preview"'; then
    echo "✓ 'deploy-preview' label present — building preview."
    exit 1
fi

echo "✗ 'deploy-preview' label absent (or labels unreadable) — skipping preview build."
exit 0
