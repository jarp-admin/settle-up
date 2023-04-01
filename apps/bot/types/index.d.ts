import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

declare interface Command {
  command: SlashCommandBuilder;
  handler: (
    interaction: ChatInputCommandInteraction<CacheType>
  ) => Promise<void>;
}
