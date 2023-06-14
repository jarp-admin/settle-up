import makeCommand from "../lib/makeCommand";
import { UserOption } from "../lib/options";
import { getIds } from "../utils/getIds";

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
    const { debtorId, creditorId } = await getIds(caller, user);

    let overall_tab = await trpc.tab.getTab.query({
      user1ID: debtorId,
      user2ID: creditorId,
    });

    if (overall_tab == undefined) {
      throw new Error("no iowe available");
    }

    if (overall_tab > 0)
      return `${caller.username} you owe ${user.username} £${overall_tab}`;
    else
      return `${user} pay your tab of £${overall_tab * -1} to ${
        caller.username
      }`;
  }
);

export default poke;
