import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../types";

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
    let amount = -10; //this will be the overall amount owed between the users, positive if sender owes reciever, negative otherwise
    let payment = i.options.getString("payment");
    let x = `Added ${payment} to ${i.user}'s tab with ${target} /n`;
    let Response = "";
    if (amount > 0) {
      Response = x + `You owe ${target} ${amount}`;
    } else if (amount < 0) {
      amount = amount * -1;
      Response = x + `${target} owes you ${amount}`;
    } else {
      Response = x + `You and ${target} are squared up`;
    }
    await i.reply({ content: Response });
  },
};

export default ioweu;
