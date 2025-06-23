import { X } from "lucide-react";
import { useAudioPlayer } from "@/stores";
import { useAudioElement, useWaveform } from "./hooks";
import {
  TrackInfo,
  PlaybackControls,
  Waveform,
  ErrorState,
  TimeDisplay,
} from "./components";

export function AudioPlayer() {
  const { currentTrack, isPlaying, togglePlay, stop } = useAudioPlayer();
  const { audioRef, error } = useAudioElement();
  const { waveformRef, isWaveformLoading } = useWaveform({
    audioRef,
    currentTrack,
    isPlaying,
  });

  if (!currentTrack) {
    return null;
  }

  if (error) {
    return <ErrorState track={currentTrack} onClose={stop} />;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 p-4 shadow-lg">
      <div className="flex flex-wrap md:flex-nowrap items-center gap-x-4 gap-y-2 max-w-6xl mx-auto">
        <div className="order-1 shrink-0">
          <TrackInfo track={currentTrack} />
        </div>
        <div className="order-1 ml-auto shrink-0">
          <PlaybackControls
            isPlaying={isPlaying}
            onTogglePlay={() => togglePlay()}
          />
        </div>

        <div className="order-2 w-full min-w-0">
          <Waveform
            audioRef={audioRef}
            waveformRef={waveformRef}
            isLoading={isWaveformLoading}
          />
        </div>

        <div className="order-3 shrink-0">
          <TimeDisplay />
        </div>
        <button
          className="order-3 ml-auto btn btn-sm btn-ghost shrink-0"
          onClick={stop}
          aria-label="Close player"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
