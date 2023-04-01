import { initTRPC } from "@trpc/server";

export const createTRPCContext = async () => {
  return {
    prisma,
  };
};

const t = initTRPC.create();

export const createTRPCRouter = t.router;

// export const middleware = t.middleware;

export const publicProcedure = t.procedure;
