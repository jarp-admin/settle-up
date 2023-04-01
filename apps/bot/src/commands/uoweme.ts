import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message, SlashCommandBuilder } from "discord.js";
import { Command } from "../types";

let uoweme: Command = {
  command: new SlashCommandBuilder()
    .setName("uoweme")
    .setDescription("Add to a persons outstanding tab with you")
    .addUserOption((option) =>
      option.setName("user").setDescription("user who owes you owe").setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName("payment").setDescription("amount to owe").setRequired(true)
    ),
    

  handler: async (i) => {
    let target = i.options.getUser("user");
    let payment = i.options.getInteger("payment");
    
    if (payment! > 0){
      const button = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("Is the amount owed valid?")
          .setLabel(i.options.getUser("user")?.username + ": Is " + payment + " the valid amount ?" || "")
          .setStyle(ButtonStyle.Danger),
      )

      await i.reply({components: [button] })
      let overall_tab = 10; //this will be the overall amount owed between the users, positive if sender owes reciever, negative otherwise

      
      let x = `Added ${payment} to ${target}'s tab with ${i.user} /n`
      let Response = "";
      if (overall_tab > 0){
        Response = x + `You owe ${target} ${overall_tab}`;
      }
      else if (overall_tab < 0){
        overall_tab = overall_tab * -1
        Response =  x + `${target} owes you ${overall_tab}`
      }
      else{
        Response =  x + `You and ${target} are squared up`
      }
      await i.reply({ content: Response});
    }
    else{
      await i.reply({ content: "You can't input a negative number"});
    }
    
  },
};

export default uoweme;
