import makeCommand from "../lib/makeCommand";
import { StringOption, UserOption } from "../lib/options";

import { Button, Ephemeral, Message } from "../lib/response";
import trpc from "../trpc";

let uoweme = makeCommand(
  {
    name: "uoweme",
    description: "Adds to your tab with another person",
    options: {
      target: UserOption({
        description: "Person who owes you",
        required: true,
      }),
      payment: StringOption({
        description: "Amount they owe",
        required: true,
      }),
    },
  },

  async (caller, { target, payment }) => {
    return Message(
      `${target}, ${caller.username} wants you to pay £${payment}. Is this OK?`,
      {
        components: {
          row1: [
            Button({
              label: "yes",
              style: "danger",
              onClick: async (i) => {
                if (i.user != target)
                  return Ephemeral(
                    `Only the ${target.username} can accept the debt`
                  );

                await i.deferUpdate();

                let tabAmount = await trpc.discord.addToOrCreate.mutate({
                  amount: parseFloat(payment),
                  debtorID: target.id,
                  creditorID: caller.id,
                });

                await i.editReply({ components: [] });

                let details =
                  tabAmount === 0
                    ? `${target.username} and ${caller.username} are settled up`
                    : tabAmount > 0
                    ? `${target.username} owes ${caller.username} £${tabAmount}`
                    : `${caller.username} owes ${target.username} £${
                        tabAmount * -1
                      }`;

                return `Added £${payment} to ${target.username}'s tab with ${caller}. ${details}`;
              },
            }),
          ],
        },
      }
    );
  }
);

export default uoweme;
