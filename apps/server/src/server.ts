import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "app-router";
import { createTRPCContext } from "app-router";
import cors from "cors";

const httpAdapter = createHTTPServer({
  router: appRouter,
  middleware: cors(),
  createContext: createTRPCContext,
});

const { server } = httpAdapter;

server.on("listening", () => {
  console.log("Server is listening on port 2022");
});

httpAdapter.listen(2022);
