import makeCommand from "../lib/makeCommand";
import { UserOption } from "../lib/options";

import { Ephemeral } from "../lib/response";
import trpc from "../trpc";

let poke = makeCommand(
  {
    name: "poke",
    description: "Asks someone to pay their tab",
    options: {
      target: UserOption({
        description: "Person to poke",
        required: true,
      }),
    },
  },

  async (caller, { target }) => {
    let tabAmount = await trpc.discord.getTabAmount.query({
      user1ID: caller.id,
      user2ID: target.id,
    });

    return tabAmount === 0
      ? Ephemeral(`You and ${target.username} are settled up`)
      : tabAmount > 0
      ? Ephemeral(`You owe ${target.username} £${tabAmount}`)
      : `${target} pay your tab of £${tabAmount * -1} to ${caller.username}`;
  }
);

export default poke;
