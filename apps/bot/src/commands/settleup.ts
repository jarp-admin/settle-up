import { ActionRowBuilder, ButtonBuilder, Message, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types";

let settleup: Command = {
  command: new SlashCommandBuilder()
    .setName("settleup")
    .setDescription("Generate a link to pay someone")
    .addUserOption((option) =>
      option.setName("user").setDescription("user to ping").setRequired(true)
    ),
    

  handler: async (i) => {
    let target = i.options.getUser("user");
    let button = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("primary")
        .setLabel(i.options.getUser("user")?.username || ""),
      new ButtonBuilder()
        .setCustomId("primary")
        .setLabel( || ""),
      new ButtonBuilder()
        .setCustomId("link")
        .setLabel("Payment Link")
    )
    // if get iowethem > 0:
    const Response = `You are going to pay ${target} `; /*amount of money`*/
    // if iowethem = 0 and theyoweme > 0:
    //  const Response =  `${target} owes you `/*amount of money, get them to pay you instead`*/
    // else:
    //  const Response =  `You and ${target} are squared up, you don't need to transfer money at the moment`
    await i.reply({ content: Response + " select the button with your name once you have confirmed the transaction, payee use the link to access the payment", components: [button] });
  },
};

export default settleup;
