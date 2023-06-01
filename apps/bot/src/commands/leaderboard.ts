import makeCommand from "../lib/makeCommand";
import { StringOption } from "../lib/options";

import trpc from "../trpc";

const leaderboard = makeCommand(
  {
    name: "leaderboard",
    description: "Shows the leaderboard for who owns the most debt",
    options: {
      type: StringOption({
        description: 'Leaderboard type - either "Credit" or "Debt"',
        choices: [
          { name: "credit", value: "credit" },
          { name: "debt", value: "debt" },
        ],
      }),
    },
  },
  async (caller, { type }) => {
    let leaderboard;

    if (type == "Debt") {
      console.log("hello from debt");
      leaderboard = await trpc.leaderboard.getDebtHistory.query();
    } else if (type == "Credit") {
      console.log("hello from credit");
      leaderboard = await trpc.leaderboard.getMostCredited.query();
    } else {
      return 'No leaderboard specified, please type either "Credit" or "Debt"';
    }

    if (leaderboard == undefined) {
      return "No leaderboard found";
    }

    console.log(leaderboard);

    return "";
  }
);

export default leaderboard;
