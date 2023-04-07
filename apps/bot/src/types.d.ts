import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export interface Command {
  command: Partial<SlashCommandBuilder>;
  handler: (
    interaction: ChatInputCommandInteraction<CacheType>
  ) => Promise<void>;
}