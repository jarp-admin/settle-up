import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../types";
import { client } from "../trpc";
import { getDebtorCreditorIds } from "../utils/getuserid";

let ioweu: Command = {
  command: new SlashCommandBuilder()
    .setName("ioweu")
    .setDescription("Add to your outstanding tab with a person")
    .addUserOption((option) =>
      option.setName("user").setDescription("user to owe").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("payment")
        .setDescription("amount to owe")
        .setRequired(true)
    ),

  handler: async (i) => {
    let payment = i.options.getString("payment");
    if (payment == null) {
      return;
    }
    let target = i.options.getUser("user");
    if (target == null) {
      return;
    }

    const { debtorId, creditorId } = await getDebtorCreditorIds(
      client,
      i,
      target
    );

    let updatedTab = await client.tab.addToOrCreate.mutate({
      amount: parseFloat(payment),
      debtorID: debtorId,
      creditorID: creditorId,
    });
    if (updatedTab == undefined) {
      throw new Error("no cannot update tab");
    }

    let overall_tab = await client.tab.getTab.query({
      user1ID: debtorId,
      user2ID: creditorId,
    });
    if (overall_tab == undefined) {
      throw new Error("no iowe available");
    }

    let x = `Added £${payment} to ${i.user.username}'s tab with ${target.username}. `;

    let Response = "";

    if (overall_tab > 0) {
      Response = x + `You owe ${target.username} £${overall_tab}`;
    } else if (overall_tab < 0) {
      overall_tab = overall_tab * -1;
      Response = x + `${target.username} owes you £${overall_tab}`;
    } else {
      Response = x + `You and ${target.username} are squared up`;
    }
    await i.reply({ content: Response });
  },
};

export default ioweu;
