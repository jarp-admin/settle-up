import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getUserFromDiscordID, sorted } from "../utils";

export const discordRouter = createTRPCRouter({
  getTab: publicProcedure
    .input(
      z.object({
        user1ID: z.string(),
        user2ID: z.string(),
      })
    )
    .output(z.number())
    .query(async ({ input: { user1ID, user2ID }, ctx }) => {
      const user1 = await getUserFromDiscordID(user1ID, ctx.prisma);
      const user2 = await getUserFromDiscordID(user2ID, ctx.prisma);

      let [userA, userB, flipped] = sorted(user1, user2);

      const tab = await ctx.prisma.tab.findUniqueOrThrow({
        where: {
          id: {
            userA_ID: userA.id,
            userB_ID: userB.id,
          },
        },
      });

      return flipped ? -tab.amountOwed : tab.amountOwed;
    }),
  addToOrCreate: publicProcedure
    .input(
      z.object({
        amount: z.number().positive().finite(),
        debtorID: z.string(),
        creditorID: z.string(),
      })
    )
    .output(z.number())
    .mutation(async ({ input: { debtorID, creditorID, amount }, ctx }) => {
      const debtor = await getUserFromDiscordID(debtorID, ctx.prisma);
      const creditor = await getUserFromDiscordID(creditorID, ctx.prisma);

      const [userA, userB, flipped] = sorted(debtor, creditor);
      const tab = await ctx.prisma.tab.upsert({
        where: {
          id: {
            userA_ID: userA.id,
            userB_ID: userB.id,
          },
        },
        create: {
          userA_ID: userA.id,
          userB_ID: userB.id,
          amountOwed: flipped ? -amount : amount,
        },
        update: {
          amountOwed: {
            increment: flipped ? -amount : amount,
          },
        },
      });

      const _transaction = await ctx.prisma.transaction.create({
        data: {
          tabUserA_ID: userA.id,
          tabUserB_ID: userB.id,

          amount: flipped ? -amount : amount,
        },
      });

      return flipped ? -tab.amountOwed : tab.amountOwed;
    }),
  clear: publicProcedure
    .input(
      z.object({
        user1ID: z.string(),
        user2ID: z.string(),
      })
    )
    .mutation(async ({ input: { user1ID, user2ID }, ctx }) => {
      const user1 = await getUserFromDiscordID(user1ID, ctx.prisma);
      const user2 = await getUserFromDiscordID(user2ID, ctx.prisma);

      let [userA, userB, _] = sorted(user1, user2);

      const _tab = await ctx.prisma.tab.update({
        where: {
          id: {
            userA_ID: userA.id,
            userB_ID: userB.id,
          },
        },
        data: {
          amountOwed: 0,
        },
      });

      const _transactions = await ctx.prisma.transaction.updateMany({
        where: {
          tabUserA_ID: userA.id,
          tabUserB_ID: userB.id,
          dateSettled: undefined,
        },
        data: {
          dateSettled: new Date(),
        },
      });

      return 0;
    }),
});
