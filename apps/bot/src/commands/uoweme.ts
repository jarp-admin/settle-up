import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../types";

let uoweme: Command = {
  command: new SlashCommandBuilder()
    .setName("uoweme")
    .setDescription("Add to a persons outstanding tab with you")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("user who owes you owe")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("payment")
        .setDescription("amount to owe")
        .setRequired(true)
    ),

  handler: async (i) => {
    let recipient = i.user;
    let payer = i.options.getUser("user");
    let payment_amount = i.options.getInteger("payment");

    if (!payer) {
      await i.reply(`You need to specify a payer ${recipient}`);
      return;
    }

    if (!payment_amount) {
      await i.reply(`You need to specify an amount ${payer}`);
      return;
    }

    if (payment_amount <= 0) {
      await i.reply({ content: "You can't input a negative number" });
      return;
    }

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`payment_valid`)
        .setLabel("yes")
        .setStyle(ButtonStyle.Danger)
    );

    let msg = await i.reply({
      content: `Hey ${payer}, ${recipient} wants you to pay £${payment_amount}. Is this OK?`,
      components: [button],
    });

    msg.createMessageComponentCollector().on("collect", async (i) => {
      if (i.user != payer) {
        await i.reply({
          content: "Only the payer can accept the payment",
          ephemeral: true,
        });
        return;
      }

      await i.deferUpdate();

      await i.user.send("This is a DM!");
      let overall_tab = 10; //this will be the overall amount owed between the users, positive if sender owes reciever, negative otherwise

      //! call ash

      let x = `Added ${payment_amount} to ${payer}'s tab with ${recipient}. `;
      let Response = "";
      if (overall_tab > 0) {
        Response = x + `You owe ${recipient} ${overall_tab}`;
      } else if (overall_tab < 0) {
        overall_tab = overall_tab * -1;
        Response = x + `${recipient} owes you ${overall_tab}`;
      } else {
        Response = x + `You and ${recipient} are squared up`;
      }
      await i.editReply({ content: Response, components: [] });
    });
  },
};

export default uoweme;
