import React, { useEffect, useMemo } from "react";
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
import { useTrackQuery } from "@/lib/useTrackQuery";

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

  const isLoading =
    tracksQuery.isLoading || artistsQuery.isLoading || genresQuery.isLoading;
  const hasError = tracksQuery.error || artistsQuery.error || genresQuery.error;

  const retryAll = () => {
    tracksQuery.refetch();
    artistsQuery.refetch();
    genresQuery.refetch();
  };

  const tableData = useMemo(
    () => tracksQuery.data?.data ?? [],
    [tracksQuery.data?.data]
  );

  const artists = useMemo(
    () => ({
      list: artistsQuery.data ?? [],
      loading: artistsQuery.isLoading,
      error: artistsQuery.error
        ? { type: "Unknown" as const, message: "Failed to load artists" }
        : null,
      refetch: artistsQuery.refetch,
    }),
    [artistsQuery]
  );

  const genres = useMemo(
    () => ({
      list: genresQuery.data ?? [],
      loading: genresQuery.isLoading,
      error: genresQuery.error
        ? { type: "Unknown" as const, message: "Failed to load genres" }
        : null,
    }),
    [genresQuery]
  );

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

  if (
    isLoading &&
    !tracksQuery.data &&
    !artistsQuery.data &&
    !genresQuery.data
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (hasError && !tracksQuery.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message="Failed to load page data" onRetry={retryAll} />
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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
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
          artists={artists}
          genres={genres}
          filterArtist={queryParams.artist}
          setFilterArtist={(v) => updateQueryParams({ artist: v, page: 1 })}
          filterGenre={queryParams.genre}
          setFilterGenre={(v) => updateQueryParams({ genre: v, page: 1 })}
          search={queryParams.search}
          setSearch={(v) => updateQueryParams({ search: v, page: 1 })}
        />

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

        {modalType === "create" && (
          <Modal onClose={closeModal}>
            <TrackForm
              onSubmit={handleCreate}
              genres={genres}
              onCancel={closeModal}
            />
          </Modal>
        )}

        {modalType === "edit" && modalTrack && (
          <Modal onClose={closeModal}>
            <TrackForm
              initialData={modalTrack}
              genres={genres}
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

        {bulkDeleteIds.length > 0 && (
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
