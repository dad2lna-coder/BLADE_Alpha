---
name: openrouter-quota
description: Track OpenRouter API credit usage and quota locally. Fetch from /api/v1/credits endpoint, store snapshots, and alert when usage is high. Use to monitor token spend and avoid hitting credit limits.
version: 0.1.0
---

# OpenRouter Quota Tracker

Track your OpenRouter credit balance locally. Poll the `/api/v1/credits` endpoint (requires management key), store snapshots in a local JSON file, and get warnings when you're approaching your limit.

## Prerequisites

- An OpenRouter **management key** (provisioning key) — NOT a regular inference key
- Get one at https://openrouter.ai/settings/management-keys
- Store it in the OpenClaw secret store as `OPENROUTER_MANAGEMENT_KEY`

## First-Time Setup

```bash
# Store your management key securely
openclaw secrets request --name OPENROUTER_MANAGEMENT_KEY --reason "OpenRouter management key for quota tracking" --allowed-hosts openrouter.ai
```

## Data Store

Usage snapshots are stored at:
- Workspace: `.openclaw/data/openrouter-quota.json`
- Fallback: `/root/.openclaw/data/openrouter-quota.json`

Each snapshot includes:
```json
{
  "timestamp": "2026-09-15T14:30:00.000Z",
  "total_credits": 100.0,
  "total_usage": 42.5,
  "remaining": 57.5,
  "usage_pct": 42.5
}
```

## Commands

### Check Current Quota (fetch + store)

```bash
npx tsx check-quota.ts
```

Fetches from `/api/v1/credits`, stores snapshot, and prints current status with warnings.

### Show History

```bash
npx tsx check-quota.ts --history 30
```

Shows last N days of snapshots with daily aggregates.

### Automated Monitoring

Add an automation to poll periodically:

```bash
# Daily at 6 AM UTC
openclaw automations add --name "openrouter-quota-daily" \
  --schedule '{"kind":"cron","expr":"0 6 * * *","tz":"UTC"}' \
  --payload '{"kind":"script","script":"cd /root/BLADE_Alpha/.dev/worktree/bright-garden && npx tsx .github/skills/openrouter-quota/scripts/check-quota.ts"}' \
  --sessionTarget isolated
```

## Alert Thresholds

Default warning levels (configurable in script):
- **WARN** at 75% used
- **ALERT** at 90% used  
- **CRITICAL** at 95% used

## API Reference

**Endpoint**: `GET https://openrouter.ai/api/v1/credits`
**Auth**: `Authorization: Bearer <management-key>`
**Response**:
```json
{
  "data": {
    "total_credits": 100.0,
    "total_usage": 42.5
  }
}
```

Credits and usage are in USD. `remaining = total_credits - total_usage`.

## Notes

- Requires management key — regular API keys return 403
- The credits endpoint is separate from the analytics API
- Rate limited; don't poll more than once per hour
- Free tier accounts may not have credits endpoint access
