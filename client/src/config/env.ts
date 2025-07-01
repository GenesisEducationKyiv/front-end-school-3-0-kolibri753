import { z } from "zod";

const Env = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_API_PREFIX: z.string().startsWith("/"),
});

const parsed = Env.safeParse(import.meta.env);

if (!parsed.success) {
  console.error("\nInvalid or missing env vars:\n", parsed.error.format());
  throw new Error("Invalid environment variables");
}

export const env = {
  API_BASE_URL: parsed.data.VITE_API_BASE_URL,
  API_PREFIX: parsed.data.VITE_API_PREFIX,
} as const;
