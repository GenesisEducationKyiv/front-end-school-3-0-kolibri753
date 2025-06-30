import { Play, Pause } from "lucide-react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export function PlaybackControls({
  isPlaying,
  onTogglePlay,
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <button
        type="button"
        onClick={onTogglePlay}
        className="btn btn-sm btn-primary"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
    </div>
  );
}
