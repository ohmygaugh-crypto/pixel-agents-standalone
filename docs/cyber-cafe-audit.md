# Cyber Cafe Architecture Audit (Phase 0)

This audit captures the current extension points in the standalone app to support the Cyber Cafe roadmap (PWA + scenes + host-portable multi-tenancy).

## Current module map

- `server/index.ts`
  - Node runtime entrypoint.
  - Owns HTTP static serving, WebSocket hub, in-memory agent state, transcript watcher wiring, and local persistence.
- `server/watcher.ts`
  - File-based transcript ingestion (`~/.claude/projects`) and line event emission.
- `server/parser.ts`
  - Transcript line parsing and translation to activity/status events.
- `server/types.ts`
  - Shared server-side wire and state types.
- `server/assetLoader.ts`
  - Disk asset loading + conversion to sprite payloads.
- `webview-ui/src/wsApi.ts`
  - Browser WebSocket client transport; dispatches incoming messages via `window` message events.
- `webview-ui/src/vscodeApi.ts`
  - Minimal host bridge shim (`postMessage`).
- `webview-ui/src/hooks/useExtensionMessages.ts`
  - Main client message handling and synchronization into `OfficeState`.
- `webview-ui/src/office/engine/*`
  - Simulation core (characters, movement, rendering state).
- `webview-ui/src/App.tsx`
  - UI shell + overlays + editor controls around office canvas.

## Ranked extension points (impact vs complexity)

1. **Host bridge contract** (high impact, low complexity)
   - Wrap transport details behind a typed interface so local WS and Netlify/Supabase/PartyKit feeds can be swapped without touching scene UI logic.
2. **Transcript source abstraction** (high impact, medium complexity)
   - Isolate file-tail ingestion from parser/event pipeline to support hosted WebSocket ingestion later.
3. **Scene manager layer** (high impact, low-medium complexity)
   - Add app-level scene routing (`cafe`/`street`) with shared world state.
4. **Server split: realtime hub vs ingestion vs persistence** (high impact, medium-high complexity)
   - Prepare for managed realtime fanout by separating concerns currently in `server/index.ts`.
5. **Tenant-aware fanout keys** (high impact, medium complexity)
   - Introduce room/tenant IDs for connection grouping and message routing.
6. **Theme tokenization** (medium-high impact, low complexity)
   - Promote cyberpunk skinning through centralized CSS variables and scene palettes.
7. **Asset-pack indirection** (medium impact, medium complexity)
   - Move from hardcoded local asset paths toward manifest-driven sources (Supabase Storage/CDN-ready).
8. **Protocol cleanup for unsupported messages** (medium impact, low complexity)
   - Align server/client message capabilities and remove implicit VS Code assumptions.
9. **Shared client/server message schema strategy** (medium impact, medium complexity)
   - Prevent protocol drift by centralizing schema/type definitions.

## Low-risk first refactors

- Add a scene manager while keeping current office behavior untouched (cafe remains default).
- Add host bridge interface wrappers for current WebSocket implementation.
- Extract layout/seats persistence from server entrypoint into a dedicated storage module.
- Introduce optional tenant IDs in connection lifecycle and fanout paths.

## Coupling hotspots to address before host migration

- Monolithic `server/index.ts` mixing runtime, state, persistence, and fanout.
- Heavy Node filesystem dependency for ingestion and persistence.
- Global broadcast model without tenant isolation.
- Transcript state fields tied to local file offsets.
- Large JSON sprite payloads sent during bootstrap without caching indirection.
