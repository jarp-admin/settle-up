import makeCommand from "../lib/makeCommand";
import { UserOption } from "../lib/options";
import { Ephemeral } from "../lib/response";

import trpc from "../trpc";

export default makeCommand(
  {
    name: "display",
    description: "Shows the tab between you and another person",
    options: {
      target: UserOption({
        description: "Person you want to see your tab with",
        required: true,
      }),
    },
  },
  async (caller, { target }) => {
    let tabAmount = await trpc.discord.getTabAmount.query({
      user1ID: caller.id,
      user2ID: target.id,
    });

    return Ephemeral(
      tabAmount === 0
        ? `You and ${target.username} are settled up`
        : tabAmount > 0
        ? `You owe ${target.username} £${tabAmount}`
        : `${target.username} owes you £${tabAmount * -1}`
    );
  }
);
