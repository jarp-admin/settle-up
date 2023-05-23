import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import fetch from "cross-fetch";

import env from "env";
import type { AppRouter } from "api";

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `http://${env.API_HOST}:${env.API_PORT}/api/trpc`,
      fetch,
    }),
  ],
  transformer: superjson,
});

export default trpc;
