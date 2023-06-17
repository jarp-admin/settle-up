import makeCommand from "../lib/makeCommand";
import { UserOption } from "../lib/options";

import { Ephemeral } from "../lib/response";
import trpc from "../trpc";

let poke = makeCommand(
  {
    name: "poke",
    description: "Reminds someone to pay their tab",
    options: {
      user: UserOption({
        description: "user to ping",
        required: true,
      }),
    },
  },

  async (caller, { user }) => {
    let tabAmount = await trpc.discord.getTabAmount.query({
      user1ID: caller.id,
      user2ID: user.id,
    });

    return tabAmount === 0
      ? Ephemeral(`You and ${user.username} are settled up`)
      : tabAmount > 0
      ? Ephemeral(`${caller.username} you owe ${user.username} £${tabAmount}`)
      : `${user} pay your tab of £${tabAmount * -1} to ${caller.username}`;
  }
);

export default poke;
