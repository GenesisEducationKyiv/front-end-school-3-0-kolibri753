import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dataTestId?: string;
  debounce?: number;
  id?: string;
  name?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  dataTestId,
  debounce = 300,
  id = "search-input",
  name = "search",
}: SearchInputProps) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, debounce);

    return () => clearTimeout(handler);
  }, [internalValue, value, onChange, debounce]);

  return (
    <fieldset className="fieldset w-full sm:w-auto">
      <legend className="fieldset-legend text-sm">{placeholder}</legend>
      <label className="input input-bordered input-sm relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 opacity-50 h-3 w-3" />
        <input
          type="search"
          id={id}
          name={name}
          data-testid={dataTestId}
          placeholder={placeholder}
          className="w-full pl-4 bg-transparent focus:outline-none"
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
        />
      </label>
    </fieldset>
  );
};
