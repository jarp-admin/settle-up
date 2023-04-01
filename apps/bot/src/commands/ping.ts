import { SlashCommandBuilder } from "discord.js";
import { Command } from "~/types";

let ping: Command = {
  command: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!")
    .addUserOption((option) =>
      option.setName("user").setDescription("user to ping")
    ),

  handler: async (i) => {
    let target = i.options.getUser("user");
    await i.reply({ content: `Pong! ${target}` });
  },
};

export default ping;
