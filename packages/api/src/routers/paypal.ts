import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { generatePaypalLink, getUserFromDiscordID, sorted } from "../utils";
import { TRPCError } from "@trpc/server";

export const paypalRouter = createTRPCRouter({
  getDiscordLink: publicProcedure
    .input(
      z.object({
        callerID: z.string(),
        targetID: z.string(),
      })
    )
    .output(
      z.object({
        link: z.string().url(),
        amount: z.number(),
        recipientID: z.string(),
      })
    )
    .query(async ({ input: { callerID, targetID }, ctx }) => {
      const caller = await getUserFromDiscordID(callerID, ctx.prisma);
      const target = await getUserFromDiscordID(targetID, ctx.prisma);

      let [userA, userB, flipped] = sorted(caller, target);

      const tab = await ctx.prisma.tab.findUniqueOrThrow({
        where: {
          id: {
            userA_ID: userA.id,
            userB_ID: userB.id,
          },
        },
      });

      // The Fucky Bit (TM)
      const paymentAmount = flipped ? -tab.amountOwed : tab.amountOwed;

      if (paymentAmount === 0)
        throw new TRPCError({
          message: "link generated for tab of 0",
          code: "UNPROCESSABLE_CONTENT",
        });

      const paypalEmail =
        paymentAmount > 0 ? target.paypalEmail : caller.paypalEmail;
      // end The Fucky Bit (TM)

      if (!paypalEmail) {
        throw new TRPCError({
          message: "Unset Paypal Email",
          code: "NOT_FOUND",
        });
      }

      return {
        link: generatePaypalLink(paymentAmount, "GBP", paypalEmail),
        amount: paymentAmount,
        recipientID: paymentAmount > 0 ? targetID : callerID,
      };
    }),

  updatePaypalEmail: publicProcedure
    .input(
      z.object({
        userID: z.string(),
        paypalEmail: z.string().email(),
      })
    )
    .mutation(async ({ input: { userID, paypalEmail }, ctx }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: userID,
        },
        data: {
          paypalEmail: paypalEmail,
        },
      });
      return { message: "Paypal email updated successfully." };
    }),
});
