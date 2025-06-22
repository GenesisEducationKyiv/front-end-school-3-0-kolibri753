import { describe, it, expect } from "vitest";
import { extractErrorMessage } from "./index";
import type { AppError } from "@/api/errors";

describe("extractErrorMessage (public API)", () => {
  it("returns joined field errors when Validation AppError (non-empty strings only)", () => {
    const err: AppError = {
      type: "Validation",
      fieldErrors: { a: "A required", b: "", c: "C invalid" },
      message: "Validation failed",
    };
    expect(extractErrorMessage(err)).toBe("A required, C invalid");
  });

  it("falls back to message for Validation AppError with no fieldErrors", () => {
    const err: AppError = {
      type: "Validation",
      fieldErrors: {},
      message: "Validation failed",
    };
    expect(extractErrorMessage(err)).toBe("Validation failed");
  });

  it("returns message for Network, NotFound, Conflict, Unknown AppErrors", () => {
    const net: AppError = { type: "Network", message: "net!" };
    const notFound: AppError = {
      type: "NotFound",
      resource: "foo",
      message: "not found",
    };
    const conflict: AppError = {
      type: "Conflict",
      resource: "bar",
      message: "conflict",
    };
    const unknown: AppError = {
      type: "Unknown",
      cause: {},
      message: "unknown!",
    };
    expect(extractErrorMessage(net)).toBe("net!");
    expect(extractErrorMessage(notFound)).toBe("not found");
    expect(extractErrorMessage(conflict)).toBe("conflict");
    expect(extractErrorMessage(unknown)).toBe("unknown!");
  });

  it("returns Error.message for native Error", () => {
    const e = new Error("Oops");
    const msg = extractErrorMessage(e);
    expect(msg).toBe("Oops");
    
    e.message = "changed";
    expect(msg).toBe("Oops");
  });

  it("returns the message if input is a record with string message", () => {
    expect(extractErrorMessage({ message: "plain msg" })).toBe("plain msg");
  });

  it("returns fallback for record with non-string message", () => {
    expect(extractErrorMessage({ message: 1234 })).toBe("Something went wrong");
  });

  it("returns fallback for objects with Error shape but not instanceof", () => {
    const errLike = { message: "looks like error", stack: "..." };
    expect(extractErrorMessage(Object.create(errLike))).toBe(
      "looks like error"
    );
  });

  it("returns fallback for nonsense input", () => {
    for (const bad of [123, null, undefined, {}, [], true, false]) {
      expect(extractErrorMessage(bad)).toBe("Something went wrong");
    }
  });
});
