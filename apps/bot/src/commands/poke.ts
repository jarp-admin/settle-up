import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types";

let poke: Command = {
  command: new SlashCommandBuilder()
    .setName("poke")
    .setDescription("Reminds someone to pay their tab")
    .addUserOption((option) =>
      option.setName("user").setDescription("user to ping")
    ),

  handler: async (i) => {
    let target = i.options.getUser("user");
    await i.reply({ content: `${target} pay your tab to ${i.user.username}` });
  },
};

export default poke;
