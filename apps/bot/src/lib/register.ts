import { Collection, ChatInputCommandInteraction, CacheType } from "discord.js";
import { command } from "./types";

function registerCommands(...commands: command[]) {
  let collection = new Collection<string, command>();

  for (let com of commands) {
    collection.set(com.meta.name, com);
  }

  async function handler(i: ChatInputCommandInteraction<CacheType>) {
    const command = collection.get(i.commandName);

    if (!command) {
      console.error(`No command matching ${i.commandName} was found.`);
      return;
    }

    try {
      await command.handler(i, {});
    } catch (error) {
      console.error(error);

      if (i.replied || i.deferred) {
        await i.followUp({
          content: "There was an error while executing this command",
          ephemeral: true,
        });
      } else {
        await i.reply({
          content: "There was an error while executing this command",
          ephemeral: true,
        });
      }
    }
  }

  return { collection, handler };
}

export default registerCommands;
