import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import {
  Sun,
  Moon,
  X,
  Play,
  Pause,
  Edit2,
  Trash2,
  Radio,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { LoadingSpinner } from "@/components";
import { getValidClassNames } from "@/helpers";

const Button = ({
  children,
  variant = undefined,
  size = "default",
  outline = false,
  ghost = false,
  circle = false,
  square = false,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "error" | "outline" | "ghost";
  size?: "xs" | "sm" | "default";
  outline?: boolean;
  ghost?: boolean;
  circle?: boolean;
  square?: boolean;
}) => {
  const classes = getValidClassNames(
    "btn",
    {
      "btn-primary": variant === "primary",
      "btn-error": variant === "error",
      "btn-outline": variant === "outline" || outline,
      "btn-ghost": variant === "ghost" || ghost,
      "btn-xs": size === "xs",
      "btn-sm": size === "sm",
      "btn-circle": circle,
      "btn-square": square,
    },
    className
  );

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
};

const meta: Meta<typeof Button> = {
  title: "Design System/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "error", "outline", "ghost"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default"],
    },
    outline: { control: "boolean" },
    ghost: { control: "boolean" },
    circle: { control: "boolean" },
    square: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
    onClick: { action: "clicked" },
  },
  args: {
    onClick: fn(),
    children: "Button",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {
  args: {
    variant: "primary",
    size: "default",
    children: "Playground",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="error">Error</Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
      <Button variant="error" outline>
        Error Outline
      </Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button size="xs" variant="primary">
        Extra Small
      </Button>
      <Button size="sm" variant="primary">
        Small
      </Button>
      <Button size="default" variant="primary">
        Default
      </Button>
    </div>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="xs" circle ghost aria-label="Close">
        <X size={12} />
      </Button>
      <Button size="sm" circle ghost aria-label="Close">
        <X size={20} />
      </Button>
      <Button size="xs" variant="error" outline aria-label="Delete">
        <Trash2 size={14} />
      </Button>
      <Button size="xs" ghost aria-label="Edit">
        <Edit2 size={14} />
      </Button>
      <Button size="xs" variant="error" ghost circle aria-label="Remove">
        <X size={12} />
      </Button>
    </div>
  ),
};

const ActionButtonsWrapper = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-3">
        <Button variant="outline" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? <LoadingSpinner size="xs" /> : "Save"}
        </Button>
      </div>
      <div className="flex gap-3">
        <Button variant="outline">Cancel</Button>
        <Button variant="error">Delete</Button>
      </div>
    </div>
  );
};

export const ActionButtons: Story = {
  name: "Form Actions",
  render: ActionButtonsWrapper,
};

