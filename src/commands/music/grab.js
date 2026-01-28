const { EmbedBuilder } = require("discord.js");
const { createBar } = require('../../functions.js');

module.exports = {
  name: 'grab',
  category: 'music',
  aliases: ["lagu", "savedm", "grb", "dmchey"],
  description: 'Grabs and sends the current playing song data to your personal DMs',
  owner: false,
  wl: true,
  votelock: true,
  execute: async (message, args, client, prefix) => {
    let ok = client.emoji.ok;
    let no = client.emoji.no;

    const { channel } = message.member.voice;
    if (!channel) {
      const noperms = new EmbedBuilder()
        .setColor(0x00AE86)
        .setDescription(`${no} You must be connected to a voice channel to use this command.`);
      return await message.channel.send({ embeds: [noperms] });
    }

    if (message.member.voice.selfDeaf) {
      let thing = new EmbedBuilder()
        .setColor(0x00AE86)
        .setDescription(`${no} <@${message.member.id}> You cannot run this command while deafened.`);
      return await message.channel.send({ embeds: [thing] });
    }

    const botchannel = message.guild.members.me?.voice?.channel;
    const player = client.manager.players.get(message.guild.id);
    
    if (!player || !botchannel || !player.queue.current) {
      const noperms = new EmbedBuilder()
        .setColor(0x00AE86)
        .setDescription(`${no} There is nothing playing in this server.`);
      return await message.channel.send({ embeds: [noperms] });
    }

    if (player && channel.id !== player.voiceChannel) {
      const noperms = new EmbedBuilder()
        .setColor(0x00AE86)
        .setDescription(`${no} You must be connected to the same voice channel as me.`);
      return await message.channel.send({ embeds: [noperms] });
    }

    const song = player.queue.current;

    let embed = new EmbedBuilder()
      .setTitle("Now playing")
      .addFields(
        { name: 'Song', value: `[${song.title}](${song.uri})` },
        { name: 'Song By', value: `${song.author}` },
        { name: 'Duration', value: `\`${!song.isStream ? new Date(song.duration).toISOString().slice(11, 19) : '◉ LIVE'}\`` },
        { name: 'Queue Length', value: `${player.queue.length} Songs` },
        { name: 'Progress', value: createBar(player) }
      )
      .setColor(0x00AE86);

    message.member.send({ embeds: [embed] }).catch(e => {
      return message.channel.send({
        content: `${no} Couldn't send you a DM\n\nPossible reasons:\n- Your DMs are disabled\n- You have me blocked\n\nNone of these helped? Join our [**Support Server**](https://discord.gg/pCj2UBbwST) for more help.`
      });
    });
    
    return message.channel.send({ content: "**📪 Check your DMs.**" });
  }
};
