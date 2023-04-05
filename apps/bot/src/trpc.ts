import type { AppRouter } from "app-router";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import fetch from "cross-fetch";
import env from "env";

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `http://${env.API_HOST}:${env.API_PORT}`,
      fetch,
    }),
  ],
  transformer: superjson,
});

export default trpc;
