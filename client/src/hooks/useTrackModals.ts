import { useState } from "react";
import type { Track } from "@/types";

export type ModalType =
  | "create"
  | "edit"
  | "delete"
  | "upload"
  | "deleteFile"
  | "bulkDelete"
  | null;

interface ModalState {
  type: ModalType;
  track: Track | null;
  bulkDeleteIds: string[];
}

export const useTrackModals = () => {
  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    track: null,
    bulkDeleteIds: [],
  });

  const closeModal = () => {
    setModalState({
      type: null,
      track: null,
      bulkDeleteIds: [],
    });
  };

  const openModal = (type: Exclude<ModalType, null>, track?: Track) => {
    setModalState({
      type,
      track: track || null,
      bulkDeleteIds: [],
    });
  };

  const openBulkDelete = (ids: string[]) => {
    setModalState({
      type: "bulkDelete",
      track: null,
      bulkDeleteIds: ids,
    });
  };

  return {
    modalType: modalState.type,
    modalTrack: modalState.track,
    bulkDeleteIds: modalState.bulkDeleteIds,
    closeModal,
    openCreate: () => openModal("create"),
    openEdit: (track: Track) => openModal("edit", track),
    openDelete: (track: Track) => openModal("delete", track),
    openUpload: (track: Track) => openModal("upload", track),
    openDeleteFile: (track: Track) => openModal("deleteFile", track),
    openBulkDelete,
  };
};
