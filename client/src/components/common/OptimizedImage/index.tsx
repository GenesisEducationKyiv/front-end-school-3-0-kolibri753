import { useState, useMemo, useCallback } from "react";
import { BACKUP_PLACEHOLDER, getOptimizedUrl } from "@/lib";

type OptimizedImageProps = {
  src?: string | null;
  alt?: string;
  width: number;
  height: number;
  className?: string;
};

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
}: OptimizedImageProps) => {
  const [hasError, setHasError] = useState(false);

  const optimizedSrc = useMemo(
    () => (hasError ? BACKUP_PLACEHOLDER : getOptimizedUrl(src, width, height)),
    [src, width, height, hasError]
  );

  const handleError = useCallback(() => setHasError(true), []);

  const imageKey = src?.trim() || "no-src";

  return (
    <img
      key={imageKey}
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      decoding="async"
      onError={handleError}
    />
  );
};
