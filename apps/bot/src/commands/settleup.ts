import { ApplicationCommandOptionType as optTypes } from "discord.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

import { getDebtorCreditorIds } from "../utils/getuserid";
import trpc from "../trpc";
import makeCommand from "../lib/makeCommand";

let settleup = makeCommand(
  {
    name: "settleup",
    description: "Generate a link to pay someone",
    options: {
      user: {
        type: optTypes.User,
        description: "user to ping",
        required: true,
      },
    },
  },
  async (i, { user }) => {
    let client = i.user;
    let target = user;
    const { debtorId, creditorId } = await getDebtorCreditorIds(i, target);

    if (debtorId == creditorId) {
      throw new Error("Debtor and Creditor are the same");
    }

    const whoOwes = await trpc.tab.getTab.query({
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
    let payer = whoOwes > 0 ? client : target;
    let receiver = whoOwes > 0 ? target : client;

    if (whoOwes > 0) {
      payment_link = await trpc.payment.getLink.query({
        debtorID: debtorId,
        creditorID: creditorId,
      });
    } else {
      payment_link = await trpc.payment.getLink.query({
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

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("payment_confirmation")
        .setLabel("Received")
        .setStyle(ButtonStyle.Primary)
    );

    let res_msg = `${payer}, please pay £${Math.abs(
      whoOwes
    )}; ${receiver}, when you receive the payment please confirm it with the button below:`;
    let msg = await i.reply({
      content: res_msg,
      embeds: [Embed],
      components: [button],
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

      const clearedTab = await trpc.tab.clear.mutate({
        debtorID: debtorId,
        creditorID: creditorId,
      });

      await i.editReply({ components: [] });
      await i.channel?.send(`${payer}, ${receiver} You're all settled up!`);
    });
  }
);

export default settleup;
