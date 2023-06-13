import makeCommand from "../lib/makeCommand";
import { UserOption } from "../lib/options";
import { getIds } from "../utils/getIds";

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
    const { debtorId, creditorId } = await getIds(caller, user);

    let debt = await trpc.tab.getTab.query({
      user1ID: debtorId,
      user2ID: creditorId,
    });
    if (debt == undefined) {
      throw new Error("no iowethem available");
    }

    if (debt > 0) return `You owe ${user.username} £${debt}`;

    if (debt < 0) return `${user.username} owes you £${debt * -1}`;

    return `You and ${user.username} are squared up`;
  }
);
