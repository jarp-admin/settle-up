import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { generatePaypalLink } from "../utils/payments";

export const paymentRouter = createTRPCRouter({
  getLink: publicProcedure
    .input(
      z.object({
        debtorID: z.string(),
        creditorID: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const tab = await ctx.prisma.tab.findFirst({
        where: {
          debtorID: input.debtorID,
          creditorID: input.creditorID,
        },
      });

      const paymentAmount = tab?.amount;
      if (paymentAmount == undefined) {
        return;
      }

      const user = await ctx.prisma.user.findFirst({
        where: {
          id: input.creditorID,
        },
      });

      const paypalEmail = user?.paypalEmail;
      if (!paypalEmail) {
        return;
      }

      const settledTab = await ctx.prisma.tab.updateMany({
        where: {
          debtorID: input.debtorID,
          creditorID: input.creditorID,
        },
        data: {
          settled: true,
        },
      });

      return generatePaypalLink(paymentAmount, "GBP", paypalEmail);
    }),
});
