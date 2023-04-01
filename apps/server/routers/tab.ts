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
        debtorID: z.number(),
        creditorID: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const upsertTab = await ctx.prisma.tab.upsert({
        where: {
          debtorID: input.debtorID,
          creditorID: input.creditorID,
        },
        create: {
          amount: input.amount,
          debtorID: input.debtorID,
          creditorID: input.creditorID,
        },
        update: {
          amount: { increment: input.amount },
        },
      });

      return upsertTab;
    }),
});
