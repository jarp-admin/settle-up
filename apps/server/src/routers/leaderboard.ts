import { getDateDiff } from "./../utils/dateDiff";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const leaderboardRouter = createTRPCRouter({
  getMostDebt: publicProcedure.query(async ({ ctx }) => {
    const allUsers = await ctx.prisma.user.findMany({
      include: { debts: true },
    });

    const userDebtMap = allUsers.reduce((acc, user) => {
      let totalDebt = user.debts.reduce((prevDebt, tab) => {
        return prevDebt + tab.amount;
      }, 0);
      let name = user.name!;

      acc.set(name, totalDebt);
      return acc;
    }, new Map<string, number>());

    return new Map([...userDebtMap.entries()].sort((a, b) => a[1] - b[1]));
  }),

  getDebtHistory: publicProcedure.query(async ({ ctx }) => {
    const allUsers = await ctx.prisma.user.findMany();

    const allTabActions = await ctx.prisma.tabAction.findMany();

    const firstDate = allTabActions.at(0)?.date!;
    const lastDate = allTabActions.at(allTabActions.length - 1)?.date!;

    const diffDays = getDateDiff(lastDate, firstDate);

    const emptyDebtHistory: number[] = Array(diffDays).fill(0);

    let userDebtHistoryMap = allUsers.reduce((acc, user) => {
      acc.set(user.id!, [...emptyDebtHistory]);
      return acc;
    }, new Map<string, number[]>());

    allTabActions.forEach((tab) => {
      let i = getDateDiff(tab.date, firstDate);
      let debt = userDebtHistoryMap.get(tab.debtorID)!;
      let credit = userDebtHistoryMap.get(tab.creditorID)!;
      debt[i] += tab.amount;
      credit[i] -= tab.amount;
      userDebtHistoryMap.set(tab.debtorID, debt);
      userDebtHistoryMap.set(tab.creditorID, credit);
    });

    return userDebtHistoryMap;
  }),
  //   getTab: publicProcedure
  //     .input(
  //       z.object({
  //         user1ID: z.string(),
  //         user2ID: z.string(),
  //       })
  //     )
  //     .query(async ({ input, ctx }) => {
  //       const tab = await ctx.prisma.tab.findFirst({
  //         where: {
  //           debtorID: input.user1ID,
  //           creditorID: input.user2ID,
  //         },
  //       });

  //       if (tab?.amount != 0) {
  //         return tab?.amount;
  //       } else {
  //         const inverseTab = await ctx.prisma.tab.findFirst({
  //           where: {
  //             debtorID: input.user2ID,
  //             creditorID: input.user1ID,
  //           },
  //         });
  //         if (inverseTab?.amount == 0 || inverseTab?.amount == undefined) {
  //           return 0;
  //         }

  //         return -inverseTab?.amount;
  //       }
  //     }),

  // getAllTabs: publicProcedure
  //   .input(
  //     z.object({
  //       userID: z.string(),
  //     })
  //   )
  //   .query(async ({ input, ctx }) => {
  //     const iou = await ctx.prisma.tab.findMany({
  //       where: {
  //         debtorID: input.userID,
  //       },
  //     });

  //     const uome = await ctx.prisma.tab.findMany({
  //       where: {
  //         creditorID: input.userID,
  //       },
  //     });

  //     return { iOwe: iou, oweMe: uome };
  //   }),

  // addToOrCreate: publicProcedure
  //   .input(
  //     z.object({
  //       amount: z.number().positive().finite(),
  //       debtorID: z.string(),
  //       creditorID: z.string(),
  //     })
  //   )
  //   .mutation(async ({ input, ctx }) => {
  //     let inverseTab = await ctx.prisma.tab.findFirst({
  //       where: {
  //         amount: input.amount,
  //         debtorID: input.creditorID,
  //         creditorID: input.debtorID,
  //       },
  //     });

  //     let inverseAmount = inverseTab?.amount;
  //     if (inverseAmount == undefined) {
  //       inverseAmount = 0;
  //     }

  //     let tabAmount = 0;
  //     const tab = await ctx.prisma.tab.findFirst({
  //       where: {
  //         debtorID: input.debtorID,
  //         creditorID: input.creditorID,
  //       },
  //     });

  //     if (input.amount > inverseAmount) {
  //       tabAmount = input.amount - inverseAmount;
  //       inverseAmount = 0;
  //     } else if (input.amount < inverseAmount) {
  //       tabAmount = 0;
  //       inverseAmount = inverseAmount - input.amount;
  //     } else {
  //       tabAmount = 0;
  //       inverseAmount = 0;
  //     }

  //     if (!tab) {
  //       const createdTab = await ctx.prisma.tab.create({
  //         data: {
  //           amount: tabAmount,
  //           debtorID: input.debtorID,
  //           creditorID: input.creditorID,
  //         },
  //       });

  //       const updatedInverseTab = await ctx.prisma.tab.updateMany({
  //         where: {
  //           debtorID: input.creditorID,
  //           creditorID: input.debtorID,
  //         },
  //         data: {
  //           amount: inverseAmount,
  //         },
  //       });
  //       return createdTab;
  //     }

  //     const updatedTab = await ctx.prisma.tab.updateMany({
  //       where: {
  //         debtorID: input.debtorID,
  //         creditorID: input.creditorID,
  //       },
  //       data: {
  //         amount: tabAmount,
  //       },
  //     });

  //     const updatedInverseTab = await ctx.prisma.tab.updateMany({
  //       where: {
  //         debtorID: input.creditorID,
  //         creditorID: input.debtorID,
  //       },
  //       data: {
  //         amount: inverseAmount,
  //       },
  //     });

  //     return updatedTab;
  //   }),

  // clear: publicProcedure
  //   .input(
  //     z.object({
  //       debtorID: z.string(),
  //       creditorID: z.string(),
  //     })
  //   )
  //   .mutation(async ({ input, ctx }) => {
  //     const clearedTab = await ctx.prisma.tab.updateMany({
  //       where: {
  //         debtorID: input.debtorID,
  //         creditorID: input.creditorID,
  //       },
  //       data: {
  //         amount: 0,
  //       },
  //     });

  //     return clearedTab;
  //   }),
});
