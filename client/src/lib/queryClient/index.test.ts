import { describe, it, expect, vi } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { createQueryClient, queryClient } from "./index";

vi.mock("@/constants", () => ({
  QUERY_CONFIG: {
    staleTime: 300000,
    gcTime: 600000,
    retryCount: 3,
  },
}));

describe("queryClient", () => {
  it("creates QueryClient with correct configuration", () => {
    const client = createQueryClient();

    expect(client).toBeInstanceOf(QueryClient);
    expect(client.getDefaultOptions().queries?.staleTime).toBe(300000);
    expect(client.getDefaultOptions().queries?.gcTime).toBe(600000);
    expect(client.getDefaultOptions().queries?.retry).toBe(3);
    expect(client.getDefaultOptions().queries?.refetchOnWindowFocus).toBe(
      false
    );
    expect(client.getDefaultOptions().mutations?.retry).toBe(1);
  });

  it("exports singleton instance", () => {
    expect(queryClient).toBeInstanceOf(QueryClient);
  });
});
