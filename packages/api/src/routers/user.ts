import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prismaErrorHandler } from "../utils";

export const userRouter = createTRPCRouter({
  getUserIdFromDiscordId: publicProcedure
    .input(
      z.object({
        discordId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const account = await ctx.prisma.account.findFirstOrThrow({
          where: {
            providerAccountId: input.discordId,
          },
        });

        return account?.userId;
      } catch (e) {
        if (e instanceof Error) {
          prismaErrorHandler(e);
        }
      }
    }),

  updatePaypalEmail: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        paypalEmail: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const user = await ctx.prisma.user.update({
          where: {
            id: input.userId,
          },
          data: {
            paypalEmail: input.paypalEmail,
          },
        });

        return user;
      } catch (e) {
        if (e instanceof Error) {
          prismaErrorHandler(e);
        }
      }
    }),
});
