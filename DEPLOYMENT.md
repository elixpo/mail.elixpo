# Deploying mail.elixpo (Elixpo Mails)

Two deployables:
1. **Pages app** — the dashboard + `/v1` API (Next.js via `@cloudflare/next-on-pages`).
   Cloudflare Pages project **`elixpo-mail`** (created) → custom domain **mails.elixpo.com**.
2. **SMTP sender Worker** — `workers/smtp-sender` (the only piece that opens raw
   TCP; Pages edge routes can't). Deploys separately as its own Worker.

Custom domain is **`mails.elixpo.com`** (confirmed). It's locked into `deploy.sh`
as `APP_URL` — injected as `NEXT_PUBLIC_APP_URL` at build time (overriding the
localhost value in `.env.local`) and pushed as a runtime Pages var.

> **TL;DR** — `./deploy.sh worker` → confirm `SMTP_SENDER_LIVE_URL` in `.env.local`
> → `./deploy.sh secrets` → `./deploy.sh build deploy` → add the custom domain.

---

## 0. One-time facts

- Pages project: `elixpo-mail` (prod branch `main`) → `elixpo-mail.pages.dev`.
- D1 `elixpo_mail` (`8a56fe2c-…`) and KV (`8321b41a…`) bindings are already in
  `wrangler.toml` under `[env.production]`.
- **Prod and dev currently share the same D1 instance.** Migrations are already
  applied (through `0006`). If you want isolation, create a separate prod D1 and
  swap the id — but then re-run all migrations and note that encrypted data
  (sender app passwords, product secrets) won't carry over.

---

Everything below is automated by **`./deploy.sh`** (reads `.env.local`). The two
prod values that differ from dev live in `.env.local` too: `SMTP_SENDER_LIVE_URL`
(the deployed Worker) and the `APP_URL` locked in the script. The manual commands
are shown for context.

## 1. Deploy the SMTP sender Worker first

The Pages app needs a reachable Worker, so deploy this first.

```bash
./deploy.sh worker
# (= cd workers/smtp-sender && npx wrangler deploy)
```

Make sure **`SMTP_SENDER_LIVE_URL`** in `.env.local` matches the deployed Worker URL
(currently `https://elixpo-mail-smtp-sender.ayushbhatt633.workers.dev`). `./deploy.sh
secrets` pushes that as the runtime `SMTP_SENDER_URL` (never the dev localhost) and
sets the Worker's `SMTP_SENDER_SECRET`. Optionally put the Worker behind an Access
policy so only the Pages app can call it.

---

## 2. Pages environment variables (production)

`./deploy.sh secrets` pushes all of these from `.env.local` — you
normally won't set them by hand. The table documents what gets pushed. (Manual
equivalent: `npx wrangler pages secret put <NAME> --project-name elixpo-mail`.)
**Do not commit secrets.**

### Public `NEXT_PUBLIC_*` (baked at build **and** pushed as runtime vars)
| Var | Production value |
|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://mails.elixpo.com` (script overrides the localhost in `.env.local`) |
| `NEXT_PUBLIC_ACCOUNTS_URL` | `https://accounts.elixpo.com` |
| `NEXT_PUBLIC_ELIXPO_CLIENT_ID` | (the Elixpo Accounts client id) |

> Why both: `env.ts` reads these via **dynamic** `getEnv()`, which Next does NOT
> inline — so besides being baked into the client bundle at build time, they must
> exist as runtime Pages vars. `deploy.sh` pushes all three (with the prod
> `APP_URL`, not localhost). Other `NEXT_PUBLIC_*` are build-time only.

### Secrets (runtime — set as encrypted secrets)
| Var | Notes |
|---|---|
| `ELIXPO_CLIENT_SECRET` | Elixpo Accounts OAuth secret |
| `ELIXPO_MAIL_SESSION_SECRET` | session signing — `signSession` throws without it |
| `ELIXPO_MAIL_ENCRYPTION_KEY` | **MUST equal the dev key** while sharing the D1 instance, or stored sender passwords / product secrets won't decrypt |
| `ELIXPO_MAIL_OWNER_EMAIL` | `elixpoo@gmail.com` (claims the first-party tenant) |
| `ACCOUNTS_WEBHOOK_SECRET` | account-revoked webhook verification |
| `SMTP_SENDER_URL` | pushed from `SMTP_SENDER_LIVE_URL` in `.env.local` (NOT the dev localhost) |
| `SMTP_SENDER_SECRET` | must match the Worker's secret |
| `SMTP_CORE_EMAIL` | first-party sender address |
| `SMTP_CORE_EMAIL_PASS` | first-party app password |

> `NEXT_PUBLIC_*` are inlined at **build time** — set them before/at build, then
> rebuild if you change them.

**Do NOT set in Pages:** `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_API_TOKEN` /
`CLOUDFLARE_DATABASE_ID` — those only drive the local-dev REST fallback in
`d1-client.ts`. In production the `DB` binding is used directly; shipping an API
token to the edge would be a needless secret.

**Future (image upload — when lixeditor 2.7.0 lands):**
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

---

## 3. Bindings (D1 / KV)

`wrangler pages deploy` reads `[env.production]` from `wrangler.toml`, so `DB` and
`KV` bind automatically. Verify after first deploy under
Settings → Functions → Bindings. (The `SEND_QUEUE` producer is declared but not
yet used in code — wire it when async delivery lands.)

---

## 4. Build & deploy the Pages app

```bash
./deploy.sh build deploy
# build  = NEXT_PUBLIC_APP_URL=https://mails.elixpo.com npm run pages:build
# deploy = wrangler pages deploy .vercel/output/static --project-name elixpo-mail --branch main
```

First deploy makes the app live at `elixpo-mail.pages.dev`. (`./deploy.sh` with no
args does secrets + build + deploy; `./deploy.sh all` also deploys the Worker.)

---

## 5. Custom domain

In Pages → `elixpo-mail` → Custom domains → add **`mails.elixpo.com`** (CNAME to
`elixpo-mail.pages.dev`; Cloudflare manages it since the zone is on the account).

---

## 6. Wire OAuth callback (Elixpo Accounts)

Register the production redirect URI on the Elixpo Accounts app:
```
https://mails.elixpo.com/api/auth/callback
```
and ensure `https://mails.elixpo.com` is an allowed origin. Without this, prod
sign-in fails even though it works on localhost.

---

## 7. Post-deploy smoke test

1. Visit `https://mails.elixpo.com` → sign in via Elixpo Accounts.
2. Senders → add a sender → **Send test** → expect a real inbox delivery
   (exercises the deployed SMTP Worker).
3. Products → create → copy the secret (shown once).
4. Templates → create → Webhooks → create an event → sign a request with the
   product secret and POST to `https://mails.elixpo.com/v1/hooks/<key>`
   (see the webhook "Usage" snippet) → check **Logs** for a `sent` row.

---

## Deferred before "commercial-grade"
- Async delivery + retries (wire `SEND_QUEUE`; today the trigger sends synchronously).
- Rate limiting / per-product quotas; KV-backed replay guard.
- Billing/metering (placeholder today).
- Suppression list / bounce tracking; `List-Unsubscribe`.
- See the gap analysis discussed in-session.
