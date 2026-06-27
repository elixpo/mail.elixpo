-- mail.elixpo — one-time templates.
--
-- A template can now exist with NO product attached (product_id NULL): a
-- "one-time" template the user composes and sends directly, with no webhook and
-- no parent product to inherit a footer from. Such templates carry their own
-- footer in footer_json. Product-backed templates (product_id NOT NULL) are
-- unchanged and still inherit the product footer at send time.
--
-- SQLite can't drop a NOT NULL constraint in place, so rebuild the table. D1
-- DOES enforce foreign keys during migrations, and webhooks/deliveries reference
-- templates(id) — so dropping/renaming templates would trip an immediate FK
-- check. `defer_foreign_keys` postpones every FK check to the end of the
-- migration transaction, by which point templates exists again with all the same
-- ids, so the deferred check passes. (Unlike PRAGMA foreign_keys=OFF, this works
-- inside a transaction.)
PRAGMA defer_foreign_keys = ON;

DROP TABLE IF EXISTS templates_new;

CREATE TABLE templates_new (
    id              TEXT PRIMARY KEY,
    tenant_id       TEXT NOT NULL REFERENCES tenants(id),
    product_id      TEXT REFERENCES products(id),       -- NULL = one-time template
    slug            TEXT NOT NULL,
    name            TEXT NOT NULL,
    kind            TEXT NOT NULL DEFAULT 'custom',
    subject         TEXT NOT NULL DEFAULT '',
    content_json    TEXT,
    content_html    TEXT,
    variables_json  TEXT,
    sender_id       TEXT REFERENCES senders(id),
    status          TEXT NOT NULL DEFAULT 'active',
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
    bg_color        TEXT,
    transactional   INTEGER NOT NULL DEFAULT 0,
    footer_json     TEXT,                               -- per-template footer (one-time templates)
    UNIQUE(product_id, slug)
);

INSERT INTO templates_new
    (id, tenant_id, product_id, slug, name, kind, subject, content_json, content_html,
     variables_json, sender_id, status, created_at, updated_at, bg_color, transactional, footer_json)
SELECT
    id, tenant_id, product_id, slug, name, kind, subject, content_json, content_html,
    variables_json, sender_id, status, created_at, updated_at, bg_color, transactional, NULL
FROM templates;

DROP TABLE templates;
ALTER TABLE templates_new RENAME TO templates;

CREATE INDEX IF NOT EXISTS idx_templates_product ON templates(product_id);
CREATE INDEX IF NOT EXISTS idx_templates_tenant ON templates(tenant_id);
