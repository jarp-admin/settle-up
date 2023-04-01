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
    .mutation(async ({ input, ctx }) => {
      const upsertTab = await ctx.prisma.tab.upsert({
        where: {
          debtorID: input.debtorId,
          creditorID: input.creditorId,
        },
        update: {
          amount: { increment: input.amount },
        },
        create: {
          amount: input.amount,
          debtorID: input.debtorId,
          creditorID: input.creditorId,
        },
      });

      await ctx.prisma.tab.save(upsertTab);

      return upsertTab;
    }),
});
