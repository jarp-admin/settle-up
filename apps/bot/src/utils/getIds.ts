import { User } from "discord.js";
import trpc from "../trpc";

export const getIds = async (
  target1: User,
  target2: User
): Promise<{ debtorId: string; creditorId: string }> => {
  const debtorId = await trpc.user.getUserId.query({
    discordId: target1.id,
  });
  if (debtorId == undefined) {
    throw new Error("No debtor selected");
  }

  const creditorId = await trpc.user.getUserId.query({
    discordId: target2.id,
  });
  if (creditorId == undefined) {
    throw new Error("No creditor selected");
  }

  return { debtorId, creditorId };
};
