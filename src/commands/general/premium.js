const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");


module.exports = {
  name: "premium",
  category: "general",
  description: "Gives the link to  vote the bot.",
  owner: false,
  wl : true,

  execute: async (message, args, client, prefix) => {

   
    let ok = client.emoji.ok;
    let no = client.emoji.no;
    const buttonbolte = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
  .setLabel("Premium")
  .setURL("https://discord.gg/pCj2UBbwST").setStyle(5)
  .setURL(`https://www.patreon.com/alexmusicbot/membership`),
    );

        const mainPage = new EmbedBuilder()
        .setDescription(`Help me by buying premium :)`) 
        .setColor(0x00AE86)
message.channel.send({embeds : [mainPage], components : [buttonbolte]})
    }
}