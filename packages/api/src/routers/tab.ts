import { z } from "zod";
import { TRPCError, createTRPCRouter, publicProcedure } from "../trpc";
import { prismaErrorHandler } from "../utils";

export const tabRouter = createTRPCRouter({
  getTab: publicProcedure
    .input(
      z.object({
        debtorId: z.string(),
        creditorId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const tab = await ctx.prisma.tab.findFirstOrThrow({
          where: {
            debtorID: input.debtorId,
            creditorID: input.creditorId,
          },
        });

        return tab.amount;
      } catch (e) {
        if (e instanceof Error) {
          prismaErrorHandler(e);
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

        const debtorTo = all_tabs.filter((t) => t.debtorID === input.userID);
        const creditorTo = all_tabs.filter(
          (t) => t.creditorID === input.userID
        );

        return { debtorTo, creditorTo };
      } catch (e) {
        if (e instanceof Error) {
          prismaErrorHandler(e);
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
        const newTab = await ctx.prisma.tab.upsert({
          where: {
            debtorAndCreditor: {
              debtorID: input.debtorID,
              creditorID: input.creditorID,
            },
          },
          create: {
            debtorID: input.debtorID,
            creditorID: input.creditorID,
            amount: input.amount,
          },
          update: {
            amount: {
              increment: input.amount,
            },
          },
        });

        return newTab;
      } else if (inverseTabAmount > 0) {
        if (inverseTabAmount >= input.amount) {
          const newInverseTab = await ctx.prisma.tab.update({
            where: {
              debtorAndCreditor: {
                debtorID: input.creditorID,
                creditorID: input.debtorID,
              },
            },
            data: {
              amount: {
                decrement: input.amount,
              },
            },
          });
          return inverseTab;
        } else {
          const newInverseTab = await ctx.prisma.tab.update({
            where: {
              debtorAndCreditor: {
                debtorID: input.creditorID,
                creditorID: input.debtorID,
              },
            },
            data: {
              amount: 0,
            },
          });

          const newTab = await ctx.prisma.tab.upsert({
            where: {
              debtorAndCreditor: {
                debtorID: input.debtorID,
                creditorID: input.creditorID,
              },
            },
            create: {
              debtorID: input.debtorID,
              creditorID: input.creditorID,
              amount: input.amount,
            },
            update: {
              amount: {
                increment: input.amount,
              },
            },
          });

          return newTab;
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
      try {
        const clearedTab = await ctx.prisma.tab.update({
          where: {
            debtorAndCreditor: {
              debtorID: input.debtorID,
              creditorID: input.creditorID,
            },
          },
          data: {
            amount: 0,
          },
        });
        return clearedTab;
      } catch (e) {
        if (e instanceof Error) {
          prismaErrorHandler(e);
        }
      }
    }),
});
