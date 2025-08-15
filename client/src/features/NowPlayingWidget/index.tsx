import { useState, useCallback } from "react";
import { useNowPlaying } from "./hooks";
import { Banner, FloatingButton } from "./components";

export function NowPlayingWidget() {
  const { trackName, connectionState } = useNowPlaying();
  const [isMinimized, setIsMinimized] = useState(false);

  const handleMinimize = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const handleExpand = useCallback(() => {
    setIsMinimized(false);
  }, []);

  if (!trackName && connectionState !== "connected") {
    return null;
  }

  if (isMinimized) {
    return <FloatingButton trackName={trackName} onClick={handleExpand} />;
  }

  return (
    <Banner
      trackName={trackName || "Loading..."}
      isConnected={connectionState === "connected"}
      onMinimize={handleMinimize}
    />
  );
}
