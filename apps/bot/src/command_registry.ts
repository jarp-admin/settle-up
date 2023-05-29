import * as coms from "./commands";
import registerCommands from "./lib/register";

// * register your commands here
export let commands = registerCommands(...Object.values(coms));
