import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../types";
const { EmbedBuilder } = require('discord.js');

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
        .setLabel(i.user.username || "")
        .setStyle(ButtonStyle.Primary)
    );
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Purchase link')
      .setURL('https://discord.js.org/') //set link here
    // if get iowethem > 0:
    const Response = `You are going to pay ${target} `; /*amount of money`*/

    

    let response_it = [0, 0]

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

    // (embeds: exampleEmbed)
    
    msg.createMessageComponentCollector().on("collect", async (i) => {
      await i.reply(i.id);

      let x = 0;
    });
  },
};

export default settleup;
