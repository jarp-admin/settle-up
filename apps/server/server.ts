import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "./root";
import { createTRPCContext } from "./trpc";

createHTTPServer({
  router: appRouter,
  createContext: createTRPCContext,
}).listen(2022);
