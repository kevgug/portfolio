/**
 * Essay Tracker - Connects to the dev server's WebSocket to report which essays are being viewed.
 * This enables smart reloading: only reload when a changed essay is actually open in the browser.
 *
 * NOTE: This module only runs in development mode (npm run dev).
 */

// Early exit for production - no WebSocket tracking needed
const isDev = import.meta.env.DEV;

const WS_PORT = 3001;
let ws: WebSocket | null = null;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

// Track essays being viewed in this browser tab
const viewedEssays = new Set<string>();

// Queue messages if WebSocket isn't ready yet
const messageQueue: Array<{ type: string; slug: string }> = [];

function connect() {
  if (!isDev) return;
  if (typeof window === "undefined") return;
  if (ws && ws.readyState === WebSocket.OPEN) return;

  try {
    ws = new WebSocket(`ws://localhost:${WS_PORT}`);

    ws.onopen = () => {
      // Re-send any essays we were viewing before reconnect
      for (const slug of viewedEssays) {
        ws?.send(JSON.stringify({ type: "view", slug }));
      }

      // Send any queued messages
      while (messageQueue.length > 0) {
        const msg = messageQueue.shift();
        if (msg) {
          ws?.send(JSON.stringify(msg));
        }
      }
    };

    ws.onclose = () => {
      ws = null;

      // Attempt to reconnect after a delay
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(connect, 2000);
    };

    ws.onerror = () => {
      // Silent fail - this is expected if dev server isn't running
      ws?.close();
    };
  } catch {
    // Connection failed, will retry on reconnect timeout
  }
}

function sendMessage(type: string, slug: string) {
  if (!isDev) return;

  const message = { type, slug };

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    messageQueue.push(message);
    connect();
  }
}

/**
 * Report that an essay is now being viewed in this tab (dev mode only)
 */
export function viewEssay(slug: string) {
  if (!isDev || !slug) return;

  viewedEssays.add(slug);
  sendMessage("view", slug);
}

/**
 * Report that an essay is no longer being viewed in this tab (dev mode only)
 */
export function unviewEssay(slug: string) {
  if (!isDev || !slug) return;

  viewedEssays.delete(slug);
  sendMessage("unview", slug);
}

/**
 * Initialize the essay tracker (dev mode only, call once on app start)
 */
export function initEssayTracker() {
  if (!isDev) return;
  if (typeof window === "undefined") return;

  connect();

  // Clean up on page unload
  window.addEventListener("beforeunload", () => {
    for (const slug of viewedEssays) {
      sendMessage("unview", slug);
    }
  });
}
