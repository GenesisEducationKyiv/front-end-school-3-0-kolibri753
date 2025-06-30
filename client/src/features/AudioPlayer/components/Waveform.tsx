import type { RefObject } from "react";
import { LoadingSpinner } from "@/components";

interface WaveformProps {
  audioRef: RefObject<HTMLAudioElement | null>;
  waveformRef: RefObject<HTMLDivElement | null>;
  isLoading?: boolean;
}

export function Waveform({
  audioRef,
  waveformRef,
  isLoading = false,
}: WaveformProps) {
  return (
    <div className="flex-1 min-w-0">
      {/* Main audio element for playback */}
      <audio ref={audioRef} preload="auto" className="hidden" />

      {/* Waveform container - always present */}
      <div className="relative w-full h-16 flex items-center">
        <div ref={waveformRef} className="w-full cursor-pointer h-16" />

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-100/80">
            <LoadingSpinner size="sm" />
            <span className="ml-2 text-sm text-base-content/70">
              Loading waveform...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
