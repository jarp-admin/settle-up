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
import { client } from "../trpc";

let settleup: Command = {
  command: new SlashCommandBuilder()
    .setName("settleup")
    .setDescription("Generate a link to pay someone")
    .addUserOption((option) =>
      option.setName("user").setDescription("user to ping").setRequired(true)
    ),

  handler: async (i) => {
    let target = i.options.getUser("user");
    if (target == null) {
      return;
    }
    let test = i.user.username;
    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("User 1")
        .setLabel(target?.username || "")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("User 2")
        .setLabel(test || "")
        .setStyle(ButtonStyle.Primary)
    );

    const deptorId = await client.user.getUserId.query({
      discordId: i.user.id,
    });
    if (deptorId == undefined) {
      throw new Error("No deptor selected");
    }

    const creditorId = await client.user.getUserId.query({
      discordId: target?.id,
    });
    if (creditorId == undefined) {
      throw new Error("No creditor selected");
    }

    if(deptorId == creditorId){
      throw new Error("Debtor and Creditor are the same");
    }

    const whoowes = await client.tab.getTab.query({
      user1ID: deptorId,
      user2ID: creditorId,
    });
    if (whoowes == undefined) {
      throw new Error("no iowethem available");
    }

    let payment_link;

    if(whoowes > 0){
      payment_link = await client.payment.getLink.query({
        debtorID: deptorId,
        creditorID: creditorId,
      });
    }
    else {
      payment_link = await client.payment.getLink.query({
        debtorID: creditorId,
        creditorID: deptorId,
      });
    }

    
    if (payment_link == undefined) {
      throw new Error("no payment link available");
    }


    const Embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Purchase link')
      .setURL(payment_link);

    i.reply({ embeds: [Embed] });
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
