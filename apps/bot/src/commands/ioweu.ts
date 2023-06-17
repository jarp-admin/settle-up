import makeCommand from "../lib/makeCommand";
import { StringOption, UserOption } from "../lib/options";

import trpc from "../trpc";

let ioweu = makeCommand(
  {
    name: "ioweu",
    description: "Add to your outstanding tab with a person",
    options: {
      user: UserOption({
        description: "user to owe",
        required: true,
      }),
      payment: StringOption({
        description: "amount to owe",
        required: true,
      }),
    },
  },
  async (caller, { user, payment }) => {
    let tabAmount = await trpc.discord.addToOrCreate.mutate({
      amount: parseFloat(payment),
      debtorID: caller.id,
      creditorID: user.id,
    });

    let details =
      tabAmount === 0
        ? `You and ${user.username} are settled up`
        : tabAmount > 0
        ? `You owe ${user.username} £${tabAmount}`
        : `${user.username} owes you £${tabAmount * -1}`;

    return `Added £${payment} to ${caller.username}'s tab with ${user.username}. ${details}`;
  }
);

export default ioweu;
