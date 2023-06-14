import makeCommand from "../lib/makeCommand";
import { StringOption, UserOption } from "../lib/options";
import { getIds } from "../utils/getIds";

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
    const { debtorId, creditorId } = await getIds(caller, user);

    let updatedTab = await trpc.tab.addToOrCreate.mutate({
      amount: parseFloat(payment),
      debtorID: debtorId,
      creditorID: creditorId,
    });
    
    if (updatedTab == undefined) {
      throw new Error("no cannot update tab");
    }

    let overall_tab = await trpc.tab.getTab.query({
      user1ID: debtorId,
      user2ID: creditorId,
    });
    if (overall_tab == undefined) {
      throw new Error("no iowe available");
    }

    let base = `Added £${payment} to ${caller.username}'s tab with ${user.username}. `;

    if (overall_tab > 0)
      return base + `You owe ${user.username} £${overall_tab}`;

    if (overall_tab < 0)
      return base + `${user.username} owes you £${overall_tab * -1}`;

    return base + `You and ${user.username} are squared up`;
  }
);

export default ioweu;
