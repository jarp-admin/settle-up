import makeCommand from "../lib/makeCommand";
import { StringOption, UserOption } from "../lib/options";

import { Button, Ephemeral, Message } from "../lib/response";
import trpc from "../trpc";

let uoweme = makeCommand(
  {
    name: "uoweme",
    description: "Add to a persons outstanding tab with you",
    options: {
      user: UserOption({
        description: "user who owes you",
        required: true,
      }),
      payment: StringOption({
        description: "amount to owe",
        required: true,
      }),
    },
  },

  async (caller, { user, payment }) => {
    return Message(
      `Hey ${user}, ${caller.username} wants you to pay £${payment}. Is this OK?`,
      {
        components: {
          row1: [
            Button({
              label: "yes",
              style: "danger",
              onClick: async (i) => {
                if (i.user != user)
                  return Ephemeral("Only the payer can accept the debt");

                await i.deferUpdate();

                let tabAmount = await trpc.discord.addToOrCreate.mutate({
                  amount: parseFloat(payment),
                  debtorID: user.id,
                  creditorID: caller.id,
                });

                await i.editReply({ components: [] });

                let details =
                  tabAmount === 0
                    ? `You and ${caller.username} are squared up`
                    : tabAmount > 0
                    ? `You owe ${caller.username} £${tabAmount}`
                    : `${caller.username} owes you £${tabAmount * -1}`;

                return `Added £${payment} to ${user.username}'s tab with ${caller.username}. ${details}`;
              },
            }),
          ],
        },
      }
    );
  }
);

export default uoweme;
