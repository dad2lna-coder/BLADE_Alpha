/**
 * OpenRouter Quota Tracker — fetch credits, store snapshot, warn on thresholds
 *
 * Usage:
 *   npx tsx check-quota.ts              # fetch + store + print status
 *   npx tsx check-quota.ts --history 30 # show last 30 snapshots
 *   npx tsx check-quota.ts --quiet      # suppress output (for automation)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// --- Config ---

const DATA_DIR = join(process.cwd(), '..', '..', 'data');
const DATA_FILE = join(DATA_DIR, 'openrouter-quota.json');

// Thresholds (percentage of total credits used)
const WARN_PCT = 75;
const ALERT_PCT = 90;
const CRITICAL_PCT = 95;

const API_BASE = 'https://openrouter.ai/api/v1';
const CREDITS_ENDPOINT = `${API_BASE}/credits`;

// --- Helpers ---

function getApiKey(): string {
  // Priority: CLI flag > env > secret store sentinel
  const args = process.argv.slice(2);
  const flagIdx = args.indexOf('--api-key');
  if (flagIdx >= 0 && flagIdx + 1 < args.length) {
    return args[flagIdx + 1];
  }

  const envKey = process.env.OPENROUTER_API_KEY;
  if (envKey && envKey.length > 0) {
    return envKey;
  }

  // Tell user how to set it up
  const sentinel = process.env.OPENROUTER_MANAGEMENT_KEY;
  if (sentinel) return sentinel;

  console.error('ERROR: No OpenRouter management key found.');
  console.error('Store it with:');
  console.error('  openclaw secrets request --name OPENROUTER_MANAGEMENT_KEY --reason "OpenRouter quota tracking" --allowed-hosts openrouter.ai');
  console.error('Then restart, or pass via --api-key <key> or OPENROUTER_API_KEY env.');
  process.exit(1);
}

function loadHistory(): any[] {
  try {
    if (!existsSync(DATA_FILE)) return [];
    const raw = readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : parsed.history || [];
  } catch {
    return [];
  }
}

function saveHistory(history: any[]): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(DATA_FILE, JSON.stringify(history, null, 2));
}

function fmtCurrency(n: number | null | undefined): string {
  if (n === null || n === undefined) return 'N/A';
  return `$${n.toFixed(2)}`;
}

function pct(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return (part / whole) * 100;
}

// --- Core ---

async function fetchCredits(apiKey: string): Promise<{
  total_credits: number;
  total_usage: number;
} | null> {
  const res = await fetch(CREDITS_ENDPOINT, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => 'unknown');
    console.error(`ERROR: OpenRouter API returned ${res.status}`);
    console.error(`Details: ${body}`);

    if (res.status === 403) {
      console.error('💡 Management key required. Regular API keys return 403.');
      console.error('Create one at https://openrouter.ai/settings/management-keys');
    }
    return null;
  }

  const data = await res.json() as {
    data?: {
      total_credits?: number | string;
      total_usage?: number | string;
    };
  };

  const tc = parseFloat(String(data.data?.total_credits ?? '0'));
  const tu = parseFloat(String(data.data?.total_usage ?? '0'));

  return { total_credits: tc, total_usage: tu };
}

function getWarningLevel(usagePct: number): { level: string; msg: string } {
  if (usagePct >= CRITICAL_PCT) {
    return { level: 'CRITICAL', msg: `⚠️  Critical: ${usagePct.toFixed(1)}% of credits used` };
  }
  if (usagePct >= ALERT_PCT) {
    return { level: 'ALERT', msg: `⚠️  Alert: ${usagePct.toFixed(1)}% of credits used` };
  }
  if (usagePct >= WARN_PCT) {
    return { level: 'WARN', msg: `⚠️  Warning: ${usagePct.toFixed(1)}% of credits used` };
  }
  return { level: 'OK', msg: `✓ All good: ${usagePct.toFixed(1)}% of credits used` };
}

async function checkQuota() {
  const apiKey = getApiKey();
  const credits = await fetchCredits(apiKey);

  const quiet = process.argv.includes('--quiet');

  if (!credits) {
    if (!quiet) {
      console.log('Could not fetch quota — see errors above.');
    }
    return;
  }

  const { total_credits, total_usage } = credits;
  const remaining = total_credits - total_usage;
  const usagePct = pct(total_usage, total_credits);

  // Store snapshot
  const snapshot = {
    timestamp: new Date().toISOString(),
    total_credits,
    total_usage,
    remaining,
    usage_pct: parseFloat(usagePct.toFixed(2)),
  };

  const history = loadHistory();
  history.push(snapshot);
  // Keep last 1440 entries (24h at 1/hr, or 60 days at 1/day)
  if (history.length > 1440) {
    // Trim to last 60 days of snapshots
    const cutoff = Date.now() - 60 * 24 * 60 * 60 * 1000;
    const trimmed = history.filter((s) => new Date(s.timestamp).getTime() > cutoff);
    saveHistory(trimmed.length > 0 ? trimmed : history.slice(-360));
  } else {
    saveHistory(history);
  }

  if (!quiet) {
    console.log('\n=== OpenRouter Quota ===');
    console.log(`Total Credits:  ${fmtCurrency(total_credits)}`);
    console.log(`Total Usage:    ${fmtCurrency(total_usage)}`);
    console.log(`Remaining:      ${fmtCurrency(remaining)}`);
    console.log(`Usage:          ${usagePct.toFixed(1)}%`);
    console.log(`Updated:        ${new Date().toISOString()}`);

    const warn = getWarningLevel(usagePct);
    console.log(`Status:         ${warn.msg}\n`);

    if (warn.level !== 'OK') {
      console.log('💡 Tip: Review your usage at https://openrouter.ai/dashboard');
    }
  }
}

function showHistory(days: number = 30) {
  const history = loadHistory();
  if (history.length === 0) {
    console.log('No history available. Run without --history to fetch current quota.');
    return;
  }

  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const recent = history.filter((s) => new Date(s.timestamp).getTime() > cutoff);

  console.log(`\n=== OpenRouter Quota — Last ${days} days ===\n`);
  console.log('Date        | Credits  | Usage    | Remaining  | % Used');
  console.log('------------|----------|----------|------------|-------');

  // Aggregate by day
  const daily = new Map<string, any>();
  for (const s of recent) {
    const d = new Date(s.timestamp).toISOString().split('T')[0];
    if (!daily.has(d) || new Date(s.timestamp) > new Date(daily.get(d).timestamp)) {
      daily.set(d, s);
    }
  }

  const sorted = Array.from(daily.values()).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  for (const s of sorted) {
    const d = new Date(s.timestamp).toISOString().split('T')[0];
    console.log(
      `${d} | ${fmtCurrency(s.total_credits).padStart(8)} | ${fmtCurrency(s.total_usage).padStart(8)} | ${fmtCurrency(s.remaining).padStart(10)} | ${s.usage_pct.toFixed(1)}%`
    );
  }
  console.log('');
}

// --- Entry ---

const args = process.argv.slice(2);
if (args.includes('--history')) {
  const idx = args.indexOf('--history');
  const days = idx + 1 < args.length ? parseInt(args[idx + 1]) || 30 : 30;
  showHistory(days);
} else {
  checkQuota().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
