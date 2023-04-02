import { SlashCommandBuilder } from "discord.js";

import { Command } from "../types";
import { getDebtorCreditorIds } from "../utils/getuserid";
import trpc from "../trpc";

let poke: Command = {
  command: new SlashCommandBuilder()
    .setName("poke")
    .setDescription("Reminds someone to pay their tab")
    .addUserOption((option) =>
      option.setName("user").setDescription("user to ping").setRequired(true)
    ),

  handler: async (i) => {
    let target = i.options.getUser("user");
    let sender = i.user;

    const { debtorId, creditorId } = await getDebtorCreditorIds(i, target);

    let overall_tab = await trpc.tab.getTab.query({
      user1ID: debtorId,
      user2ID: creditorId,
    });
    if (overall_tab == undefined) {
      throw new Error("no iowe available");
    }

    let Response = ``;

    if (overall_tab > 0) {
      Response = `${sender.username} you owe ${target?.username} £${overall_tab}`;
    } else {
      overall_tab = overall_tab * -1;
      Response = `${target} pay your tab of £${overall_tab} to ${sender.username}`;
    }

    await i.reply({ content: Response });
  },
};

export default poke;
