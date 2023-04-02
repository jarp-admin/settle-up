import { client } from "../trpc";

export const getDebtorCreditorIds = async (
  i: any,
  target: any
) => {
  const debtorId = await client.user.getUserId.query({
    discordId: i.user.id,
  });
  if (debtorId == undefined) {
    throw new Error("No debtor selected");
  }

  const creditorId = await client.user.getUserId.query({
    discordId: target?.id,
  });
  if (creditorId == undefined) {
    throw new Error("No creditor selected");
  }

  return { debtorId, creditorId };
};
