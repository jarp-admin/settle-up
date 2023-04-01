import * as dotenv from "dotenv";
dotenv.config();

import { REST, Routes } from "discord.js";

import { commands } from "./command_registry";

(async () => {
  let coms = [];

  for (let com of commands.values()) {
    coms.push(com.command.toJSON!());
  }

  const rest = new REST({ version: "10" }).setToken(
    process.env.TOKEN as string
  );

  try {
    console.log(`Started refreshing ${coms.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID as string,
        process.env.GUILD_ID as string
      ),
      { body: coms }
    );

    console.log(
      // @ts-ignore
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
