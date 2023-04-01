import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../types";

let settleup: Command = {
  command: new SlashCommandBuilder()
    .setName("settleup")
    .setDescription("Generate a link to pay someone")
    .addUserOption((option) =>
      option.setName("user").setDescription("user to ping").setRequired(true)
    ),

  handler: async (i) => {
    let target = i.options.getUser("user");
    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("User 1")
        .setLabel(i.options.getUser("user")?.username || "")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("User 2")
        .setLabel(i.user.tag || "")
        .setStyle(ButtonStyle.Primary) /*,
      new ButtonBuilder()
        .setCustomId("link")
        .setLabel("Payment Link")
        .setStyle(ButtonStyle.Link)//*/
    );
    // if get iowethem > 0:
    const Response = `You are going to pay ${target} `; /*amount of money`*/
    // if iowethem = 0 and theyoweme > 0:
    //  const Response =  `${target} owes you `/*amount of money, get them to pay you instead`*/
    // else:
    //  const Response =  `You and ${target} are squared up, you don't need to transfer money at the moment`
    let msg = await i.reply({
      content:
        Response +
        " select the button with your name once you have confirmed the transaction, payee use the link to access the payment",
      components: [button] /**/,
    });

    msg.createMessageComponentCollector().on("collect", async (i) => {
      i.reply("yes");
    });
  },
};

export default settleup;
