import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../types";
const { EmbedBuilder } = require("discord.js");
import { client } from "../trpc";

let settleup: Command = {
  command: new SlashCommandBuilder()
    .setName("settleup")
    .setDescription("Generate a link to pay someone")
    .addUserOption((option) =>
      option.setName("user").setDescription("user to ping").setRequired(true)
    ),

  handler: async (i) => {
    let debtor = i.user;
    let creditor = i.options.getUser("user");

    if (creditor == null) {
      i.reply({
        content: "You must specify who you want to settle your tab with.",
        ephemeral: true,
      });
      return;
    }

    const debtorId = await client.user.getUserId.query({
      discordId: debtor.id,
    });
    if (debtorId == undefined) {
      throw new Error("No deptor selected");
    }

    const creditorId = await client.user.getUserId.query({
      discordId: creditor?.id,
    });
    if (creditorId == undefined) {
      throw new Error("No creditor selected");
    }

    if (debtorId == creditorId) {
      throw new Error("Debtor and Creditor are the same");
    }

    const whoOwes = await client.tab.getTab.query({
      user1ID: debtorId,
      user2ID: creditorId,
    });

    if (whoOwes == undefined) {
      i.reply({
        content: "Neither of you owe each other any money",
        ephemeral: true,
      });
      return;
    }

    let payment_link;
    let payer = whoOwes > 0 ? debtor : creditor;
    let receiver = whoOwes > 0 ? creditor : debtor;

    if (whoOwes > 0) {
      payment_link = await client.payment.getLink.query({
        debtorID: debtorId,
        creditorID: creditorId,
      });
    } else {
      payment_link = await client.payment.getLink.query({
        debtorID: creditorId,
        creditorID: debtorId,
      });
    }

    if (payment_link == undefined) {
      throw new Error("no payment link available");
    }

    const Embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Purchase link")
      .setURL(payment_link);

    i.reply({ embeds: [Embed] });

    // if get iowethem > 0:

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("payment_confirmation")
        .setLabel("Received")
        .setStyle(ButtonStyle.Primary)
    );

    // if iowethem = 0 and theyoweme > 0:
    //  const Response =  `${target} owes you `/*amount of money, get them to pay you instead`*/
    // else:
    //  const Response =  `You and ${target} are squared up, you don't need to transfer money at the moment`
    let res_msg = `${payer}, please pay ${Math.abs(
      whoOwes
    )}; ${receiver}, when you receive the payment please confirm it with the button below:`;
    let msg = await i.reply({
      content: res_msg,
      components: [button] /**/,
    });

    msg.createMessageComponentCollector().on("collect", async (i) => {
      if (i.user != receiver) {
        await i.reply({
          content: "Only the payer can accept the payment",
          ephemeral: true,
        });
        return;
      }

      await i.deferUpdate();

      await i.editReply({ content: res_msg, components: [] });
      await i.channel?.send(`${payer}, ${receiver} You're all settled up!`);
    });
  },
};

export default settleup;
