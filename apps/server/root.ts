import { tabRouter } from "./routers/tab";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  tab: tabRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
