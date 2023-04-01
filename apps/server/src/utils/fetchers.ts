export const fetchTab = async (input, ctx) => {
  const tab = await ctx.prisma.tab.findFirst({
    where: {
      debtorID: input.debtorID,
      creditorID: input.creditorID,
    },
  });
};

export const fetchInverse = async (input, ctx) => {
  const inverseTab = await ctx.prisma.tab.findFirst({
    where: {
      amount: input.amount,
      debtorID: input.creditorID,
      creditorID: input.debtorID,
    },
  });

  let inverseAmount = inverseTab?.amount;
  if (inverseAmount == undefined) {
    inverseAmount = 0;
  }

  return inverseAmount;
};
