import { describe, it, expect } from "vitest";
import { getValidClassNames } from "./index";

describe("getValidClassNames (clsx wrapper)", () => {
  it("joins simple strings", () => {
    expect(getValidClassNames("foo", "bar")).toBe("foo bar");
  });

  it("ignores falsy inputs", () => {
    expect(getValidClassNames("foo", false, null, undefined, 0, "")).toBe(
      "foo"
    );
  });

  it("flattens arrays recursively", () => {
    expect(getValidClassNames(["foo", ["bar", false]], "baz")).toBe(
      "foo bar baz"
    );
  });

  it("evaluates conditional class object (order-insensitive)", () => {
    const result = getValidClassNames({ a: true, b: 0 }, "c").split(" ");
    expect(result.sort()).toEqual(["a", "c"].sort());
  });

  it("merges everything together", () => {
    const result = getValidClassNames(
      "foo",
      { bar: true, baz: false },
      ["qux", 0, ["nested"]],
      null
    ).split(" ");
    expect(result.sort()).toEqual(["foo", "bar", "qux", "nested"].sort());
  });
});
