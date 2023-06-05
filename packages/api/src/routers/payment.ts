import { z } from "zod";
import { TRPCError, createTRPCRouter, publicProcedure } from "../trpc";
import { generatePaypalLink, prismaErrorHandler } from "../utils";

export const paymentRouter = createTRPCRouter({
  getLink: publicProcedure
    .input(
      z.object({
        debtorID: z.string(),
        creditorID: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const tab = await ctx.prisma.tab.findFirstOrThrow({
          where: {
            debtorID: input.debtorID,
            creditorID: input.creditorID,
          },
        });

        const paymentAmount = tab?.amount;

        const user = await ctx.prisma.user.findFirstOrThrow({
          where: {
            id: input.creditorID,
          },
        });

        const paypalEmail = user?.paypalEmail;
        if (!paypalEmail) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message:
              "This user has not provided an email address associated with their paypal account.",
          });
        }

        const settledTab = await ctx.prisma.tab.update({
          where: {
            debtorAndCreditor: {
              debtorID: input.creditorID,
              creditorID: input.debtorID,
            },
          },
          data: {
            settled: true,
            amount: 0,
          },
        });

        return generatePaypalLink(paymentAmount, "GBP", paypalEmail);
      } catch (e) {
        if (e instanceof Error) {
          prismaErrorHandler(e);
        }
      }
    }),
});
