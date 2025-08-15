import { useRef, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import type { RefObject } from "react";
import type { AudioTrack } from "@/stores";

interface UseWaveformProps {
  audioRef: RefObject<HTMLAudioElement | null>;
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
}

export const useWaveform = ({
  audioRef,
  currentTrack,
  isPlaying,
}: UseWaveformProps) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  const [isWaveformLoading, setIsWaveformLoading] = useState(false);

  // Handle WaveSurfer for visualization only
  useEffect(() => {
    if (!waveformRef.current || !currentTrack) {
      if (wsRef.current) {
        wsRef.current.destroy();
        wsRef.current = null;
      }
      setIsWaveformLoading(false);
      return;
    }

    // Start loading
    setIsWaveformLoading(true);

    // Destroy previous instance
    if (wsRef.current) {
      wsRef.current.destroy();
    }

    try {
      // Create new WaveSurfer for visualization ONLY
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        url: currentTrack.src,
        waveColor: "#94a3b8",
        progressColor: "#3b82f6",
        cursorColor: "#3b82f6",
        barWidth: 2,
        barRadius: 1,
        height: 64,
        normalize: true,
        interact: true,
        mediaControls: false,
      });

      // Handle loading states
      ws.on("ready", () => {
        setIsWaveformLoading(false);
      });

      ws.on("loading", () => {
        setIsWaveformLoading(true);
      });

      // Sync waveform seeking with main audio
      ws.on("interaction", (newTime: number) => {
        if (audioRef.current) {
          audioRef.current.currentTime = newTime;
        }
      });

      ws.on("error", () => {
        setIsWaveformLoading(false);
      });

      wsRef.current = ws;
    } catch {
      setIsWaveformLoading(false);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.destroy();
        wsRef.current = null;
      }
      setIsWaveformLoading(false);
    };
  }, [currentTrack, currentTrack?.src, currentTrack?.id, audioRef]);

  // Sync waveform progress with main audio
  useEffect(() => {
    if (!audioRef.current || !wsRef.current) return;

    const audioEl = audioRef.current;
    const ws = wsRef.current;

    const syncProgress = () => {
      if (audioEl.duration > 0) {
        const progress = audioEl.currentTime / audioEl.duration;
        ws.seekTo(progress);
      }
    };

    audioEl.addEventListener("timeupdate", syncProgress);
    audioEl.addEventListener("loadedmetadata", syncProgress);

    return () => {
      audioEl.removeEventListener("timeupdate", syncProgress);
      audioEl.removeEventListener("loadedmetadata", syncProgress);
    };
  }, [isPlaying, currentTrack, audioRef]);

  return { waveformRef, isWaveformLoading };
};
