import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Result } from "neverthrow";
import { trackService } from "@/api";
import { showToastMessage, extractErrorMessage } from "@/helpers";
import { QUERY_KEYS } from "@/constants";
import type { TrackFormData } from "@/schemas";
import type { AppError } from "@/api/errors";

/**
 * Helper to unwrap Result and throw on error
 */
const unwrapResult = async <T>(resultPromise: Promise<Result<T, AppError>>) => {
  const result = await resultPromise;
  if (result.isErr()) {
    throw result.error;
  }
  return result.value;
};

/**
 * Invalidate related queries after track operations
 */
const invalidateTrackQueries = (
  queryClient: ReturnType<typeof useQueryClient>
) => {
  queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRACKS] });
  queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ARTISTS] });
};

/**
 * Common error handler for track mutations
 */
const handleMutationError = (error: AppError, operation: string) => {
  showToastMessage("error", extractErrorMessage(error));
  console.error(`${operation} error:`, error);
};

export function useCreateTrackMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TrackFormData) =>
      unwrapResult(trackService.create(data)),
    onSuccess: () => {
      showToastMessage("success", "Track created successfully");
      invalidateTrackQueries(queryClient);
    },
    onError: (error: AppError) => handleMutationError(error, "Create track"),
  });
}

export function useUpdateTrackMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TrackFormData }) =>
      unwrapResult(trackService.update(id, data)),
    onSuccess: () => {
      showToastMessage("success", "Track updated successfully");
      invalidateTrackQueries(queryClient);
    },
    onError: (error: AppError) => handleMutationError(error, "Update track"),
  });
}

export function useDeleteTrackMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => unwrapResult(trackService.delete(id)),
    onSuccess: () => {
      showToastMessage("success", "Track deleted successfully");
      invalidateTrackQueries(queryClient);
    },
    onError: (error: AppError) => handleMutationError(error, "Delete track"),
  });
}

export function useUploadTrackFileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      unwrapResult(trackService.uploadTrackFile(id, file)),
    onSuccess: () => {
      showToastMessage("success", "File uploaded successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRACKS] });
    },
    onError: (error: AppError) => handleMutationError(error, "Upload file"),
  });
}

export function useDeleteTrackFileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => unwrapResult(trackService.deleteTrackFile(id)),
    onSuccess: () => {
      showToastMessage("success", "File removed successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRACKS] });
    },
    onError: (error: AppError) => handleMutationError(error, "Delete file"),
  });
}

export function useBulkDeleteTracksMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      unwrapResult(trackService.deleteMultipleTracks(ids)),
    onSuccess: (result) => {
      const { success, failed } = result;
      const successCount = success.length;
      const failedCount = failed.length;

      showToastMessage(
        "success",
        `Deleted ${successCount} track${successCount === 1 ? "" : "s"}`
      );

      if (failedCount > 0) {
        showToastMessage("error", `Failed to delete: ${failed.join(", ")}`);
      }

      invalidateTrackQueries(queryClient);
    },
    onError: (error: AppError) => handleMutationError(error, "Bulk delete"),
  });
}
