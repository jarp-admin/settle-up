import trpc from "../trpc";

export const getDebtorCreditorIds = async (
  i: any,
  target: any
): Promise<{ debtorId: string; creditorId: string }> => {
  const debtorId = await trpc.user.getUserId.query({
    discordId: i.user.id,
  });
  if (debtorId == undefined) {
    throw new Error("No debtor selected");
  }

  const creditorId = await trpc.user.getUserId.query({
    discordId: target?.id,
  });
  if (creditorId == undefined) {
    throw new Error("No creditor selected");
  }

  return { debtorId, creditorId };
};
