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
#   - Preview builds trigger for all open, non-draft PRs.
#   - Draft PRs and branch pushes without an associated open PR are skipped.
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

API="https://api.github.com/repos/${OWNER}/${SLUG}/pulls/${PR_ID}"
echo "Checking PR state for ${OWNER}/${SLUG} PR #${PR_ID}: ${API}"

# Phasercraft is a public repo, so an unauthenticated read works; pass a token
# if one is available to avoid rate limits. Fail closed (skip the build) if the
# PR state can't be confirmed.
AUTH_HEADER=()
if [ -n "${GITHUB_TOKEN:-}" ]; then
    AUTH_HEADER=(-H "Authorization: Bearer ${GITHUB_TOKEN}")
fi

PR_JSON=$(curl -fsS "${AUTH_HEADER[@]}" "$API" 2>/dev/null) || {
    echo "✗ Could not fetch PR data — skipping preview build."
    exit 0
}

# Skip draft PRs.
if echo "$PR_JSON" | grep -q '"draft"[[:space:]]*:[[:space:]]*true'; then
    echo "✗ PR #${PR_ID} is a draft — skipping preview build."
    exit 0
fi

echo "✓ PR #${PR_ID} is open and not a draft — building preview."
exit 1
