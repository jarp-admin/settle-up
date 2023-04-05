import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUserId: publicProcedure
    .input(
      z.object({
        discordId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const account = await ctx.prisma.account.findFirst({
        where: {
          providerAccountId: input.discordId,
        },
      });

      return account?.userId;
    }),
  updatePaypalEmail: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        paypalEmail: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          paypalEmail: input.paypalEmail,
        },
      });
    }),
});
