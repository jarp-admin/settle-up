import { ApplicationCommandOptionType as optTypes } from "discord.js";
import makeCommand from "../lib/makeCommand";

let ping = makeCommand(
  {
    name: "ping",
    description: "Replies with Pong!",
    options: {
      user: {
        type: optTypes.User,
        description: "user to ping",
      },
    },
  },
  async (i, { user }) => {
    await i.reply({ content: `Pong! ${user}` });
  }
);

export default ping;
