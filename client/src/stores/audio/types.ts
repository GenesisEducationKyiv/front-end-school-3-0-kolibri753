export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover?: string;
}

export interface AudioState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  duration: number;
  currentTime: number;
}

export interface AudioActions {
  play: (track: AudioTrack) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
