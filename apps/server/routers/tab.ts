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
      const tab = await ctx.prisma.tab.findFirst({
        where: {
          debtorID: input.debtorID,
          creditorID: input.creditorID,
        },
      });

      if (!tab) {
        const createdTab = await ctx.prisma.tab.create({
          data: {
            amount: input.amount,
            debtorID: input.debtorID,
            creditorID: input.creditorID,
          },
        });

        return createdTab;
      }

      const upsertTab = await ctx.prisma.tab.updateMany({
        where: {
          debtorID: input.debtorID,
          creditorID: input.creditorID,
        },
        data: {
          amount: { increment: input.amount },
        },
      });

      return upsertTab;
    }),
});
