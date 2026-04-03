# Cloudflare Pages Deployment (Phase 0 Skeleton)

This repo now includes a PWA-ready frontend in `webview-ui/` suitable for an initial Cloudflare Pages deployment.

## 1) Create a Pages project

- Framework preset: **None**
- Build command:

```bash
cd webview-ui && pnpm install && pnpm run build
```

- Build output directory:

```bash
../dist/public
```

## 2) Runtime settings

- Node.js: current LTS or newer (Node 22 works in this repo)
- No environment variables are required for the Phase 0 static deploy.

## 3) Included Pages helpers

- `webview-ui/public/_headers`
  - Prevents stale caching for service worker files.
- `webview-ui/public/_redirects`
  - Routes SPA paths back to `index.html`.

## 4) Notes

- This deployment is frontend-only and does not yet include Durable Objects or D1/R2.
- Current realtime dev flow still uses the local Node server (`server/index.ts`).
