import { Collection, ChatInputCommandInteraction, CacheType } from "discord.js";
import display from "./commands/display";
import ping from "./commands/ping";
import settleup from "./commands/settleup";
import ioweu from "./commands/ioweu";
import { Command } from "./types";

export let commands = new Collection<string, Command>();

// * register your commands here
addCommands([ping, display, settleup, ioweu]);

export async function handleCommand(i: ChatInputCommandInteraction<CacheType>) {
  const command = commands.get(i.commandName);

  if (!command) {
    console.error(`No command matching ${i.commandName} was found.`);
    return;
  }

  try {
    await command.handler(i);
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

function addCommand(com: Command) {
  commands.set(com.command.name!, com);
}

function addCommands(coms: Command[]) {
  for (let com of coms) {
    addCommand(com);
  }
}
