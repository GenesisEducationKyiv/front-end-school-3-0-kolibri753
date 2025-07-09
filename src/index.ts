import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import websocket from "@fastify/websocket";
import path from "path";
import routes from "./routes";
import { initializeDb } from "./utils/db";
import { nowPlayingService } from "./services/now-playing.service";
import config from "./config";

async function start() {
  try {
    // Log configuration on startup
    console.log(`Starting server in ${config.server.env} mode`);

    // Initialize database
    await initializeDb();

    const fastify = Fastify({
      logger: {
        level: config.logger.level,
        transport: config.isDevelopment
          ? {
              target: "pino-pretty",
              options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
              },
            }
          : undefined,
      },
    });

    // Register plugins
    await fastify.register(cors, {
      origin: config.cors.origin,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });

    await fastify.register(multipart, {
      limits: {
        fileSize: config.upload.maxFileSize,
      },
    });

    // Register WebSocket support
    await fastify.register(websocket, {
      options: {
        maxPayload: 1048576, // 1MB
        verifyClient: () => {
          // Optional: Add authentication/authorization logic here
          return true;
        },
      },
    });

    // Serve static files (uploads)
    await fastify.register(fastifyStatic, {
      root: config.storage.uploadsDir,
      prefix: "/api/files/",
      decorateReply: false,
    });

    // Register Swagger
    await fastify.register(swagger, {
      openapi: {
        info: {
          title: "Music Tracks API",
          description:
            "API for managing music tracks with live now-playing feature",
          version: "1.0.0",
        },
      },
    });

    // Register Swagger UI
    await fastify.register(swaggerUi, {
      routePrefix: "/documentation",
      uiConfig: {
        docExpansion: "list",
        deepLinking: true,
      },
    });

    // Register routes
    await fastify.register(routes);

    // Graceful shutdown handling
    const gracefulShutdown = async (signal: string) => {
      console.log(`Received ${signal}, shutting down gracefully...`);

      // Shutdown now-playing service
      nowPlayingService.shutdown();

      // Close Fastify server
      await fastify.close();

      console.log("Server shutdown complete");
      process.exit(0);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Start server
    await fastify.listen({
      port: config.server.port,
      host: config.server.host,
    });

    console.log(
      `Server is running on http://${config.server.host}:${config.server.port}`
    );
    console.log(
      `Swagger documentation available on http://${config.server.host}:${config.server.port}/documentation`
    );
    console.log(
      `WebSocket now-playing available on ws://${config.server.host}:${config.server.port}/api/ws/now-playing`
    );
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

start();
