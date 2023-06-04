import { z } from "zod";
import { TRPCError, createTRPCRouter, publicProcedure } from "../trpc";
import { fetchOrUpdateErrorHandler } from "../utils";
import { Prisma } from "database";

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
          fetchOrUpdateErrorHandler(e);
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
      try {
        const all_tabs = await ctx.prisma.tab.findMany({
          where: {
            OR: [{ debtorID: input.userID }, { creditorID: input.userID }],
          },
        });

        if (all_tabs.length == 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No tabs where found for the provided user.",
          });
        }

        const deptorTo = all_tabs.filter((t) => t.debtorID === input.userID);
        const creditorTo = all_tabs.filter(
          (t) => t.creditorID === input.userID
        );

        return { deptorTo, creditorTo };
      } catch (e) {
        if (e instanceof Error) {
          fetchOrUpdateErrorHandler(e);
        }
      }
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
      const inverseTab = await ctx.prisma.tab.findFirst({
        where: {
          debtorID: input.creditorID,
          creditorID: input.debtorID,
        },
      });

      const inverseTabAmount = inverseTab?.amount;

      if (!inverseTabAmount || inverseTabAmount == 0) {
        // increment or create tab
      } else if (inverseTabAmount > 0) {
        // update inversetab and maybe increment or create tab
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
      try {
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
      } catch (e) {
        if (e instanceof Error) {
          fetchOrUpdateErrorHandler(e);
        }
      }
    }),
});
