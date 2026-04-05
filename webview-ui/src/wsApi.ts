// WebSocket API — replaces VS Code postMessage bridge.
// Realtime is opt-in in production via VITE_REALTIME_WS_URL.

let ws: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

function getConfiguredWsUrl(): string | null {
  const configured = import.meta.env.VITE_REALTIME_WS_URL as string | undefined;
  const trimmed = configured?.trim();
  return trimmed ? trimmed : null;
}

export function isRealtimeEnabled(): boolean {
  return import.meta.env.DEV || Boolean(getConfiguredWsUrl());
}

function resolveWsUrl(): string {
  const configured = getConfiguredWsUrl();
  if (configured) return configured;

  // Dev keeps the local backend default for the standalone workflow.
  if (import.meta.env.DEV) {
    return "ws://localhost:3456";
  }

  // Production only reaches here when explicitly configured.
  return "ws://localhost:3456";
}

export function connectWebSocket(): void {
  if (!isRealtimeEnabled()) {
    console.info("[Webview] Realtime disabled (no VITE_REALTIME_WS_URL in production); booting local-only mode.");
    return;
  }

  ws = new WebSocket(resolveWsUrl());

  ws.onopen = () => {
    console.log("Connected to pixel-agents server");
    ws?.send(JSON.stringify({ type: "webviewReady" }));
  };

  ws.onmessage = (event) => {
    // Dispatch as window message to match upstream useExtensionMessages hook
    const data = JSON.parse(event.data);
    window.dispatchEvent(new MessageEvent("message", { data }));
  };

  ws.onclose = () => {
    console.log("Disconnected, reconnecting in 2s...");
    reconnectTimer = setTimeout(connectWebSocket, 2000);
  };

  ws.onerror = () => ws?.close();
}

export function sendMessage(msg: unknown): void {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  }
}

export function cleanup(): void {
  if (reconnectTimer) clearTimeout(reconnectTimer);
  ws?.close();
  ws = null;
}
