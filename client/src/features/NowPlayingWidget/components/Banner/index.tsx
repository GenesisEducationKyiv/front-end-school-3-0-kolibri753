import { MinimizeButton } from "./MinimizeButton";
import { StatusIndicator } from "./StatusIndicator";
import { TrackInfo } from "./TrackInfo";

interface BannerProps {
  trackName: string;
  isConnected: boolean;
  onMinimize: () => void;
}

export function Banner({ trackName, isConnected, onMinimize }: BannerProps) {
  return (
    <div
      className="flex items-center gap-3 px-2 py-2 bg-gradient-to-r from-base-200/95 to-base-300/90 backdrop-blur-sm rounded-lg w-full sm:w-96 sm:max-w-xl transition-all duration-200"
      role="banner"
      aria-label={`Now playing: ${trackName}`}
    >
      <StatusIndicator isConnected={isConnected} />
      <TrackInfo trackName={trackName} />
      <MinimizeButton onClick={onMinimize} />
    </div>
  );
}
