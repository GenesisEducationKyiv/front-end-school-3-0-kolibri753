import { FilterSelect, SearchInput } from "@/components";
import type { ResourceState } from "@/types";

export interface TrackToolbarProps {
  artists: ResourceState<string>;
  genres: ResourceState<string>;
  filterArtist: string;
  setFilterArtist: (v: string) => void;
  filterGenre: string;
  setFilterGenre: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
}

export const TrackToolbar = ({
  artists,
  genres,
  filterArtist,
  setFilterArtist,
  filterGenre,
  setFilterGenre,
  search,
  setSearch,
}: TrackToolbarProps) => (
  <div className="flex items-center justify-between flex-wrap mb-4">
    <SearchInput
      value={search}
      onChange={setSearch}
      placeholder="Search tracks…"
      dataTestId="search-input"
      id="main-search"
      name="main-search-input"
    />

    <div className="flex gap-4">
      <FilterSelect
        label="Artists"
        options={artists.list}
        value={filterArtist}
        loading={artists.loading}
        error={!!artists.error}
        dataTestId="filter-artist"
        onChange={setFilterArtist}
      />
      <FilterSelect
        label="Genres"
        options={genres.list}
        value={filterGenre}
        loading={genres.loading}
        error={!!genres.error}
        dataTestId="filter-genre"
        onChange={setFilterGenre}
      />
    </div>
  </div>
);
