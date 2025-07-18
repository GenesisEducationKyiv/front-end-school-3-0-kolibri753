import { useAudioProgress } from "@/stores";
import { formatTime } from "@/helpers";

export function TimeDisplay() {
  const { currentTime, duration } = useAudioProgress();

  return (
    <div className="flex items-center gap-2 text-sm text-base-content/70 flex-shrink-0 min-w-0">
      <span className="tabular-nums">{formatTime(currentTime)}</span>
      <span>/</span>
      <span className="tabular-nums">
        {duration > 0 ? formatTime(duration) : "--:--"}
      </span>
    </div>
  );
}
