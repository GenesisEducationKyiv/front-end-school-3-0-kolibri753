import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import type { AudioTrack, AudioState, AudioActions } from "./types";

interface AudioStore extends AudioState, AudioActions {}

const initialState: AudioState = {
  currentTrack: null,
  isPlaying: false,
  isLoading: false,
  error: null,
  duration: 0,
  currentTime: 0,
};

export const useAudioStore = create<AudioStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,

      play: (track: AudioTrack) => {
        set({
          currentTrack: track,
          isPlaying: true,
          isLoading: true,
          error: null,
          currentTime: 0, // Always reset to start for new tracks
          duration: 0, // Reset duration, will be set when audio loads
        });
      },

      pause: () => {
        set({ isPlaying: false });
      },

      resume: () => {
        const { currentTrack } = get();
        if (currentTrack) {
          set({ isPlaying: true, error: null });
        }
      },

      stop: () => set(initialState),

      seek: (time: number) => {
        const { duration, currentTrack } = get();
        if (!currentTrack || duration === 0) return;

        const clampedTime = Math.max(0, Math.min(time, duration));
        set({ currentTime: clampedTime });
      },

      setCurrentTime: (currentTime: number) => {
        set({ currentTime });
      },

      setDuration: (duration: number) => {
        set({ duration, isLoading: false });
      },

      setLoading: (isLoading: boolean) => set({ isLoading }),

      setError: (error: string | null) => {
        set({
          error,
          isLoading: false,
          isPlaying: false,
        });
      },
    })),
    { name: "audio-store" }
  )
);
