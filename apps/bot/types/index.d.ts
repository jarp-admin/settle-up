import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

declare interface Command {
  command: Partial<SlashCommandBuilder>;
  handler: (
    interaction: ChatInputCommandInteraction<CacheType>
  ) => Promise<void>;
}
