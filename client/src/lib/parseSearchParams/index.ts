import { pipe, O, R } from "@mobily/ts-belt";
import { trackQuerySchema, type TrackQueryParams } from "@/schemas";

/**
 * Parse URLSearchParams into TrackQueryParams or return an error message
 */
export const parseSearchParams = (
  sp: URLSearchParams
): R.Result<TrackQueryParams, string> =>
  pipe(
    O.fromExecution(() => Object.fromEntries(sp)),
    O.toResult("failed to read URLSearchParams"),
    R.flatMap((obj) =>
      pipe(trackQuerySchema.safeParse(obj), (r) =>
        r.success ? R.Ok(r.data) : R.Error(r.error.message)
      )
    )
  );
