import makeCommand from "../lib/makeCommand";
import { UserOption } from "../lib/options";

import trpc from "../trpc";

export default makeCommand(
  {
    name: "display",
    description: "Shows how much you owe someone",
    options: {
      user: UserOption({
        description: "User you want your debt with",
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
      ? `You and ${user.username} are settled up`
      : tabAmount > 0
      ? `You owe ${user.username} £${tabAmount}`
      : `${user.username} owes you £${tabAmount * -1}`;
  }
);
