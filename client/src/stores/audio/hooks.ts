import { useAudioStore } from "./store";
import type { AudioTrack } from "./types";

export const useAudioPlayer = () => {
  const store = useAudioStore();

  const togglePlay = (track?: AudioTrack) => {
    if (!store.currentTrack && !track) return;
    if (track) {
      if (store.currentTrack?.id === track.id) {
        if (store.isPlaying) {
          store.pause();
        } else {
          store.resume();
        }
      } else {
        store.play(track);
      }
    } else {
      if (store.isPlaying) {
        store.pause();
      } else {
        store.resume();
      }
    }
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
