import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { createTRPCContext } from ".";

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export { TRPCError };
