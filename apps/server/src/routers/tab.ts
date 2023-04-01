import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { generatePaypalLink } from "../utils/payments";

export const tabRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tab.findMany();
  }),
  addOrCreate: publicProcedure
    .input(
      z.object({
        amount: z.number(),
        debtorID: z.string(),
        creditorID: z.string(),
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
  // settle: publicProcedure
  //   .input(
  //     z.object({
  //       debtorID: z.string(),
  //       creditorID: z.string(),
  //     })
  //   )
  //   .query(async ({ input, ctx }) => {
  //     const tab = await ctx.prisma.tab.findFirst({
  //       where: {
  //         debtorID: input.debtorID,
  //         creditorID: input.creditorID,
  //       },
  //     });

  //     const paymentAmount = tab?.amount;

  //     const settledTab = await ctx.prisma.tab.updateMany({
  //       where: {
  //         debtorID: input.debtorID,
  //         creditorID: input.creditorID,
  //       },
  //       data: {
  //         settled: true,
  //       },
  //     });

  //     return generatePaypalLink(paymentAmount, "GBP", )
  //   }),
});
