import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../types";
import { client } from "../trpc";

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
    let target = i.options.getUser("user");
    if (target == null) {
      return;
    }

    const deptorId = await client.user.getUserId.query({
      discordId: i.user.id,
    });
    if (deptorId == undefined) {
      throw new Error("No deptor selected");
    }

    const creditorId = await client.user.getUserId.query({
      discordId: target?.id,
    });
    if (creditorId == undefined) {
      throw new Error("No creditor selected");
    }

    let overall_tab = await client.tab.getTab.query({
      user1ID: deptorId,
      user2ID: creditorId,
    });
    if (overall_tab == undefined) {
      throw new Error("no iowethem available");
    }

    let payment = i.options.getString("payment");

    let x = `Added ${payment} to ${i.user}'s tab with ${target}. `;

    let Response = "";

    if (overall_tab > 0) {
      Response = x + `You owe ${target} ${overall_tab}`;
    } else if (overall_tab < 0) {
      overall_tab = overall_tab * -1;
      Response = x + `${target} owes you ${overall_tab}`;
    } else {
      Response = x + `You and ${target} are squared up`;
    }
    await i.reply({ content: Response });
  },
};

export default ioweu;
