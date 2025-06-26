import { Radio } from "lucide-react";

interface FloatingButtonProps {
  trackName: string;
  onClick: () => void;
}

export function FloatingButton({ trackName, onClick }: FloatingButtonProps) {
  return (
    <aside
      className="hidden lg:block fixed top-20 right-4 z-50"
      aria-label="Minimized now playing"
    >
      <button
        onClick={onClick}
        className="w-12 h-12 rounded-full bg-primary/80 hover:bg-primary/90 animate-pulse hover:animate-none flex items-center justify-center text-white transition-all duration-200 shadow-lg hover:shadow-xl"
        title={`Now playing: ${trackName}`}
        aria-label={`Expand now playing widget. Currently playing: ${trackName}`}
        type="button"
      >
        <Radio className="w-5 h-5 drop-shadow-sm" />
      </button>
    </aside>
  );
}
