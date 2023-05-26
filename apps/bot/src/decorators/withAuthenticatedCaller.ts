import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { ComConstructor } from "../types";
import trpc from "../trpc";

function withAuthenticatedCaller<
  T extends ComConstructor<TOpts>,
  TOpts extends Record<string, any>
>(target: T) {
  return class decorated extends target {
    async handler(
      i: ChatInputCommandInteraction<CacheType>,
      args: TOpts
    ): Promise<void> {
      const AuthUserId = await trpc.user.getUserId.query({
        discordId: i.user.id,
      });

      if (!AuthUserId) return; //todo add error handling

      super.handler(i, { ...args, callerID: AuthUserId });
    }
  };
}

export default withAuthenticatedCaller;
