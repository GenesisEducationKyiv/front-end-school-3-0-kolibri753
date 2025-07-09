import { X } from "lucide-react";

interface MinimizeButtonProps {
  onClick: () => void;
  ariaLabel?: string;
}

export function MinimizeButton({
  onClick,
  ariaLabel = "Minimize now playing widget",
}: MinimizeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="hidden sm:inline btn btn-xs btn-ghost opacity-60 hover:opacity-100 transition-opacity"
      aria-label={ariaLabel}
      type="button"
    >
      <X className="w-3 h-3" />
    </button>
  );
}
