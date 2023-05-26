import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export interface Command<TOpts extends Record<string, any> = {}> {
  command: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  handler(
    interaction: ChatInputCommandInteraction<CacheType>,
    args?: TOpts
  ): Promise<void>;
}

interface ComConstructor<T extends Record<string, any>> {
  new (...args: any[]): Command<T>;
}
