import type { AppRouter } from "../server/root";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import fetch from "cross-fetch";

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:2022",
      fetch,
    }),
  ],
  transformer: superjson,
});

client.tabs.addOrCreate
  .mutate({
    amount: 1,
    debtorID: 123,
    creditorID: 234,
  })
  .then((bilbo) => {
    console.log(bilbo);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
