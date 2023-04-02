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

  getMostCredited: publicProcedure.query(async ({ ctx }) => {
    const allUsers = await ctx.prisma.user.findMany({
      include: { credits: true },
    });

    const userCreditMap = allUsers.reduce((acc, user) => {
      let totalCredit = user.credits.reduce((prevCredit, tab) => {
        return prevCredit + tab.amount;
      }, 0);
      let name = user.name!;

      acc.set(name, totalCredit);
      return acc;
    }, new Map<string, number>());

    return new Map([...userCreditMap.entries()].sort((a, b) => a[1] - b[1]));
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
});
