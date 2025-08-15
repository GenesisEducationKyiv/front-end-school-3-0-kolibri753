import { WebSocket } from "ws";
import { getTracks } from "../utils/db";
import { Track } from "../types";

interface NowPlayingMessage {
  trackName: string;
  timestamp: number;
}

export class NowPlayingService {
  private currentTrack: Track | null = null;
  private clients: Set<WebSocket> = new Set();
  private trackList: Track[] = [];
  private readonly UPDATE_INTERVAL_MS = 2000;
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.initialize();
  }

  /**
   * Initializes the service by caching track data and starting interval updates.
   */
  private async initialize() {
    await this.cacheTracks();
    this.startBroadcasting();
  }

  /**
   * Caches the tracks from the database.
   */
  public async cacheTracks() {
    const { tracks } = await getTracks({ limit: 1000 });
    this.trackList = tracks;
  }

  /**
   * Starts the interval for broadcasting now-playing updates.
   */
  private startBroadcasting() {
    this.intervalId = setInterval(() => {
      this.pickAndBroadcastTrack();
    }, this.UPDATE_INTERVAL_MS);
  }

  /**
   * Picks a random track from cache and broadcasts it if different from the current.
   */
  private pickAndBroadcastTrack() {
    if (this.trackList.length === 0 || this.clients.size === 0) return;

    const randomTrack =
      this.trackList[Math.floor(Math.random() * this.trackList.length)];

    if (!this.currentTrack || randomTrack.id !== this.currentTrack.id) {
      this.currentTrack = randomTrack;
      this.broadcast({
        trackName: randomTrack.title,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Adds a new client WebSocket connection.
   */
  public addClient(ws: WebSocket) {
    this.clients.add(ws);
    ws.on("close", () => this.removeClient(ws));
    ws.on("error", () => this.removeClient(ws));

    if (this.currentTrack) {
      this.sendToClient(ws, {
        trackName: this.currentTrack.title,
        timestamp: Date.now(),
      });
    }

    console.log(`Client connected. Total clients: ${this.clients.size}`);
  }

  /**
   * Removes a WebSocket client.
   */
  public removeClient(ws: WebSocket) {
    this.clients.delete(ws);
    console.log(`Client disconnected. Total clients: ${this.clients.size}`);
  }

  /**
   * Broadcasts a message to all connected clients.
   */
  private broadcast(message: NowPlayingMessage) {
    const payload = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      } else {
        this.clients.delete(client);
      }
    });
  }

  /**
   * Sends a message to a single client.
   */
  private sendToClient(ws: WebSocket, message: NowPlayingMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  /**
   * Gets the current track name.
   */
  public getCurrentTrack(): string {
    return this.currentTrack ? this.currentTrack.title : "";
  }

  /**
   * Gets the number of currently connected clients.
   */
  public getClientCount(): number {
    return this.clients.size;
  }

  /**
   * Gracefully shuts down the service.
   */
  public shutdown() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.close(1000, "Service shutdown");
      }
    });

    this.clients.clear();
    console.log("Now-playing service shutdown complete");
  }

  /**
   * Handle a new client connection and remove it on close or error
   */
  public handleClientConnection(ws: WebSocket) {
    this.addClient(ws);

    ws.on("close", () => this.removeClient(ws));
    ws.on("error", () => this.removeClient(ws));
  }
}

export const nowPlayingService = new NowPlayingService();
