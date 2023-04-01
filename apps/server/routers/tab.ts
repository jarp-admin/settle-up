import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const tabRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tab.findMany();
  }),
});
