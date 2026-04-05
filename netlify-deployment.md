# Netlify Deployment (Phase 1 Host Target)

Cyber Cafe's frontend PWA is host-portable and now configured for a Netlify-first deployment path.

## 1) Connect repository

- In Netlify, create a new site from this repository branch.
- Netlify will auto-detect `netlify.toml`.

## 2) Build settings (from `netlify.toml`)

- Build command:

```bash
corepack enable && cd webview-ui && pnpm install --frozen-lockfile && pnpm run build
```

- Publish directory:

```bash
dist/public
```

- Node version:
  - `22`

## 3) SPA + PWA behavior

The config includes:

- SPA fallback redirect:
  - `/* -> /index.html (200)`
- Service worker cache-control headers:
  - `/sw.js` and `/workbox-*.js` set to `no-cache`

## 4) Realtime backend wiring

The frontend now supports an explicit WS endpoint env var:

- `VITE_REALTIME_WS_URL`

Examples:

- Local Node backend:
  - `ws://localhost:3456`
- Hosted realtime service:
  - `wss://your-realtime-host.example.com`

If this variable is not set, the app behavior is:

- dev: `ws://localhost:3456`
- prod: realtime is disabled; the app boots in local-only mode (no infinite loading screen)

## 5) Recommended Phase 1 realtime options

To replace Cloudflare Durable Objects while staying Netlify-first:

- Netlify Functions + Supabase Realtime
- Netlify Functions + PartyKit

Both approaches are compatible with the current `VITE_REALTIME_WS_URL` override.
