import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  User,
} from "discord.js";
import { Command } from "../types";
import withUserOption from "../decorators/withUserOption";

@withUserOption({
  name: "target",
  description: "user to ping",
})
class ping implements Command {
  accessor command = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("replies with pong!");

  async handler(
    i: ChatInputCommandInteraction<CacheType>,
    { target }: { target: User } // I know this kinda sucks, but I can't get around it...
  ) {
    await i.reply({ content: `Pong! ${target}` });
  }
}

export default ping;
