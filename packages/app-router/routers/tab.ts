import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { generatePaypalLink } from "../utils/payments";

export const tabRouter = createTRPCRouter({
  getTab: publicProcedure
    .input(
      z.object({
        user1ID: z.string(),
        user2ID: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const tab = await ctx.prisma.tab.findFirst({
        where: {
          debtorID: input.user1ID,
          creditorID: input.user2ID,
        },
      });

      if (tab?.amount != 0) {
        return tab?.amount;
      } else {
        const inverseTab = await ctx.prisma.tab.findFirst({
          where: {
            debtorID: input.user2ID,
            creditorID: input.user1ID,
          },
        });
        if (inverseTab?.amount == 0 || inverseTab?.amount == undefined) {
          return 0;
        }

        return -inverseTab?.amount;
      }
    }),
  getAllTabs: publicProcedure
    .input(
      z.object({
        userID: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const iou = await ctx.prisma.tab.findMany({
        where: {
          debtorID: input.userID,
        },
      });

      const uome = await ctx.prisma.tab.findMany({
        where: {
          creditorID: input.userID,
        },
      });

      return { iOwe: iou, oweMe: uome };
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
      let inverseTab = await ctx.prisma.tab.findFirst({
        where: {
          debtorID: input.creditorID,
          creditorID: input.debtorID,
        },
      });

      let inverseAmount = inverseTab?.amount;

      const tab = await ctx.prisma.tab.findFirst({
        where: {
          debtorID: input.debtorID,
          creditorID: input.creditorID,
        },
      });

      let tabAmount = tab?.amount;

      if (!tab) {
        if (!inverseTab) {
          console.log("hello1");
          const createdTab = await ctx.prisma.tab.create({
            data: {
              amount: input.amount,
              debtorID: input.debtorID,
              creditorID: input.creditorID,
            },
          });
          return createdTab.amount;
        } else {
          console.log("hello2");
          if (input.amount > inverseAmount!) {
            tabAmount = input.amount - inverseAmount!;
            inverseAmount = 0;
          } else if (input.amount < inverseAmount!) {
            tabAmount = 0;
            inverseAmount = inverseAmount! - input.amount;
          } else {
            tabAmount = 0;
            inverseAmount = 0;
          }

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
          return createdTab.amount;
        }
      } else {
        if (!inverseAmount) {
          console.log("hello3");
          const createdTab = await ctx.prisma.tab.updateMany({
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

          const updatedTab = await ctx.prisma.tab.findFirst({
            where: {
              debtorID: input.debtorID,
              creditorID: input.creditorID,
            },
          });
          return updatedTab?.amount;
        } else {
          console.log("hello4");
          if (tab.amount + input.amount > inverseAmount) {
            tabAmount = tab.amount + input.amount - inverseAmount;
            inverseAmount = 0;
          } else if (tab.amount + input.amount < inverseAmount) {
            tabAmount = 0;
            inverseAmount = inverseAmount - (tab.amount + input.amount);
          } else {
            tabAmount = 0;
            inverseAmount = 0;
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

          const updatedTabFind = await ctx.prisma.tab.findFirst({
            where: {
              debtorID: input.debtorID,
              creditorID: input.creditorID,
            },
          });

          return updatedTabFind?.amount;
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
