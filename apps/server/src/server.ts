import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "app-router";
import { createTRPCContext } from "app-router";

const httpAdapter = createHTTPServer({
  router: appRouter,
  createContext: createTRPCContext,
});

const { server } = httpAdapter;

server.on("listening", () => {
  console.log("Server is listening on port 2022");
});

httpAdapter.listen(2022);
