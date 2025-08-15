export const getWsUrl = (): string => {
  const envUrl = import.meta.env.VITE_WS_URL?.trim();
  if (envUrl) return envUrl;

  const { protocol, hostname } = window.location;
  const wsProtocol = protocol === "https:" ? "wss:" : "ws:";

  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
  const port = isLocal ? ":8000" : "";

  return `${wsProtocol}//${hostname}${port}/api/ws/now-playing`;
};
