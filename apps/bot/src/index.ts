import "dotenv/config";
import env from "env";

import { Client, Events, GatewayIntentBits } from "discord.js";
import { commands } from "./command_registry";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, (e) => {
  console.log(`Ready! logged in as ${e.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  //escape non-commands
  if (!interaction.isChatInputCommand()) return;

  await commands.handler(interaction);
});

client.login(env.DISCORD_CLIENT_TOKEN);
