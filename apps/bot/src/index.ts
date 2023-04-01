import * as dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import fs from "fs";
import path from "path";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, (e) => {
  console.log(`Ready! logged in as ${e.user.tag}`);
});

let commands = new Collection();

const commandPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandPath)
  .filter((f) => f.endsWith(".js"));

for (let file of commandFiles) {
  const filePath = path.join(commandPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  //escape non-commands
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    // @ts-ignore
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command",
        ephemeral: true,
      });
    }
  }

  console.log(interaction);
});

let envSchema = z.object({
  TOKEN: z.string().nonempty(),
});

let env = envSchema.parse(process.env);

client.login(env.TOKEN);
