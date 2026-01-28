const { EmbedBuilder } = require('discord.js');
const track = require('../../schema/trackinfoSchema.js');
const spotify = require("@ksolo/spotify-search");
const clientID = "Spotify_ClientId";
const secretKey = "Spotify_Secret";
spotify.setCredentials(clientID, secretKey);
const fetch = require('isomorphic-unfetch');
const { getPreview, getTracks } = require('spotify-url-info')(fetch);

module.exports = {
  name: 'play',
  category: 'music',
  aliases: ["p", "pla"],
  description: 'Play your favorite melodies in high quality.',
  owner: false,
  wl: true,
  execute: async (message, args, client, prefix) => {
    const query = args.join(" ");
    if (!query) {
      return await message.channel.send({
        embeds: [new EmbedBuilder().setColor(0x00AE86).setDescription("Please provide a search input.")]
      }).catch(() => { });
    }
    const { channel } = message.member.voice;
    if (!channel) {
      return await message.reply({ embeds: [new EmbedBuilder().setColor(0x00AE86).setDescription("You must be in a voice channel to use this command.")] });
    }

    if (query.toLowerCase().includes("youtube.com") || query.toLowerCase().includes("youtu.be")) {
      const noperms = new EmbedBuilder()
        .setColor(0x00AE86)
        .setAuthor({ name: 'YouTube URL', iconURL: client.user.displayAvatarURL({ forceStatic: false }) })
        .setDescription(`We no longer support YouTube, please use other platforms like Spotify, SoundCloud or Bandcamp.`);
      return await message.reply({ embeds: [noperms] });
    }

    let player = client.manager.get(message.guildId);
    if (player && channel.id !== player.voiceChannel) {
      return await message.reply({ embeds: [new EmbedBuilder().setColor(0x2f3136).setDescription("*We must be in the same voice channel to harmonize.*")] });
    }

    // Classic Aesthetic Play Logic
    if (!player) player = client.manager.create({
      guild: message.guildId,
      textChannel: message.channelId,
      voiceChannel: message.member.voice.channelId,
      selfDeafen: true,
    });

    const s = await player.search(query, message.member.user);
    if (s.loadType === "LOAD_FAILED" || s.loadType === "NO_MATCHES") {
        if (player && !player.queue.current) player.destroy();
        return await message.channel.send({ embeds: [new EmbedBuilder().setColor(0x2f3136).setDescription("*The search yielded no echoes. Try a different query.*")] });
    }

    if (player.state !== "CONNECTED") player.connect();
    
    if (s.loadType === "PLAYLIST_LOADED") {
        player.queue.add(s.tracks);
        if (!player.playing && !player.paused && player.queue.totalSize === s.tracks.length) player.play();
        return await message.channel.send({
          embeds: [new EmbedBuilder().setColor(0x2f3136).setTitle("Playlist Entrusted").setDescription(`┕ Added **${s.tracks.length}** tracks from **${s.playlist.name}**`).setFooter({ text: "Classic Aesthetic • Joker Music" })]
        });
    } else {
        player.queue.add(s.tracks[0]);
        if (!player.playing && !player.paused && !player.queue.size) player.play();
        return await message.channel.send({
          embeds: [new EmbedBuilder().setColor(0x2f3136).setTitle("Melody Queued").setDescription(`┕ [${s.tracks[0].title}](${s.tracks[0].uri})\n┕ Requested by: \`${message.member.user.tag}\``).setFooter({ text: "Classic Aesthetic • Joker Music" })]
        });
    }
  }
}
