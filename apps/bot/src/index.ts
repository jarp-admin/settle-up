import * as dotenv from "dotenv";
dotenv.config();

import { Client, Events, GatewayIntentBits } from "discord.js";
import { handleCommand } from "./command_registry";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, (e) => {
  console.log(`Ready! logged in as ${e.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  //escape non-commands
  if (!interaction.isChatInputCommand()) return;

  await handleCommand(interaction);
});

client.login(process.env.TOKEN);
