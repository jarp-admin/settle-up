import { tabRouter } from "./routers/tab";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  tabs: tabRouter,
});

export type AppRouter = typeof appRouter;
