import makeCommand from "../lib/makeCommand";
import { UserOption } from "../lib/options";

import { Button, Embed, Ephemeral, Message } from "../lib/response";
import trpc from "../trpc";

let settleup = makeCommand(
  {
    name: "settleup",
    description: "Generates a link to pay someone",
    options: {
      target: UserOption({
        description: "Person to settle up with",
        required: true,
      }),
    },
  },

  async (caller, { target }) => {
    if (caller === target)
      return Ephemeral("You can't settle up with yourself");

    const { link, amount, recipientID } =
      await trpc.paypal.getDiscordLink.query({
        callerID: caller.id,
        targetID: target.id,
      });

    let [payer, receiver] =
      caller.id === recipientID
        ? ([target, caller] as const)
        : ([caller, target] as const);

    return Message(
      `${payer}, please pay £${Math.abs(
        amount
      )}; ${receiver}, when you receive the payment please confirm it with the button below:`,
      {
        embeds: [
          Embed({
            color: 0x0099ff,
            title: "Purchase link",
            url: link,
          }),
        ],
        components: {
          row1: [
            Button({
              label: "Received",
              style: "primary",
              onClick: async (i) => {
                if (i.user != receiver)
                  return Ephemeral("Only the receiver can accept the payment");

                await i.deferReply();

                const _clearedTab = await trpc.discord.clear.mutate({
                  user1ID: caller.id,
                  user2ID: target.id,
                });

                await i.editReply({ components: [] });
                return `${payer}, ${receiver} you're all settled up`;
              },
            }),
          ],
        },
      }
    );
  }
);

export default settleup;
