import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

import { getIds } from "../utils/getIds";
import makeCommand from "../lib/makeCommand";
import { UserOption } from "../lib/options";

import trpc from "../trpc";
import { messageResponse } from "../lib/types";

let settleup = makeCommand(
  {
    name: "settleup",
    description: "Generate a link to pay someone",
    options: {
      user: UserOption({
        description: "user to ping",
        required: true,
      }),
    },
  },
  async (caller, { user }) => {
    const { debtorId, creditorId } = await getIds(caller, user);

    if (debtorId == creditorId) {
      throw new Error("Debtor and Creditor are the same");
    }

    const whoOwes = await trpc.tab.getTab.query({
      user1ID: debtorId,
      user2ID: creditorId,
    });

    if (whoOwes == undefined) {
      return {
        body: "Neither of you owe each other any money",
        ephemeral: true,
      } as messageResponse;
    }

    let payment_link;
    let payer = whoOwes > 0 ? caller : user;
    let receiver = whoOwes > 0 ? user : caller;

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

    return {
      body: `${payer}, please pay £${Math.abs(
        whoOwes
      )}; ${receiver}, when you receive the payment please confirm it with the button below:`,
      embeds: [Embed],
      buttons: [
        {
          label: "Received",
          style: ButtonStyle.Primary,
          onClick: async (i) => {
            if (i.user != receiver) {
              await i.reply({
                content: "Only the payer can accept the payment",
                ephemeral: true,
              });
              return;
            }

            await i.deferReply();

            const clearedTab = await trpc.tab.clear.mutate({
              debtorID: debtorId,
              creditorID: creditorId,
            });

            await i.editReply({ components: [] });
            await i.channel?.send(
              `${payer}, ${receiver} You're all settled up!`
            );
          },
        },
      ],
    } as messageResponse;
  }
);

export default settleup;
