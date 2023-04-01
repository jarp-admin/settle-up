import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const tabRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tab.findMany();
  }),
  addOrCreate: publicProcedure
    .input(
      z.object({
        amount: z.number(),
        debtorId: z.number(),
        creditorId: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {}),
});
