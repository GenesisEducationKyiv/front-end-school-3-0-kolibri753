import { type ColumnDef } from "@tanstack/react-table";
import BackupCoverUrl from "@/assets/logo.svg";
import { Edit2, Trash2 } from "lucide-react";
import type { Track } from "@/types";
import { TrackPlayer } from "@/components";

export interface TableMeta {
  selectionMode: boolean;
  onEdit(track: Track): void;
  onDelete(track: Track): void;
  onUploadClick(track: Track): void;
  onDeleteFile(track: Track): void;
}

export const columns: ColumnDef<Track, unknown>[] = [
  {
    id: "select",
    size: 0,
    enableSorting: false,
    header: ({ table }) => {
      const { selectionMode } = table.options.meta as TableMeta;
      return selectionMode ? (
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          data-testid="select-all"
        />
      ) : null;
    },
    cell: ({ row, table }) => {
      const { selectionMode } = table.options.meta as TableMeta;
      return selectionMode ? (
        <input
          type="checkbox"
          className="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          data-testid={`track-checkbox-${row.original.id}`}
        />
      ) : null;
    },
  },

  {
    accessorKey: "coverImage",
    header: "Cover",
    enableSorting: false,
    size: 80,
    cell: ({ getValue }) => {
      const url = getValue<string>() || BackupCoverUrl;
      return (
        <img src={url} alt="cover" className="w-12 h-12 object-cover rounded" />
      );
    },
  },

  {
    accessorKey: "title",
    header: "Title",
    cell: ({ getValue, row }) => (
      <span data-testid={`track-item-${row.original.id}-title`}>
        {getValue<string>()}
      </span>
    ),
  },

  {
    accessorKey: "artist",
    header: "Artist",
    enableColumnFilter: true,
    filterFn: "includesString",
    cell: ({ getValue, row }) => (
      <span data-testid={`track-item-${row.original.id}-artist`}>
        {getValue<string>()}
      </span>
    ),
  },

  {
    accessorKey: "album",
    header: "Album",
    cell: (info) => info.getValue() ?? "—",
  },

  {
    accessorKey: "genres",
    header: "Genres",
    enableSorting: true,
    enableColumnFilter: true,
    sortingFn: (a, b, id) => {
      const sa = (a.getValue<string[]>(id) ?? []).join(", ");
      const sb = (b.getValue<string[]>(id) ?? []).join(", ");
      return sa.localeCompare(sb);
    },
    filterFn: (row, id, filterValue: string) => {
      if (!filterValue) return true;
      return (row.getValue<string[]>(id) ?? []).includes(filterValue);
    },
    cell: (info) => (info.getValue<string[]>() ?? []).join(", "),
  },

  {
    id: "audio",
    header: "Audio",
    enableSorting: false,
    size: 40,
    cell: ({ row, table }) => {
      const track = row.original;
      const { onUploadClick, onDeleteFile } = table.options.meta as TableMeta;

      if (!track.audioFile) {
        return (
          <button
            className="btn btn-xs"
            onClick={() => onUploadClick(track)}
            data-testid={`upload-track-${track.id}`}
          >
            Upload
          </button>
        );
      }

      return (
        <TrackPlayer
          track={{
            id: track.id,
            title: track.title,
            artist: track.artist,
            src: `/api/files/${track.audioFile}`,
            cover: track.coverImage,
          }}
          onRemove={() => onDeleteFile(track)}
          showRemove={true}
        />
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    size: 50,
    cell: ({ row, table }) => {
      const track = row.original;
      const { onEdit, onDelete } = table.options.meta as TableMeta;

      return (
        <div className="flex gap-2">
          <button
            className="btn btn-xs btn-ghost"
            onClick={() => onEdit(track)}
            data-testid={`edit-track-${track.id}`}
          >
            <Edit2 size={14} />
          </button>
          <button
            className="btn btn-xs btn-error btn-outline"
            onClick={() => onDelete(track)}
            data-testid={`delete-track-${track.id}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      );
    },
  },
];
