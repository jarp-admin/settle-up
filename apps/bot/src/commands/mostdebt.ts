import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types";
import { client } from "../trpc";

let mostdebt: Command = {
  command: new SlashCommandBuilder()
    .setName("mostdebt")
    .setDescription("Shows the leaderboard for who owns the most debt"),

  handler: async (i) => {
    const leaderboard = await client.leaderboard.getMostDebt.query();
    if (leaderboard == undefined) {
      throw new Error("Cannot get leaderboard");
    }

    let Response = "";
    console.log(leaderboard);

    await i.reply({ content: Response });
  },
};

export default mostdebt;
