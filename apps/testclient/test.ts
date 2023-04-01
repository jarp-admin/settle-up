import type { AppRouter } from "../server/root";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:2022/tabs",
    }),
  ],
  transformer: superjson,
});

const bilbo = client.tabs.addOrCreate.mutate({
  amount: 1,
  debtorID: 123,
  creditorID: 234,
});
console.log(bilbo);
