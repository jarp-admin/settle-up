import { paypalRouter } from "./routers/paypal";
import { discordRouter } from "./routers/discord";
import { createTRPCRouter } from "./trpc";
import { prisma } from "./db";

export const createTRPCContext = async () => {
  return {
    prisma,
  };
};

export const appRouter = createTRPCRouter({
  discord: discordRouter,
  paypal: paypalRouter,
});

export type AppRouter = typeof appRouter;
