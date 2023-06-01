import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

import makeCommand from "../lib/makeCommand";
import { StringOption, UserOption } from "../lib/options";

import trpc from "../trpc";
import { messageResponse } from "../lib/types";

let uoweme = makeCommand(
  {
    name: "uoweme",
    description: "Add to a persons outstanding tab with you",
    options: {
      payer: UserOption({
        description: "user who owes you",
        required: true,
      }),
      payment: StringOption({
        description: "amount to owe",
        required: true,
      }),
    },
  },
  async (caller, { payer, payment }) => {
    let payment_amount = parseFloat(payment);

    if (payment_amount <= 0) return "You can't input a negative number";

    const debtorId = await trpc.user.getUserId.query({
      discordId: payer.id,
    });

    if (debtorId == undefined) {
      throw new Error("No debtor selected");
    }

    const creditorId = await trpc.user.getUserId.query({
      discordId: caller.id,
    });
    if (creditorId == undefined) {
      throw new Error("No creditor selected");
    }

    return {
      body: `Hey ${payer}, ${caller.username} wants you to pay £${payment_amount}. Is this OK?`,
      buttons: [
        {
          label: "yes",
          style: ButtonStyle.Danger,
          onClick: async (i) => {
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
              debtorID: debtorId,
              creditorID: creditorId,
            });
            if (updatedTab == undefined) {
              throw new Error("no cannot update tab");
            }

            let overall_tab = await trpc.tab.getTab.query({
              user1ID: debtorId,
              user2ID: creditorId,
            });
            if (overall_tab == undefined) {
              throw new Error("cannot get overall tab");
            }

            let x = `Added £${payment_amount} to ${payer.username}'s tab with ${caller.username}. `;
            let Response = "";
            if (overall_tab > 0) {
              Response = x + `You owe ${caller.username} £${overall_tab}`;
            } else if (overall_tab < 0) {
              overall_tab = overall_tab * -1;
              Response = x + `${caller.username} owes you £${overall_tab}`;
            } else {
              Response = x + `You and ${caller.username} are squared up`;
            }
            await i.editReply({ content: Response, components: [] });
          },
        },
      ],
    } as messageResponse;
  }
);

export default uoweme;
