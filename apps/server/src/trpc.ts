import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { prisma } from "./db";

export const createTRPCContext = async () => {
  return {
    prisma,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
