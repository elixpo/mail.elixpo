/**
 * Prefixed opaque ids (Stripe-style) so an id is self-describing in logs.
 */

const PREFIXES = {
    tenant: "tenant",
    sender: "snd",
    template: "tmpl",
    config: "cfg", // an email config = a credentialed send endpoint (client_id/secret)
    delivery: "dlv", // a delivery log row
    webhookEvent: "whe", // inbound trigger webhook receipt
} as const;

export type IdKind = keyof typeof PREFIXES;

export function newId(kind: IdKind): string {
    const rand = crypto.randomUUID().replace(/-/g, "");
    return `${PREFIXES[kind]}_${rand}`;
}

/** ISO-8601 UTC timestamp, matching the SQL `datetime('now')` style. */
export function nowIso(): string {
    return new Date().toISOString().replace("T", " ").slice(0, 19);
}

/** ISO timestamp `days` days from now (UTC, second precision). */
export function isoDaysFromNow(days: number): string {
    return new Date(Date.now() + days * 86_400_000)
        .toISOString()
        .replace("T", " ")
        .slice(0, 19);
}
