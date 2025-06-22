import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
  type RowSelectionState,
} from "@tanstack/react-table";
import type { Track } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SelectModeToggle } from "@/components";
import { columns, type TableMeta } from "./columns";
import { PaginationControls } from "./PaginationControls";

export interface TrackTableProps {
  data: Track[];
  sort: keyof Track;
  order: "asc" | "desc";
  page: number;
  totalPages: number;
  limit: number;
  patch(q: Record<string, string | number | undefined>): void;
  onEdit(track: Track): void;
  onDelete(track: Track): void;
  onUploadClick(track: Track): void;
  onDeleteFile(track: Track): void;
  onBulkDelete(ids: string[]): void;
}

export const TrackTable: React.FC<TrackTableProps> = ({
  data,
  sort,
  order,
  page,
  totalPages,
  limit,
  patch,
  onEdit,
  onDelete,
  onUploadClick,
  onDeleteFile,
  onBulkDelete,
}) => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const selectedIds = useMemo(
    () => Object.keys(rowSelection).filter((k) => rowSelection[k]),
    [rowSelection]
  );

  const [sorting, setSorting] = useState<SortingState>([
    { id: sort, desc: order === "desc" },
  ]);

  useEffect(() => {
    const first = sorting[0];
    if (first && first.id !== "genres") {
      patch({ sort: first.id, order: first.desc ? "desc" : "asc" });
    }
  }, [sorting, patch]);

  const table = useReactTable<Track>({
    data,
    columns,
    getRowId: (row) => row.id,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    manualSorting: sorting[0]?.id !== "genres",
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      selectionMode,
      onEdit,
      onDelete,
      onUploadClick,
      onDeleteFile,
    } satisfies TableMeta,
  });

  return (
    <>
      <SelectModeToggle
        selectionMode={selectionMode}
        onToggleMode={() => {
          setSelectionMode((m) => !m);
          if (selectionMode) setRowSelection({});
        }}
        selectedCount={selectedIds.length}
        onBulkDelete={() => {
          onBulkDelete(selectedIds);
          setRowSelection({});
        }}
        bulkDeleteDisabled={selectedIds.length === 0}
      />

      <div className="overflow-x-auto">
        <table
          className="table w-full table-auto mt-4"
          data-testid="tracks-table"
        >
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer select-none"
                    style={{ width: header.column.columnDef.size }}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ChevronUp className="inline w-4 h-4 ml-1" />,
                          desc: <ChevronDown className="inline w-4 h-4 ml-1" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{ width: cell.column.columnDef.size }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        limit={limit}
        patch={patch}
      />
    </>
  );
};
