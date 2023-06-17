import makeCommand from "../lib/makeCommand";
import { UserOption } from "../lib/options";

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
    if (caller === user) return Ephemeral("You can't settle up with yourself");

    const { link, amount, recipientID } =
      await trpc.paypal.getDiscordLink.query({
        callerID: caller.id,
        targetID: user.id,
      });

    let [payer, receiver] =
      caller.id === recipientID
        ? ([user, caller] as const)
        : ([caller, user] as const);

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
                  user2ID: user.id,
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
