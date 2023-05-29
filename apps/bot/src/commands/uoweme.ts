import { ApplicationCommandOptionType as optTypes } from "discord.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";

import trpc from "../trpc";
import makeCommand from "../lib/makeCommand";

let uoweme = makeCommand(
  {
    name: "uoweme",
    description: "Add to a persons outstanding tab with you",
    options: {
      payer: {
        type: optTypes.User,
        description: "user who owes you",
        required: true,
      },
      payment: {
        type: optTypes.String,
        description: "amount to owe",
        required: true,
      },
    },
  },
  async (i, { payer, payment }) => {
    let recipient = i.user;
    let payment_amount = parseFloat(payment);

    // TODO these checks should move
    if (!payer) {
      await i.reply(`You need to specify a payer ${recipient}`);
      return;
    }

    if (!payment_amount) {
      await i.reply(`You need to specify an amount ${payer}`);
      return;
    }

    if (payment_amount <= 0) {
      await i.reply({ content: "You can't input a negative number" });
      return;
    }

    const deptorId = await trpc.user.getUserId.query({
      discordId: payer.id,
    });
    if (deptorId == undefined) {
      throw new Error("No debtor selected");
    }

    const creditorId = await trpc.user.getUserId.query({
      discordId: recipient.id,
    });
    if (creditorId == undefined) {
      throw new Error("No creditor selected");
    }

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`payment_valid`)
        .setLabel("yes")
        .setStyle(ButtonStyle.Danger)
    );

    let msg = await i.reply({
      content: `Hey ${payer}, ${recipient.username} wants you to pay £${payment_amount}. Is this OK?`,
      components: [button],
    });

    msg.createMessageComponentCollector().on("collect", async (i) => {
      if (i.user != payer) {
        await i.reply({
          content: "Only the payer can accept the payment",
          ephemeral: true,
        });
        return;
      }

      await i.deferUpdate();

      let updatedTab = await trpc.tab.addToOrCreate.mutate({
        amount: parseFloat(String(payment_amount)),
        debtorID: deptorId,
        creditorID: creditorId,
      });
      if (updatedTab == undefined) {
        throw new Error("no cannot update tab");
      }

      let overall_tab = await trpc.tab.getTab.query({
        user1ID: deptorId,
        user2ID: creditorId,
      });
      if (overall_tab == undefined) {
        throw new Error("cannot get overall tab");
      }

      let x = `Added £${payment_amount} to ${payer.username}'s tab with ${recipient.username}. `;
      let Response = "";
      if (overall_tab > 0) {
        Response = x + `You owe ${recipient.username} £${overall_tab}`;
      } else if (overall_tab < 0) {
        overall_tab = overall_tab * -1;
        Response = x + `${recipient.username} owes you £${overall_tab}`;
      } else {
        Response = x + `You and ${recipient.username} are squared up`;
      }
      await i.editReply({ content: Response, components: [] });
    });
  }
);

export default uoweme;
