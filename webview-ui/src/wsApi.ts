// WebSocket API — replaces VS Code postMessage bridge.
// In production, realtime is opt-in via VITE_REALTIME_WS_URL.
const WS_URL = isRealtimeEnabled() ? resolveWsUrl() : null;

let ws: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

export function isRealtimeEnabled(): boolean {
  return import.meta.env.DEV || Boolean(import.meta.env.VITE_REALTIME_WS_URL);
}

function resolveWsUrl(): string {
  const configured = import.meta.env.VITE_REALTIME_WS_URL as string | undefined;
  if (configured) {
    return configured;
  }

  if (import.meta.env.DEV) {
    return "ws://localhost:3456";
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}`;
}

export function connectWebSocket(): boolean {
  if (!WS_URL) {
    console.log("Realtime disabled: no websocket endpoint configured for this environment");
    return false;
  }

  ws = new WebSocket(WS_URL);

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
    reconnectTimer = setTimeout(() => {
      connectWebSocket();
    }, 2000);
  };

  ws.onerror = () => ws?.close();
  return true;
}

export function sendMessage(msg: unknown): void {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  }
}

export function cleanup(): void {
  if (reconnectTimer) clearTimeout(reconnectTimer);
  ws?.close();
}
