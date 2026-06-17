/**
 * Products — group templates and (from step 4) hold client_id + shared secret.
 * For now templates need a parent product, so we auto-provision a "Default"
 * product per tenant; full product CRUD (naming, credentials, rotation) lands
 * in step 4.
 */

import type { D1Database } from "@cloudflare/workers-types";
import { newId } from "./ids";

export interface ProductRow {
    id: string;
    tenant_id: string;
    name: string;
    client_id: string;
    secret_hash: string | null;
    prev_secret_hash: string | null;
    prev_secret_expires_at: string | null;
    default_sender_id: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export function slugify(s: string): string {
    return (
        s
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 40) || "product"
    );
}

export async function listProducts(db: D1Database, tenantId: string): Promise<ProductRow[]> {
    const res = await db
        .prepare("SELECT * FROM products WHERE tenant_id = ? ORDER BY created_at ASC")
        .bind(tenantId)
        .all();
    return (res.results || []) as unknown as ProductRow[];
}

export async function getProduct(
    db: D1Database,
    tenantId: string,
    id: string,
): Promise<ProductRow | null> {
    return (await db
        .prepare("SELECT * FROM products WHERE id = ? AND tenant_id = ?")
        .bind(id, tenantId)
        .first()) as ProductRow | null;
}

/** Return the tenant's first product, creating a "Default" one if none exist. */
export async function getOrCreateDefaultProduct(
    db: D1Database,
    tenantId: string,
): Promise<ProductRow> {
    const existing = (await db
        .prepare("SELECT * FROM products WHERE tenant_id = ? ORDER BY created_at ASC LIMIT 1")
        .bind(tenantId)
        .first()) as ProductRow | null;
    if (existing) return existing;

    const id = newId("product");
    const clientId = `default-${id.replace("prod_", "").slice(0, 10)}`;
    await db
        .prepare("INSERT INTO products (id, tenant_id, name, client_id) VALUES (?, ?, 'Default', ?)")
        .bind(id, tenantId, clientId)
        .run();
    const row = await getProduct(db, tenantId, id);
    if (!row) throw new Error("default product insert failed");
    return row;
}
