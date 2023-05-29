import { ApplicationCommandOptionType as optTypes } from "discord.js";

import makeCommand from "../lib/makeCommand";
import trpc from "../trpc";

const leaderboard = makeCommand(
  {
    name: "leaderboard",
    description: "Shows the leaderboard for who owns the most debt",
    options: {
      type: {
        type: optTypes.String,
        description: 'Leaderboard type - either "Credit" or "Debt"',
        choices: [
          { name: "credit", value: "credit" },
          { name: "debt", value: "debt" },
        ],
      },
    },
  },
  async (i, { type }) => {
    let leaderboard;

    if (type == "Debt") {
      console.log("hello from debt");
      leaderboard = await trpc.leaderboard.getDebtHistory.query();
    } else if (type == "Credit") {
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
  }
);

export default leaderboard;
