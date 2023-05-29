import { ApplicationCommandOptionType as optTypes } from "discord.js";
import makeCommand from "../lib/makeCommand";
import trpc from "../trpc";
import { getDebtorCreditorIds } from "../utils/getuserid";

let ioweu = makeCommand(
  {
    name: "ioweu",
    description: "Add to your outstanding tab with a person",
    options: {
      user: {
        type: optTypes.User,
        description: "user to owe",
        required: true,
      },
      payment: {
        type: optTypes.String,
        description: "amount to owe",
        required: true,
      },
    },
  },
  async (i, { user, payment }) => {
    const { debtorId, creditorId } = await getDebtorCreditorIds(i, user);

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

    let x = `Added £${payment} to ${i.user.username}'s tab with ${user.username}. `;

    let Response = "";

    if (overall_tab > 0) {
      Response = x + `You owe ${user.username} £${overall_tab}`;
    } else if (overall_tab < 0) {
      overall_tab = overall_tab * -1;
      Response = x + `${user.username} owes you £${overall_tab}`;
    } else {
      Response = x + `You and ${user.username} are squared up`;
    }
    await i.reply({ content: Response });
  }
);

export default ioweu;
