import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  User,
} from "discord.js";

import { Command } from "../types";

import trpc from "../trpc";
import withAuthenticatedUserOption from "../decorators/withAuthenticatedUserOption";
import withAuthenticatedCaller from "../decorators/withAuthenticatedCaller";

@withAuthenticatedCaller
@withAuthenticatedUserOption({
  name: "user",
  description: "user you want to know your debt with",
})
class display implements Command {
  accessor command = new SlashCommandBuilder()
    .setName("display")
    .setDescription("Shows how much you owe someone");

  async handler(
    i: ChatInputCommandInteraction<CacheType>,
    { user, userID, callerID }: { user: User; userID: string; callerID: string }
  ) {
    let iowethem = await trpc.tab.getTab.query({
      user1ID: userID,
      user2ID: callerID,
    });

    if (iowethem == undefined) {
      throw new Error("no iowethem available");
    }

    let Response = "";

    if (iowethem > 0) {
      Response = `You owe ${user.username} £${iowethem}`;
    } else if (iowethem < 0) {
      iowethem = iowethem * -1;
      Response = `${user.username} owes you £${iowethem}`;
    } else {
      Response = `You and ${user.username} are squared up`;
    }

    await i.reply({ content: Response });
  }
}

export default display;
