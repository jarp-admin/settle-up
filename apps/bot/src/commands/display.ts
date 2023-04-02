import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types";
import { client } from "../trpc";

let display: Command = {
  command: new SlashCommandBuilder()
    .setName("display")
    .setDescription("Shows how much you owe someone")
    .addUserOption((option) =>
      option.setName("user").setDescription("user to ping").setRequired(true)
    ),

  handler: async (i) => {
    let target = i.options.getUser("user");
    if (target == null) {
      return;
    }

    const debtorId = await client.user.getUserId.query({
      discordId: i.user.id,
    });
    if (debtorId == undefined) {
      throw new Error("No debtor selected");
    }

    const creditorId = await client.user.getUserId.query({
      discordId: target?.id,
    });
    if (creditorId == undefined) {
      throw new Error("No creditor selected");
    }

    let iowethem = await client.tab.getTab.query({
      user1ID: debtorId,
      user2ID: creditorId,
    });
    if (iowethem == undefined) {
      throw new Error("no iowethem available");
    }

    let Response = "";

    if (iowethem > 0) {
      Response = `You owe ${target.username} £${iowethem}`;
    } else if (iowethem < 0) {
      iowethem = iowethem * -1;
      Response = `${target.username} owes you £${iowethem}`;
    } else {
      Response = `You and ${target.username} are squared up`;
    }

    await i.reply({ content: Response });
  },
};

export default display;
