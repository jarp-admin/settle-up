import makeCommand from "../lib/makeCommand";
import { UserOption } from "../lib/options";
import { getIds } from "../utils/getIds";

import { Button, Embed, Ephemeral, Message } from "../lib/response";
import trpc from "../trpc";

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

    if (whoOwes == undefined)
      return Ephemeral("Neither of you owe each other any money");

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

    // const Embed = new EmbedBuilder()
    //   .setColor(0x0099ff)
    //   .setTitle("Purchase link")
    //   .setURL(payment_link);

    return Message(
      `${payer}, please pay £${Math.abs(
        whoOwes
      )}; ${receiver}, when you receive the payment please confirm it with the button below:`,
      {
        embeds: [
          Embed({
            color: 0x0099ff,
            title: "Purchase link",
            url: payment_link,
          }),
        ],
        components: {
          row1: [
            Button({
              label: "Received",
              style: "primary",
              onClick: async (i) => {
                if (i.user != receiver)
                  return Ephemeral("Only the payer can accept the payment");

                await i.deferReply();

                const clearedTab = await trpc.tab.clear.mutate({
                  debtorID: debtorId,
                  creditorID: creditorId,
                });

                await i.editReply({ components: [] });
                return `${payer}, ${receiver} You're all settled up!`;
              },
            }),
          ],
        },
      }
    );
  }
);

export default settleup;
