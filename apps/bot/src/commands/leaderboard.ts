import {
  APIApplicationCommandOptionChoice,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../types";
import { client } from "../trpc";

let leaderboard: Command = {
  command: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows the leaderboard for who owns the most debt")
    .addStringOption((option) =>
      option
        .setName("leaderboardtype")
        .setDescription("Leaderboard to display, type either \"Credit\" or \"Debt\"")
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
      leaderboard = await client.leaderboard.getDebtHistory.query();
    }
    else if (leaderboardtype == "Credit") {
      console.log("hello from credit");
      leaderboard = await client.leaderboard.getMostCredited.query();
    }
    else{
      await i.reply({content: "No leaderboard specified, please type either \"Credit\" or \"Debt\""});
      return;
    }

    
    if (leaderboard == undefined) {
      await i.reply({content: "No leaderboard found"});
      return;
    }



    let Response = "";
    console.log(leaderboard);

    await i.reply({ content: Response });
  },
};

export default leaderboard;
