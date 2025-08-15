import { WS_CONFIG } from "../constants";
import type { WebSocketCallbacks } from "../types";

export function createWebSocketConnection(callbacks: WebSocketCallbacks) {
  let ws: WebSocket | null = null;
  let reconnectTimeout: NodeJS.Timeout | null = null;
  let attempts = 0;

  const connect = () => {
    callbacks.onConnectionChange(false);
    ws = new WebSocket(WS_CONFIG.URL);

    ws.onopen = () => {
      callbacks.onConnectionChange(true);
      attempts = 0;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.trackName) callbacks.onTrackChange(data.trackName);
      } catch (error) {
        console.error("WebSocket message parse error:", error);
      }
    };

    ws.onclose = (event) => {
      callbacks.onConnectionChange(false);
      if (event.code !== WS_CONFIG.CLOSE_NORMAL) scheduleReconnect();
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      callbacks.onConnectionChange(false);
    };
  };

  const scheduleReconnect = () => {
    if (attempts >= WS_CONFIG.MAX_ATTEMPTS) {
      console.error("WebSocket reconnection limit reached");
      return;
    }
    const delay = Math.min(
      WS_CONFIG.BASE_DELAY * 2 ** attempts++,
      WS_CONFIG.MAX_DELAY
    );
    reconnectTimeout = setTimeout(connect, delay);
  };

  const disconnect = () => {
    clearTimeout(reconnectTimeout!);
    ws?.close(WS_CONFIG.CLOSE_NORMAL);
    ws = null;
    callbacks.onConnectionChange(false);
  };

  return { connect, disconnect };
}
