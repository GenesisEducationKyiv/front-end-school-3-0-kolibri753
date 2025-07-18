import { describe, it, expect } from "vitest";
import { formatTime } from "./index";

describe("formatTime", () => {
  it("formats seconds to mm:ss format", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(5)).toBe("0:05");
    expect(formatTime(60)).toBe("1:00");
    expect(formatTime(65)).toBe("1:05");
    expect(formatTime(3661)).toBe("61:01");
  });

  it("pads single-digit seconds with zero", () => {
    expect(formatTime(61)).toBe("1:01");
    expect(formatTime(69)).toBe("1:09");
  });

  it("handles decimal seconds by flooring", () => {
    expect(formatTime(65.7)).toBe("1:05");
    expect(formatTime(59.9)).toBe("0:59");
  });

  it("handles negative numbers by returning 0:00", () => {
    expect(formatTime(-1)).toBe("0:00");
    expect(formatTime(-30)).toBe("0:00");
  });
});
