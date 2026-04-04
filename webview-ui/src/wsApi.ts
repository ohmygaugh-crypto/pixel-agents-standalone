// WebSocket API — replaces VS Code postMessage bridge.
// Allows portable host deployments (Netlify + external realtime) via env override.
const WS_URL = resolveWsUrl();

let ws: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
/** Outbound messages before the socket is OPEN (avoids dropping webviewReady). */
const pendingSends: string[] = [];

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

function flushPendingSends(): void {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  while (pendingSends.length > 0) {
    const raw = pendingSends.shift();
    if (raw !== undefined) ws.send(raw);
  }
}

export function connectWebSocket(): void {
  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log("Connected to pixel-agents server");
    flushPendingSends();
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
  const raw = JSON.stringify(msg);
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(raw);
  } else {
    pendingSends.push(raw);
  }
}

export function cleanup(): void {
  if (reconnectTimer) clearTimeout(reconnectTimer);
  ws?.close();
}
