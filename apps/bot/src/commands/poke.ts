import makeCommand from "../lib/makeCommand";
import { UserOption } from "../lib/options";
import { getDebtorCreditorIds } from "../utils/getuserid";

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
  async (i, { user }) => {
    let sender = i.user;

    const { debtorId, creditorId } = await getDebtorCreditorIds(i, user);

    let overall_tab = await trpc.tab.getTab.query({
      user1ID: debtorId,
      user2ID: creditorId,
    });
    if (overall_tab == undefined) {
      throw new Error("no iowe available");
    }

    let Response = ``;

    if (overall_tab > 0) {
      Response = `${sender.username} you owe ${user?.username} £${overall_tab}`;
    } else {
      overall_tab = overall_tab * -1;
      Response = `${user} pay your tab of £${overall_tab} to ${sender.username}`;
    }

    await i.reply({ content: Response });
  }
);

export default poke;
