import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types";

let ping: Command = {
  command: new SlashCommandBuilder()
    .setName("display")
    .setDescription("Shows how much you owe someone")
    .addUserOption((option) =>
      option.setName("user").setDescription("user to ping")
    ),

  handler: async (i) => {
    let target = i.options.getUser("user");
    // if get iowethem > 0:
    const Response = `You owe ${target} `/*amount of money`*/
    // if iowethem = 0 and theyoweme > 0:
    //  const Response =  `${target} owes you `/*amount of money`*/
    // else:
    //  const Response =  `You and ${target} are squared up`
    await i.reply({content: Response});
  },
};

export default ping;
