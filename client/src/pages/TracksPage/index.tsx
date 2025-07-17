import React, { useEffect } from "react";
import {
  useTrackModals,
  useTracksQuery,
  useArtistsQuery,
  useGenresQuery,
  useCreateTrackMutation,
  useUpdateTrackMutation,
  useDeleteTrackMutation,
  useUploadTrackFileMutation,
  useDeleteTrackFileMutation,
  useBulkDeleteTracksMutation,
} from "@/hooks";
import {
  DeleteConfirmationModal,
  Modal,
  TrackForm,
  TrackTable,
  UploadFileModal,
  TrackToolbar,
  LoadingSpinner,
  ErrorMessage,
} from "@/components";
import type { TrackFormData } from "@/schemas";
import { useTrackQuery } from "@/lib";
import { TRACK_QUERY_DEFAULTS } from "@/constants";
import { extractErrorMessage } from "@/helpers";
import { toRefreshableResourceState, toResourceState } from "./helpers";

const TracksPage: React.FC = () => {
  const { query: queryParams, patch: updateQueryParams } = useTrackQuery();

  const {
    modalType,
    modalTrack,
    bulkDeleteIds,
    closeModal,
    openCreate,
    openEdit,
    openDelete,
    openUpload,
    openDeleteFile,
    openBulkDelete,
  } = useTrackModals();

  const tracksQuery = useTracksQuery(queryParams);
  const artistsQuery = useArtistsQuery();
  const genresQuery = useGenresQuery();

  const createTrackMutation = useCreateTrackMutation();
  const updateTrackMutation = useUpdateTrackMutation();
  const deleteTrackMutation = useDeleteTrackMutation();
  const uploadFileMutation = useUploadTrackFileMutation();
  const deleteFileMutation = useDeleteTrackFileMutation();
  const bulkDeleteMutation = useBulkDeleteTracksMutation();

  useEffect(() => {
    const meta = tracksQuery.data?.meta;
    if (meta && queryParams.page > meta.totalPages && meta.totalPages >= 1) {
      updateQueryParams({ page: meta.totalPages });
    }
  }, [queryParams.page, tracksQuery.data?.meta, updateQueryParams]);

  const isPending =
    tracksQuery.isPending || artistsQuery.isPending || genresQuery.isPending;

  const hasActiveFilters = !!(
    queryParams.search ||
    queryParams.artist ||
    queryParams.genre
  );
  const resetFilters = () => updateQueryParams({ ...TRACK_QUERY_DEFAULTS });

  const retryAll = () => {
    tracksQuery.refetch();
    artistsQuery.refetch();
    genresQuery.refetch();
  };

  const tableData = tracksQuery.data?.data ?? [];

  const handleCreate = async (form: TrackFormData) => {
    await createTrackMutation.mutateAsync(form);
    closeModal();
  };

  const handleUpdate = async (form: TrackFormData) => {
    if (!modalTrack) return;

    const hasChanges = (
      ["title", "artist", "genres", "album", "coverImage"] as const
    ).some(
      (key) => JSON.stringify(modalTrack[key]) !== JSON.stringify(form[key])
    );

    if (!hasChanges) {
      closeModal();
      return;
    }

    await updateTrackMutation.mutateAsync({ id: modalTrack.id, data: form });
    closeModal();
  };

  const handleDelete = async () => {
    if (!modalTrack) return;
    await deleteTrackMutation.mutateAsync(modalTrack.id);
    closeModal();
  };

  const handleUpload = async (file: File) => {
    if (!modalTrack) return;
    await uploadFileMutation.mutateAsync({ id: modalTrack.id, file });
    closeModal();
  };

  const handleDeleteFile = async () => {
    if (!modalTrack) return;
    await deleteFileMutation.mutateAsync(modalTrack.id);
    closeModal();
  };

  const handleBulkDelete = async () => {
    if (bulkDeleteIds.length === 0) return;
    await bulkDeleteMutation.mutateAsync(bulkDeleteIds);
    closeModal();
  };

  if (isPending) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (tracksQuery.isError) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <ErrorMessage
          message={extractErrorMessage(tracksQuery.error)}
          onRetry={retryAll}
        />
      </div>
    );
  }

  const meta = tracksQuery.data?.meta ?? {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Tracks</h1>
          <button
            className="btn btn-primary"
            onClick={openCreate}
            data-testid="create-track-button"
          >
            New Track
          </button>
        </div>

        <TrackToolbar
          artists={toRefreshableResourceState(artistsQuery)}
          genres={toResourceState(genresQuery)}
          filterArtist={queryParams.artist}
          setFilterArtist={(v) => updateQueryParams({ artist: v, page: 1 })}
          filterGenre={queryParams.genre}
          setFilterGenre={(v) => updateQueryParams({ genre: v, page: 1 })}
          search={queryParams.search}
          setSearch={(v) => updateQueryParams({ search: v, page: 1 })}
        />

        {tableData.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-4">
              {hasActiveFilters
                ? "No tracks found matching your criteria"
                : "No tracks available"}
            </p>
            {hasActiveFilters && (
              <button
                className="btn btn-outline btn-sm"
                onClick={resetFilters}
                data-testid="reset-filters-button"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <TrackTable
            data={tableData}
            sort={queryParams.sort}
            order={queryParams.order}
            page={queryParams.page}
            totalPages={meta.totalPages}
            limit={queryParams.limit}
            patch={updateQueryParams}
            onEdit={openEdit}
            onDelete={openDelete}
            onUploadClick={openUpload}
            onDeleteFile={openDeleteFile}
            onBulkDelete={openBulkDelete}
          />
        )}

        {modalType === "create" && (
          <Modal onClose={closeModal}>
            <TrackForm
              onSubmit={handleCreate}
              genres={toResourceState(genresQuery)}
              onCancel={closeModal}
            />
          </Modal>
        )}

        {modalType === "edit" && modalTrack && (
          <Modal onClose={closeModal}>
            <TrackForm
              initialData={modalTrack}
              genres={toResourceState(genresQuery)}
              onSubmit={handleUpdate}
              onCancel={closeModal}
            />
          </Modal>
        )}

        {modalType === "delete" && modalTrack && (
          <DeleteConfirmationModal
            title={`Delete "${modalTrack.title}"?`}
            onConfirm={handleDelete}
            onCancel={closeModal}
          />
        )}

        {modalType === "upload" && modalTrack && (
          <UploadFileModal
            track={modalTrack}
            onUpload={handleUpload}
            onCancel={closeModal}
          />
        )}

        {modalType === "deleteFile" && modalTrack && (
          <DeleteConfirmationModal
            title={`Remove audio from "${modalTrack.title}"?`}
            onConfirm={handleDeleteFile}
            onCancel={closeModal}
          />
        )}

        {modalType === "bulkDelete" && bulkDeleteIds.length > 0 && (
          <DeleteConfirmationModal
            title={`Delete ${bulkDeleteIds.length} track${
              bulkDeleteIds.length > 1 ? "s" : ""
            }?`}
            onConfirm={handleBulkDelete}
            onCancel={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default TracksPage;
