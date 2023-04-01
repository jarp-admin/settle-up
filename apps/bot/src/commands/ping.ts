import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types";

let ping: Command = {
  command: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  handler: async (i) => {
    await i.reply("Pong!");
  },
};

export default ping;
