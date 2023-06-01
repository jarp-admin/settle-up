import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { handlePrismaError } from "../utils";

export const tabRouter = createTRPCRouter({
  getTab: publicProcedure
    .input(
      z.object({
        deptorId: z.string(),
        creditorId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const tab = await ctx.prisma.tab.findFirstOrThrow({
          where: {
            debtorID: input.deptorId,
            creditorID: input.creditorId,
          },
        });

        return tab.amount;
      } catch (e) {
        if (e instanceof Error) {
        }
      }
    }),

  getAllTabsForAccount: publicProcedure
    .input(
      z.object({
        userID: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const all_tabs = await ctx.prisma.tab.findMany({
        where: {
          OR: [{ debtorID: input.userID }, { creditorID: input.userID }],
        },
      });

      const deptorTo = all_tabs.filter((t) => t.debtorID === input.userID);
      const creditorTo = all_tabs.filter((t) => t.creditorID === input.userID);

      return { deptorTo, creditorTo };
    }),

  addToOrCreate: publicProcedure
    .input(
      z.object({
        amount: z.number().positive().finite(),
        debtorID: z.string(),
        creditorID: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      let tabs = await ctx.prisma.tab.findMany({
        where: {
          OR: [
            {
              debtorID: input.debtorID,
              creditorID: input.creditorID,
            },
            {
              debtorID: input.creditorID,
              creditorID: input.debtorID,
            },
          ],
        },
        take: 2,
      });

      const tabAmount = tabs.find(
        (t) =>
          t.debtorID === input.debtorID && t.creditorID === input.creditorID
      )?.amount;
      const inverseTabAmount = tabs.find(
        (t) =>
          t.debtorID === input.creditorID && t.creditorID === input.debtorID
      )?.amount;

      let newTabAmount: number, newInverseTabAmount: number;

      if (!tabAmount || tabAmount == 0) {
        if (!inverseTabAmount || inverseTabAmount == 0) {
          const createdTab = await ctx.prisma.tab.create({
            data: {
              amount: input.amount,
              debtorID: input.debtorID,
              creditorID: input.creditorID,
            },
          });
          return createdTab.amount;
        } else {
          if (input.amount > inverseTabAmount) {
            newTabAmount = input.amount - inverseTabAmount;
            newInverseTabAmount = 0;
          } else if (input.amount < inverseTabAmount) {
            newTabAmount = 0;
            newInverseTabAmount = inverseTabAmount - input.amount;
          } else {
            newTabAmount = 0;
            newInverseTabAmount = 0;
          }

          const createdTab = await ctx.prisma.tab.create({
            data: {
              amount: newTabAmount,
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
              amount: newInverseTabAmount,
            },
          });
          return createdTab.amount;
        }
      } else {
        if (!inverseTabAmount) {
          const updatedTab = await ctx.prisma.tab.updateMany({
            where: {
              debtorID: input.debtorID,
              creditorID: input.creditorID,
            },
            data: {
              amount: {
                increment: input.amount,
              },
            },
          });

          // TODO: change debtorID and creditorID to unique objects
          return 0;
        } else {
          if (tabAmount + input.amount > inverseTabAmount) {
            newTabAmount = tabAmount + input.amount - inverseTabAmount;
            newInverseTabAmount = 0;
          } else if (tabAmount + input.amount < inverseTabAmount) {
            newTabAmount = 0;
            newInverseTabAmount = inverseTabAmount - (tabAmount + input.amount);
          } else {
            newTabAmount = 0;
            newInverseTabAmount = 0;
          }

          const updatedTab = await ctx.prisma.tab.updateMany({
            where: {
              debtorID: input.debtorID,
              creditorID: input.creditorID,
            },
            data: {
              amount: newTabAmount,
            },
          });

          const updatedInverseTab = await ctx.prisma.tab.updateMany({
            where: {
              debtorID: input.creditorID,
              creditorID: input.debtorID,
            },
            data: {
              amount: newInverseTabAmount,
            },
          });

          // TODO: change debtorID and creditorID to unique objects
          return 0;
        }
      }
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
