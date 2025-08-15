import { useRef, useEffect, useState } from "react";
import { useAudioTrack, useAudioProgress } from "@/stores";

export const useAudioElement = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [error, setError] = useState(false);
  const { currentTrack, isPlaying, pause } = useAudioTrack();
  const { setCurrentTime, setDuration } = useAudioProgress();

  // Handle the main audio element (for actual playback)
  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;

    setError(false);
    const audioEl = audioRef.current;

    const handleError = () => setError(true);
    const handleLoadedMetadata = () => {
      setDuration(audioEl.duration || 0);
    };
    const handleTimeUpdate = () => {
      setCurrentTime(audioEl.currentTime || 0);
    };
    const handleLoadStart = () => {
      setCurrentTime(0);
      setDuration(0);
    };
    const handleEnded = () => {
      if (audioEl) {
        audioEl.currentTime = 0;
      }
      pause();
    };

    audioEl.addEventListener("error", handleError);
    audioEl.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioEl.addEventListener("timeupdate", handleTimeUpdate);
    audioEl.addEventListener("loadstart", handleLoadStart);
    audioEl.addEventListener("ended", handleEnded);

    // Set source and load
    audioEl.src = currentTrack.src;
    audioEl.load();

    return () => {
      audioEl.removeEventListener("error", handleError);
      audioEl.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioEl.removeEventListener("timeupdate", handleTimeUpdate);
      audioEl.removeEventListener("loadstart", handleLoadStart);
      audioEl.removeEventListener("ended", handleEnded);
    };
  }, [
    currentTrack,
    currentTrack?.src,
    currentTrack?.id,
    setCurrentTime,
    setDuration,
    pause,
  ]);

  // Handle play/pause for main audio
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    const audioEl = audioRef.current;

    if (isPlaying && audioEl.paused) {
      audioEl.play().catch(() => {
        setError(true);
      });
    } else if (!isPlaying && !audioEl.paused) {
      audioEl.pause();
    }
  }, [isPlaying, currentTrack]);

  return { audioRef, error };
};
