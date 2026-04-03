# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Cyber Cafe is a Node.js/TypeScript web app with two sub-packages:
- **Backend** (`server/`) — Express + WebSocket server on port 3456. Watches `~/.claude/projects/` for Claude Code JSONL session files.
- **Frontend** (`webview-ui/`) — React 19 + Vite 7 SPA with a Canvas 2D pixel art game engine.

No databases, Docker, or external APIs required. State is ephemeral/in-memory with JSON persistence to `~/.pixel-agents/`.

### Running in development

The `npm run dev` script (using `concurrently`) has a known issue: the `dev:ui` sub-command runs `cd webview-ui && vite` which may fail in some cloud shells if local bins are not on PATH. **Workaround — start the two servers separately:**

```bash
# Terminal 1: Backend (hot-reload via tsx watch)
cd /workspace && npx tsx watch server/index.ts

# Terminal 2: Vite dev server (HMR)
cd /workspace/webview-ui && pnpm vite
```

- Backend: http://localhost:3456 (Express + WebSocket)
- Frontend dev: http://localhost:5173 (Vite)

### Build & production

```bash
npm run build        # builds server (esbuild) + UI (vite)
npm start            # serves bundled app at http://localhost:3456
```

### Lint

ESLint is configured only in `webview-ui/`:
```bash
cd webview-ui && pnpm run lint
```
Note: there are pre-existing lint errors (react-hooks/refs violations in several components). These are not regressions.

### TypeScript

```bash
cd /workspace && npx tsc --noEmit          # server types
cd /workspace/webview-ui && pnpm tsc -b    # frontend types
```

### Key directories

- `~/.claude/projects/` — watched for active Claude Code session JSONL files (must exist for the watcher)
- `~/.pixel-agents/` — persisted layout and seat assignment JSON files
- `webview-ui/public/assets/` — pixel art sprites, tiles, furniture catalog

### Dependencies

Use separate installs for root and frontend:

```bash
cd /workspace && npm install
cd /workspace/webview-ui && pnpm install
```

- Root currently uses npm lockfiles/scripts.
- Frontend (`webview-ui/`) is pnpm-managed (`pnpm-lock.yaml`).
