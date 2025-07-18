import logo from "@/assets/logo.svg";

const IMAGE_SERVICE_URL = "https://images.weserv.nl/";

export const BACKUP_PLACEHOLDER = logo;

/**
 * Constructs a URL for the image optimization service.
 * @param src The original source URL of the image.
 * @param width The target display width.
 * @param height The target display height.
 * @returns The full URL for the optimized image.
 */
export const getOptimizedUrl = (
  src: string | null | undefined,
  width: number,
  height: number
): string => {
  if (!src?.trim()) {
    return BACKUP_PLACEHOLDER;
  }

  try {
    const url = new URL(src.trim());
    const cleanUrl = url.hostname + url.pathname + url.search;

    const requestWidth = width * 2;
    const requestHeight = height * 2;

    const serviceParams = new URLSearchParams({
      url: cleanUrl,
      w: requestWidth.toString(),
      h: requestHeight.toString(),
      fit: "cover",
      output: "webp",
      q: "80",
    });

    return `${IMAGE_SERVICE_URL}?${serviceParams.toString()}`;
  } catch (error) {
    console.error("Invalid image URL provided:", src, error);
    return BACKUP_PLACEHOLDER;
  }
};
