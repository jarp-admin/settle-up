import {
  APIApplicationCommandOptionChoice,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../types";
import { client } from "../trpc";

let leaderboard: Command = {
  command: new SlashCommandBuilder()
    .setName("mostdebt")
    .setDescription("Shows the leaderboard for who owns the most debt")
    .addStringOption((option) =>
      option
        .setName("leaderboardtype")
        .setDescription("leaderboard to display")
        .setRequired(true)
        .addChoices(
          "Dept" as unknown as APIApplicationCommandOptionChoice<string>
        )
        .addChoices(
          "Credit" as unknown as APIApplicationCommandOptionChoice<string>
        )
    ),

  handler: async (i) => {
    let leaderboardtype = i.options.getString("leaderboardtype");
    if (leaderboardtype == null) {
      return;
    }

    if (leaderboardtype == "Dept") {
      console.log("hello from debt");
    }

    if (leaderboardtype == "Credit") {
      console.log("hello from credit");
    }

    const leaderboard = await client.leaderboard.getMostDebt.query();
    if (leaderboard == undefined) {
      throw new Error("Cannot get leaderboard");
    }

    let Response = "";
    console.log(leaderboard);

    await i.reply({ content: Response });
  },
};

export default leaderboard;
