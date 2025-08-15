interface TrackInfoProps {
  trackName: string;
}

export function TrackInfo({ trackName }: TrackInfoProps) {
  return (
    <div className="min-w-0 flex flex-1 items-center gap-2 flex-row">
      <span className="hidden sm:inline text-xs text-base-content/70">
        Now:
      </span>
      <strong
        className="text-sm font-semibold truncate text-base-content"
        title={trackName}
      >
        «{trackName}»
      </strong>
    </div>
  );
}
