import { neonConfig } from "@neondatabase/serverless";
import { sql } from "@vercel/postgres";

neonConfig.fetchFunction = (
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1]
) =>
  fetch(input, { ...init, cache: "no-store" });

export { sql };
