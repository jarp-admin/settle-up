import makeCommand from "../lib/makeCommand";
import { UserOption } from "../lib/options";
import { getDebtorCreditorIds } from "../utils/getuserid";

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
  async (i, { user }) => {
    const { debtorId, creditorId } = await getDebtorCreditorIds(i, user);

    let debt = await trpc.tab.getTab.query({
      user1ID: debtorId,
      user2ID: creditorId,
    });
    if (debt == undefined) {
      throw new Error("no iowethem available");
    }

    let Response = "";

    if (debt > 0) {
      Response = `You owe ${user.username} £${debt}`;
    } else if (debt < 0) {
      Response = `${user.username} owes you £${debt * -1}`;
    } else {
      Response = `You and ${user.username} are squared up`;
    }

    await i.reply({ content: Response });
  }
);
