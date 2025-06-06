import React from "react";

interface Props {
  page: number;
  totalPages: number;
  limit: number;
  patch(q: Record<string, string | number | undefined>): void;
}

export const PaginationControls: React.FC<Props> = ({
  page,
  totalPages,
  limit,
  patch,
}) => (
  <div
    className="flex items-center justify-end flex-wrap gap-4 mt-4"
    data-testid="pagination"
  >
    <button
      className="btn btn-sm"
      onClick={() => patch({ page: page - 1 })}
      disabled={page <= 1}
      data-testid="pagination-prev"
    >
      ← Prev
    </button>

    <span>
      Page {page} of {totalPages}
    </span>

    <button
      className="btn btn-sm"
      onClick={() => patch({ page: page + 1 })}
      disabled={page >= totalPages}
      data-testid="pagination-next"
    >
      Next →
    </button>

    <select
      className="select select-bordered select-sm"
      value={limit}
      onChange={(e) => patch({ limit: Number(e.target.value), page: 1 })}
    >
      {[5, 10, 20].map((n) => (
        <option key={n} value={n}>
          {n} / page
        </option>
      ))}
    </select>
  </div>
);