const PlaybackControlsWrapper = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTrack, setCurrentTrack] = React.useState<number | null>(1);

  const tracks = [
    { id: 1, name: "Track 1" },
    { id: 2, name: "Track 2" },
    { id: 3, name: "Track 3" },
  ];

  const handleTogglePlay = (trackId: number) => {
    if (currentTrack === trackId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(trackId);
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-3">
        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </Button>
        <Button size="sm" ghost onClick={() => setIsPlaying(false)}>
          <X size={20} />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {tracks.map((track) => {
          const isCurrent = currentTrack === track.id;
          const isTrackPlaying = isCurrent && isPlaying;

          return (
            <div key={track.id} className="flex items-center gap-3">
              <span className="w-16 text-sm">{track.name}</span>
              <Button
                size="xs"
                variant={isCurrent ? "primary" : "outline"}
                onClick={() => handleTogglePlay(track.id)}
                aria-label={isTrackPlaying ? "Pause" : "Play"}
              >
                {isTrackPlaying ? <Pause size={16} /> : <Play size={16} />}
              </Button>
              <Button
                size="xs"
                variant="error"
                ghost
                circle
                aria-label="Remove audio"
              >
                <X size={12} />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const PlaybackControls: Story = {
  render: PlaybackControlsWrapper,
};

export const TableActions: Story = {
  render: () => {
    const tracks = [
      { id: 1, name: "Track 1", hasAudio: false },
      { id: 2, name: "Track 2", hasAudio: true },
      { id: 3, name: "Track 3", hasAudio: false },
    ];

    return (
      <div className="flex flex-col gap-4">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex items-center gap-3 p-3 border rounded"
          >
            <span className="w-20 text-sm">{track.name}</span>
            <div className="flex gap-2">
              {!track.hasAudio && <Button size="xs">Upload</Button>}
              <Button size="xs" ghost aria-label="Edit">
                <Edit2 size={14} />
              </Button>
              <Button size="xs" variant="error" outline aria-label="Delete">
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  },
};

const PaginationControlsWrapper = () => {
  const [currentPage, setCurrentPage] = React.useState(3);
  const totalPages = 10;

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        size="sm"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
      >
        <ChevronLeft size={16} />
        Prev
      </Button>

      <div className="flex items-center gap-2">
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <Button
        size="sm"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
      >
        Next
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export const PaginationControls: Story = {
  render: PaginationControlsWrapper,
};

const SelectModeToggleWrapper = () => {
  const [selectionMode, setSelectionMode] = React.useState(false);
  const [selectedCount, setSelectedCount] = React.useState(0);

  const toggleMode = () => {
    setSelectionMode(!selectionMode);
    if (!selectionMode) {
      setSelectedCount(0);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        size="sm"
        variant="primary"
        onClick={toggleMode}
        aria-pressed={selectionMode}
      >
        {selectionMode ? "Exit Select" : "Multi Select"}
      </Button>

      {selectionMode && (
        <div className="flex gap-3">
          <Button size="sm" onClick={() => setSelectedCount(selectedCount + 1)}>
            Select Item ({selectedCount})
          </Button>
          <Button
            size="sm"
            variant="error"
            onClick={() => setSelectedCount(0)}
            disabled={selectedCount === 0}
          >
            Delete {selectedCount}
          </Button>
        </div>
      )}
    </div>
  );
};

export const SelectModeToggle: Story = {
  render: SelectModeToggleWrapper,
};

const RemovableTagWrapper = () => {
  const [tags, setTags] = React.useState(["React", "TypeScript", "DaisyUI"]);

  const handleRemove = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          className="badge badge-primary badge-sm inline-flex items-center gap-1 btn btn-ghost p-3"
          onClick={() => handleRemove(tag)}
          aria-label={`Remove ${tag}`}
        >
          <span>{tag}</span>
          <X size={12} />
        </button>
      ))}
      {tags.length === 0 && (
        <span className="text-sm text-base-content/60">All tags removed</span>
      )}
    </div>
  );
};

export const RemovableTag: Story = {
  render: RemovableTagWrapper,
};

const ThemeToggleWrapper = () => {
  const [theme, setTheme] = React.useState("light");

  const toggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle Dark Mode"
      className={getValidClassNames(
        "btn btn-square btn-ghost swap swap-rotate",
        { "swap-active": theme === "dark" }
      )}
    >
      <Sun className="swap-on w-6 h-6" />
      <Moon className="swap-off w-6 h-6" />
    </button>
  );
};

export const ThemeToggle: Story = {
  render: ThemeToggleWrapper,
};

const FloatingActionButtonWrapper = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const trackName = "Amazing Song.mp3";

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-12 h-12 rounded-full bg-primary/80 hover:bg-primary/90 animate-pulse hover:animate-none flex items-center justify-center text-white transition-all duration-200 shadow-lg hover:shadow-xl"
        title={`Now playing: ${trackName}`}
        aria-label={`Expand now playing widget. Currently playing: ${trackName}`}
        type="button"
      >
        <Radio className="w-5 h-5 drop-shadow-sm" />
      </button>
    </div>
  );
};

export const FloatingActionButton: Story = {
  render: FloatingActionButtonWrapper,
};
