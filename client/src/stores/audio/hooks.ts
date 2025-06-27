import { useAudioStore } from "./store";
import type { AudioTrack } from "./types";

export const useAudioTrack = () => {
  const store = useAudioStore();

  const togglePlay = (track?: AudioTrack) => {
    if (!track && !store.currentTrack) return;

    if (track) {
      const isSameTrack = store.currentTrack?.id === track.id;

      if (isSameTrack) {
        store.isPlaying ? store.pause() : store.resume();
      } else {
        store.play(track);
      }
      return;
    }

    store.isPlaying ? store.pause() : store.resume();
  };

  const isCurrentTrack = (trackId: string) => {
    return store.currentTrack?.id === trackId;
  };

  const isTrackPlaying = (trackId: string) => {
    return isCurrentTrack(trackId) && store.isPlaying;
  };

  return {
    currentTrack: store.currentTrack,
    isPlaying: store.isPlaying,
    isLoading: store.isLoading,
    error: store.error,
    play: store.play,
    pause: store.pause,
    resume: store.resume,
    stop: store.stop,
    togglePlay,
    isCurrentTrack,
    isTrackPlaying,
  };
};

export const useAudioProgress = () => {
  const currentTime = useAudioStore((state) => state.currentTime);
  const duration = useAudioStore((state) => state.duration);
  const seek = useAudioStore((state) => state.seek);
  const setCurrentTime = useAudioStore((state) => state.setCurrentTime);
  const setDuration = useAudioStore((state) => state.setDuration);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return {
    currentTime,
    duration,
    progress,
    seek,
    setCurrentTime,
    setDuration,
  };
};

export const useAudioControls = () => {
  const setLoading = useAudioStore((state) => state.setLoading);
  const setError = useAudioStore((state) => state.setError);

  return {
    setLoading,
    setError,
  };
};
