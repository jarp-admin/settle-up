import { paymentRouter } from "./routers/payment";
import { tabRouter } from "./routers/tab";
import { createTRPCRouter } from "./trpc";
import { prisma } from "./db";

export const createTRPCContext = async () => {
  return {
    prisma,
  };
};

export const appRouter = createTRPCRouter({
  tab: tabRouter,
  payment: paymentRouter,
});

export type AppRouter = typeof appRouter;
