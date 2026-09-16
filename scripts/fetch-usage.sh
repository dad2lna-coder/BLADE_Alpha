#!/usr/bin/env bash
# fetch-usage.sh - Collect OpenClaw usage/usage metrics
# Output: JSON written to dashboard/usage-data.json
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE="$(dirname "$SCRIPT_DIR")"
OUTPUT="$WORKSPACE/dashboard/usage-data.json"

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# 1. System status (JSON only)
STATUS_JSON=$(openclaw status --json 2>/dev/null || echo '{}')

# 2. Model status
MODELS_JSON=$(openclaw models status --json 2>/dev/null || echo '{}')

# 3. Session list (verbose, for usage per session)
SESSIONS_JSON=$(openclaw sessions list --all-agents --json 2>/dev/null || echo '[]')

# 4. Gateway health
GATEWAY_JSON=$(openclaw gateway status 2>/dev/null || echo '{}')

# Build the unified dashboard data
cat > "$OUTPUT" <<EOF
{
  "timestamp": "$TIMESTAMP",
  "system": $STATUS_JSON,
  "models": $MODELS_JSON,
  "sessions": $SESSIONS_JSON,
  "gateway": $GATEWAY_JSON
}
EOF

echo "Dashboard data updated: $OUTPUT"
echo "Timestamp: $TIMESTAMP"