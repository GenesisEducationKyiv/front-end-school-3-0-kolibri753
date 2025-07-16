import { FastifyRequest } from "fastify";
import { WebSocket } from "ws";
import { nowPlayingService } from "../services/now-playing.service";
import { RouteHandler } from "../types";

export const handleNowPlayingWebSocket = async (
  socket: WebSocket,
  request: FastifyRequest
): Promise<void> => {
  nowPlayingService.handleClientConnection(socket);
};

export const getCurrentNowPlaying: RouteHandler = async (request, reply) => {
  return reply.send({
    currentTrack: nowPlayingService.getCurrentTrack(),
    clientCount: nowPlayingService.getClientCount(),
    timestamp: Date.now(),
  });
};
