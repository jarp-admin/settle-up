import makeCommand from "../lib/makeCommand";
import { StringOption, UserOption } from "../lib/options";

import trpc from "../trpc";

let ioweu = makeCommand(
  {
    name: "ioweu",
    description: "Adds to your tab with another person",
    options: {
      target: UserOption({
        description: "Person you owe",
        required: true,
      }),
      payment: StringOption({
        description: "The amount you owe",
        required: true,
      }),
    },
  },
  async (caller, { target, payment }) => {
    let tabAmount = await trpc.discord.addToOrCreate.mutate({
      amount: parseFloat(payment),
      debtorID: caller.id,
      creditorID: target.id,
    });

    let details =
      tabAmount === 0
        ? `${caller.username} and ${target.username} are settled up`
        : tabAmount > 0
        ? `${caller.username} owes ${target.username} £${tabAmount}`
        : `${target.username} owes ${caller.username} £${tabAmount * -1}`;

    return `Added £${payment} to ${caller.username}'s tab with ${target}. ${details}`;
  }
);

export default ioweu;
