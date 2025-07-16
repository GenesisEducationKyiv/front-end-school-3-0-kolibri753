import { Play, Pause, X } from "lucide-react";
import { useAudioTrack, type AudioTrack } from "@/stores";
import { getValidClassNames } from "@/helpers";

interface TrackPlayerProps {
  track: AudioTrack;
  onRemove?: () => void;
  showRemove?: boolean;
}

export function TrackPlayer({
  track,
  onRemove,
  showRemove = false,
}: TrackPlayerProps) {
  const { togglePlay, isCurrentTrack, isTrackPlaying } = useAudioTrack();

  const isCurrent = isCurrentTrack(track.id);
  const isPlaying = isTrackPlaying(track.id);

  const handleTogglePlay = () => {
    togglePlay(track);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleTogglePlay}
        data-testid={
          isPlaying ? `pause-button-${track.id}` : `play-button-${track.id}`
        }
        className={getValidClassNames(
          `btn btn-xs ${isCurrent ? "btn-primary" : "btn-outline"}`
        )}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>

      {showRemove && (
        <button
          type="button"
          className="btn btn-xs btn-circle btn-error btn-ghost"
          onClick={onRemove}
          data-testid={`delete-track-audio-${track.id}`}
          aria-label={`Remove audio from ${track.title}`}
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
