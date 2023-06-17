import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { generatePaypalLink, getUserFromDiscordID, sorted } from "../utils";

export const paypalRouter = createTRPCRouter({
  getDiscordLink: publicProcedure
    .input(
      z.object({
        callerID: z.string(),
        targetID: z.string(),
      })
    )
    .output(z.object({ link: z.string().url(), recipientID: z.string() }))
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

      const paypalEmail =
        paymentAmount > 0 ? target.paypalEmail : caller.paypalEmail;
      // end The Fucky Bit (TM)

      if (!paypalEmail) {
        throw new Error("Unset Paypal Email");
      }
      return {
        link: generatePaypalLink(paymentAmount, "GBP", paypalEmail),
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
