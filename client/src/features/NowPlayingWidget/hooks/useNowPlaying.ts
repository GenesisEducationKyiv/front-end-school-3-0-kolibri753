import { useState, useEffect, useRef } from "react";
import { createWebSocketConnection } from "../services/websocket";
import { CONNECT_DELAY } from "../constants";
import type { ConnectionState } from "../types";

export function useNowPlaying() {
  const [trackName, setTrackName] = useState("");
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("connecting");

  const connectionRef = useRef<ReturnType<
    typeof createWebSocketConnection
  > | null>(null);

  useEffect(() => {
    const connection = createWebSocketConnection({
      onTrackChange: setTrackName,
      onConnectionChange: (connected) =>
        setConnectionState(connected ? "connected" : "disconnected"),
    });

    connectionRef.current = connection;

    const timeoutId = setTimeout(() => connection.connect(), CONNECT_DELAY);

    return () => {
      clearTimeout(timeoutId);
      connection.disconnect();
      connectionRef.current = null;
    };
  }, []);

  return { trackName, connectionState };
}
