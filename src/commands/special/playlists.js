const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
  name: "playlist",
  category: "special",
  description: "Shows the playlists commands!",
  owner: false,
  premium: true,
  wl: true,
  execute: async (message, args, client, prefix) => {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Vote Me")
          .setStyle(5)
          .setURL(`https://top.gg/bot/898941398538158080/vote`),
        new ButtonBuilder()
          .setLabel("Get Premium")
          .setStyle(5)
          .setURL(`https://www.patreon.com/alexmusicbot/membership`)
      );

    const embed = new EmbedBuilder()
      .setAuthor({ name: `Playlists Help`, iconURL: message.author.displayAvatarURL() })
      .addFields(
        { name: `!pl-create [playlist name]`, value: `Creates a playlist with the provided name.\n \`[Premium]\`` },
        { name: `!pl-show [playlist name]`, value: `Shows the songs within the provided playlist.\n \`[Premium]\`` },
        { name: `!pl-list`, value: `Shows the list of your playlists.\n \`[Premium]\`` },
        { name: `!pl-delete [playlist name]`, value: `Delete the provided saved playlist.\n \`[Premium]\`` },
        { name: `!pl-removetrack [playlist name] [position]`, value: `Removes a specific song from the playlist.\n \`[Premium]\`` },
        { name: `!pl-addcurrent [playlist name]`, value: `Saves the current playing song to your playlist.\n \`[Premium]\`` },
        { name: `!pl-addqueue [playlist name]`, value: `Saves the queue to your playlist.\n \`[Premium]\`` }
      )
      .setFooter({ text: `You can get 12 hours of premium by voting to the bot on top.gg!` })
      .setColor(0x00AE86);

    message.channel.send({ embeds: [embed], components: [row] });
  }
}
