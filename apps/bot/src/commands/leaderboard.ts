import { SlashCommandBuilder } from "discord.js";

import trpc from "../trpc";
import { Command } from "../types";

let leaderboard: Command = {
  command: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows the leaderboard for who owns the most debt")
    .addStringOption((option) =>
      option
        .setName("leaderboardtype")
        .setDescription(
          'Leaderboard to display, type either "Credit" or "Debt"'
        )
        .setRequired(true)
    ),

  handler: async (i) => {
    // await i.reply({content: "Do you want the \"Credit\" or \"Debt\" leaderboard?"})
    let leaderboardtype = i.options.getString("leaderboardtype");
    if (leaderboardtype == null) {
      return;
    }

    let leaderboard;
    if (leaderboardtype == "Debt") {
      console.log("hello from debt");
      leaderboard = await trpc.leaderboard.getDebtHistory.query();
    } else if (leaderboardtype == "Credit") {
      console.log("hello from credit");
      leaderboard = await trpc.leaderboard.getMostCredited.query();
    } else {
      await i.reply({
        content:
          'No leaderboard specified, please type either "Credit" or "Debt"',
      });
      return;
    }

    if (leaderboard == undefined) {
      await i.reply({ content: "No leaderboard found" });
      return;
    }

    let Response = "";
    console.log(leaderboard);

    await i.reply({ content: Response });
  },
};

export default leaderboard;
