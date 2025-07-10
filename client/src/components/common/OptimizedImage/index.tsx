import { useState, useMemo } from "react";
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

  const memoizedSrc = useMemo(() => {
    return getOptimizedUrl(src, width, height);
  }, [src, width, height]);

  const handleError = () => {
    setHasError(true);
  };

  return (
    <img
      key={src}
      src={hasError ? BACKUP_PLACEHOLDER : memoizedSrc}
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
