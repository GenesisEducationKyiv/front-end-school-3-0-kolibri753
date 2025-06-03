import type { AppError } from "@/api/errors";
import { isRecord } from "./isRecord";

export const isAppError = (v: unknown): v is AppError =>
  isRecord(v) && typeof v.type === "string" && typeof v.message === "string";
