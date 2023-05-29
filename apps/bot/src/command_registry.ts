import display from "./commands/display";
import ioweu from "./commands/ioweu";
import leaderboard from "./commands/leaderboard";
import ping from "./commands/ping";
import poke from "./commands/poke";
import settleup from "./commands/settleup";
import uoweme from "./commands/uoweme";
import registerCommands from "./lib/register";

// * register your commands here
export let commands = registerCommands(
  ping,
  display,
  settleup,
  ioweu,
  uoweme,
  poke,
  leaderboard
);
