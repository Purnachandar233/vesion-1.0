const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");


module.exports = {
    name: "vote",
    description: "support the bot and vote for it",
    wl : true,
   
    run: async (client, interaction) => {

        await interaction.deferReply({
              ephemeral: false
          });  
          let ok = client.emoji.ok;
          let no = client.emoji.no;
          
      
          const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
        .setLabel("Top.gg")
        .setStyle(5)
        .setURL(`https://top.gg/bot/898941398538158080/vote`),
        new ButtonBuilder()
        .setLabel("DBL")
        .setStyle(5)
        .setURL(`https://discordbotlist.com/bots/alex-music/upvote`),
          );
              const mainPage = new EmbedBuilder()
              .setDescription(`Help me by voting! You'll get access to premium commands for 12 hours if you vote me on [Top.gg](https://top.gg/bot/898941398538158080/vote)`)
              .setColor(0x00AE86)
          return interaction.followUp({embeds: [mainPage], components: [row]})
   
  },
};
