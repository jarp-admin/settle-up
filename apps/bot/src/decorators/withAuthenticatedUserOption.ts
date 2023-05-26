import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { ComConstructor } from "../types";
import trpc from "../trpc";

function withAuthenticatedUserOption({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return function <
    T extends ComConstructor<TOpts>,
    TOpts extends Record<string, any>
  >(target: T) {
    return class decorated extends target {
      constructor(..._rest: any[]) {
        super();
        this.command = this.command.addUserOption!((option) =>
          option.setName(name).setDescription(description).setRequired(true)
        );
      }

      async handler(
        i: ChatInputCommandInteraction<CacheType>,
        args: TOpts
      ): Promise<void> {
        let user = i.options.getUser("user");

        if (user == null) return;

        const AuthUserId = await trpc.user.getUserId.query({
          discordId: user.id,
        });

        if (!AuthUserId) return; //todo add error handling

        super.handler(i, { ...args, [name]: user, [`${name}ID`]: AuthUserId });
      }
    };
  };
}

export default withAuthenticatedUserOption;
