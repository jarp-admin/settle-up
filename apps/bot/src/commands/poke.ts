import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types";
import { client } from "../trpc";

let poke: Command = {
  command: new SlashCommandBuilder()
    .setName("poke")
    .setDescription("Reminds someone to pay their tab")
    .addUserOption((option) =>
      option.setName("user").setDescription("user to ping").setRequired(true)
    ),

  handler: async (i) => {
    let target = i.options.getUser("user");
    let sender = i.user;

    const deptorId = await client.user.getUserId.query({
      discordId: target!.id,
    });
    if (deptorId == undefined) {
      throw new Error("No debtor selected");
    }

    const creditorId = await client.user.getUserId.query({
      discordId: sender.id,
    });
    if (creditorId == undefined) {
      throw new Error("No creditor selected");
    }

    let overall_tab = await client.tab.getTab.query({
      user1ID: deptorId,
      user2ID: creditorId,
    });
    if (overall_tab == undefined) {
      throw new Error("no iowe available");
    }

    let Response = ``;

    if(overall_tab > 0){
      Response = `${target} pay your tab of £${overall_tab} to ${sender.username}`;
    }
    else{
      overall_tab = overall_tab * -1;
      Response = `${sender.username} you owe ${target?.username} £${overall_tab}`;
    }



    await i.reply({ content: Response });
  },
};

export default poke;
