import { describe, it, expect, vi } from "vitest";
import { getOptimizedUrl, BACKUP_PLACEHOLDER } from "./index";

vi.mock("@/assets/logo.svg", () => ({
  default: "mocked-logo.svg",
}));

describe("getOptimizedUrl", () => {
  it("returns backup placeholder for null/undefined/empty src", () => {
    expect(getOptimizedUrl(null, 100, 100)).toBe(BACKUP_PLACEHOLDER);
    expect(getOptimizedUrl(undefined, 100, 100)).toBe(BACKUP_PLACEHOLDER);
    expect(getOptimizedUrl("", 100, 100)).toBe(BACKUP_PLACEHOLDER);
    expect(getOptimizedUrl("   ", 100, 100)).toBe(BACKUP_PLACEHOLDER);
  });

  it("constructs optimized URL with correct parameters", () => {
    const src = "https://example.com/image.jpg";
    const result = getOptimizedUrl(src, 100, 200);

    expect(result).toContain("https://images.weserv.nl/");
    expect(result).toContain("url=example.com%2Fimage.jpg");
    expect(result).toContain("w=200"); // width * 2
    expect(result).toContain("h=400"); // height * 2
    expect(result).toContain("fit=cover");
    expect(result).toContain("output=webp");
    expect(result).toContain("q=80");
  });

  it("handles URLs with query parameters", () => {
    const src = "https://example.com/image.jpg?v=1";
    const result = getOptimizedUrl(src, 50, 50);

    expect(result).toContain("example.com%2Fimage.jpg%3Fv%3D1");
  });

  it("returns backup placeholder for invalid URLs", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(getOptimizedUrl("not-a-url", 100, 100)).toBe(BACKUP_PLACEHOLDER);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Invalid image URL provided:",
      "not-a-url",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
