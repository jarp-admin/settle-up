import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";

import env from "env";
import { appRouter, createTRPCContext } from "api";

const httpAdapter = createHTTPServer({
  router: appRouter,
  middleware: cors(),
  createContext: createTRPCContext,
});

const { server } = httpAdapter;

server.on("listening", () => {
  console.log(`Server is listening on port ${env.API_PORT}`);
});

httpAdapter.listen(env.API_PORT);
