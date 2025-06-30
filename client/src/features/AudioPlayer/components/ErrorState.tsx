import { X } from "lucide-react";
import type { AudioTrack } from "@/stores";
import { TrackInfo } from "./TrackInfo";

interface ErrorStateProps {
  track: AudioTrack;
  onClose: () => void;
}

export function ErrorState({ track, onClose }: ErrorStateProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 p-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <TrackInfo track={track} />
          <div className="font-medium text-error ml-4">Error loading audio</div>
        </div>
        <button
          className="btn btn-sm btn-ghost"
          onClick={onClose}
          aria-label="Close player"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
