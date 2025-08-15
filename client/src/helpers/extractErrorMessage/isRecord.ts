export const isRecord = (v: unknown): v is Record<PropertyKey, unknown> =>
  typeof v === "object" && v !== null;
