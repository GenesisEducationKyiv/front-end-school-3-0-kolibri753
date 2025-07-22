interface FilterSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
  error?: boolean;
  dataTestId?: string;
  id?: string;
  name?: string;
}

export const FilterSelect = ({
  label,
  options,
  value,
  onChange,
  loading = false,
  error = false,
  dataTestId,
  id,
  name,
}: FilterSelectProps) => {
  const safeValue = options.includes(value) ? value : "";

  const defaultId = id || `filter-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const defaultName =
    name || `filter_${label.toLowerCase().replace(/\s+/g, "_")}`;

  return (
    <label className="form-control w-full sm:w-auto" htmlFor={defaultId}>
      <div className="label">
        <span className="label-text">{label}</span>
      </div>
      <select
        id={defaultId}
        name={defaultName}
        data-testid={dataTestId}
        className="select select-bordered select-sm min-w-[8rem]"
        value={safeValue}
        disabled={loading || error}
        onChange={(e) => onChange(e.target.value)}
      >
        {loading && <option>Loading…</option>}
        {error && <option>Error</option>}
        {!loading && !error && (
          <>
            <option value="">All {label.toLowerCase()}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </>
        )}
      </select>
    </label>
  );
};
