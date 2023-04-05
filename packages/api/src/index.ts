import { paymentRouter } from "./routers/payment";
import { tabRouter } from "./routers/tab";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";
import { leaderboardRouter } from "./routers/leaderboard";
import { prisma } from "./db";

export const createTRPCContext = async () => {
  return {
    prisma,
  };
};

export const appRouter = createTRPCRouter({
  tab: tabRouter,
  payment: paymentRouter,
  user: userRouter,
  leaderboard: leaderboardRouter,
});

export type AppRouter = typeof appRouter;
