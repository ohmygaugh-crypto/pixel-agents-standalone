# Cyber Cafe

Where your AI agents code... and you chill in the neon glow.

Cyber Cafe is a standalone web app that visualizes Claude Code sessions as pixel characters in a cyberpunk management-sim world. Phase 0 establishes a PWA-ready foundation with a neon theme and scene-management scaffolding.

![Screenshot](webview-ui/public/Screenshot.jpg)

> Based on [pixel-agents](https://github.com/pablodelucca/pixel-agents) by Pablo De Lucca (MIT License), adapted here as a standalone browser app.

## Quick Start

```bash
npm install
cd webview-ui && pnpm install && cd ..
npm run build
npm start
```

Open `http://localhost:3456` in your browser.

## PWA Foundation (Phase 0)

- `vite-plugin-pwa` integrated in `webview-ui/vite.config.ts`
- Installable manifest configured for **Cyber Cafe**
- Service worker registration enabled via `virtual:pwa-register`
- Offline-first static caching for sprite/image/font assets
- App icons generated in `webview-ui/public/icons/`
- Netlify deploy skeleton documented in `netlify-deployment.md`

## Scene Foundation (Phase 0)

- Added `SceneManager` with `cafe` and `street` scene IDs.
- Café remains default and preserves all current behavior.
- Street scene is an MVP placeholder that already reuses shared state and supports round-trip transitions.

## Development

```bash
npm run dev
```

This runs the Node server and Vite dev server together.

### Cursor Cloud agent setup notes

- Development environment setup guidance is tracked in `AGENTS.md`.
- Preferred package managers in this repo:
  - frontend: `pnpm` (`webview-ui/`)
  - root/server scripts currently remain npm-based

## Netlify deployment (Phase 1 host target)

- `netlify.toml` is included for build/publish/SPA routing/PWA headers.
- Frontend realtime endpoint can be overridden with:
  - `VITE_REALTIME_WS_URL`
- See `netlify-deployment.md` for full setup details.

## Architecture Snapshot

- **Server** (`server/`): Express + WebSocket + transcript watcher.
- **UI** (`webview-ui/`): React + Canvas simulation + layout editor.
- **Scene layer** (`webview-ui/src/scenes/`): app-level scene manager for Café ↔ Street.
- **Audit notes**: `docs/cyber-cafe-audit.md` contains extension points for portable realtime + multi-tenancy migration.

## Auto-Launch with Claude Code

To start the server automatically when a Claude Code session begins, add a `SessionStart` hook to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "type": "command",
        "command": "/path/to/pixel-agents/scripts/cmux-hook.sh"
      }
    ]
  }
}
```

Then edit `scripts/cmux-hook.sh` and set `PIXEL_AGENTS_DIR` to your local clone path.

## Credits

- **[pixel-agents](https://github.com/pablodelucca/pixel-agents)** by Pablo De Lucca — original VS Code extension (MIT License)
- **[Office Interior Tileset](https://donarg.itch.io/office-interior-tileset-16x16)** by Donarg — pixel art furniture (purchased separately)

## License

MIT
