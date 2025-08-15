export interface WebSocketCallbacks {
  onTrackChange: (trackName: string) => void;
  onConnectionChange: (isConnected: boolean) => void;
}

export type ConnectionState = "connecting" | "connected" | "disconnected";
