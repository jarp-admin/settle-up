import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { generatePaypalLink } from "../utils/payments";

export const tabRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tab.findMany();
  }),
  addToOrCreate: publicProcedure
    .input(
      z.object({
        amount: z.number().positive(),
        debtorID: z.string(),
        creditorID: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      let inverseTab = await ctx.prisma.tab.findFirst({
        where: {
          amount: input.amount,
          debtorID: input.creditorID,
          creditorID: input.debtorID,
        },
      });

      let inverseAmount = inverseTab?.amount;
      if (inverseAmount == undefined) {
        inverseAmount = 0;
      }

      let tabAmount = 0;
      const tab = await ctx.prisma.tab.findFirst({
        where: {
          debtorID: input.debtorID,
          creditorID: input.creditorID,
        },
      });

      if (input.amount > inverseAmount) {
        tabAmount = input.amount - inverseAmount;
        inverseAmount = 0;
      } else if (input.amount < inverseAmount) {
        tabAmount = 0;
        inverseAmount = inverseAmount - input.amount;
      } else {
        tabAmount = 0;
        inverseAmount = 0;
      }

      if (!tab) {
        const createdTab = await ctx.prisma.tab.create({
          data: {
            amount: tabAmount,
            debtorID: input.debtorID,
            creditorID: input.creditorID,
          },
        });

        const updatedInverseTab = await ctx.prisma.tab.updateMany({
          where: {
            debtorID: input.creditorID,
            creditorID: input.debtorID,
          },
          data: {
            amount: inverseAmount,
          },
        });
        return createdTab;
      }

      const updatedTab = await ctx.prisma.tab.updateMany({
        where: {
          debtorID: input.debtorID,
          creditorID: input.creditorID,
        },
        data: {
          amount: tabAmount,
        },
      });

      const updatedInverseTab = await ctx.prisma.tab.updateMany({
        where: {
          debtorID: input.creditorID,
          creditorID: input.debtorID,
        },
        data: {
          amount: inverseAmount,
        },
      });

      return updatedTab;
    }),
  clear: publicProcedure
    .input(
      z.object({
        debtorID: z.string(),
        creditorID: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const clearedTab = await ctx.prisma.tab.updateMany({
        where: {
          debtorID: input.debtorID,
          creditorID: input.creditorID,
        },
        data: {
          amount: 0,
        },
      });

      return clearedTab;
    }),
});
