import type { AppRouter } from "api";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import fetch from "cross-fetch";

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:2022",
      fetch,
    }),
  ],
  transformer: superjson,
});
