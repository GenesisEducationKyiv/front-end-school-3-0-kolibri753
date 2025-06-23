import type { AudioTrack } from "@/stores";

interface TrackInfoProps {
  track: AudioTrack;
}

export function TrackInfo({ track }: TrackInfoProps) {
  return (
    <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
      {track.cover && (
        <img
          src={track.cover}
          alt="cover"
          className="w-12 h-12 object-cover rounded"
        />
      )}
      <div className="min-w-0">
        <div className="font-medium truncate">{track.title}</div>
        <div className="text-sm text-base-content/70 truncate">
          {track.artist}
        </div>
      </div>
    </div>
  );
}
