import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import fetch from "cross-fetch";

import { AppRouter } from "../../server/src/root";

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:2022",
      fetch,
    }),
  ],
  transformer: superjson,
});

client.tab.addOrCreate
  .mutate({
    amount: 1,
    debtorID: "clfy8vhfd0000vgl44wziywjb",
    creditorID: "clfy8vhfe0002vgl4bn7a94v2",
  })
  .then((bilbo) => {
    console.log(bilbo);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
