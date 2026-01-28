const { CommandInteraction, Client, EmbedBuilder, ApplicationCommandType } = require("discord.js");
const track = require('../../schema/trackinfoSchema.js')
const spotify = require("@ksolo/spotify-search");
const clientID = "Spotify_ClientId";
const secretKey = "Spotify_Secret";
 spotify.setCredentials(clientID, secretKey);
 const fetch = require('isomorphic-unfetch');

const { getData, getPreview, getTracks, getDetails } = require('spotify-url-info')(fetch)
module.exports = {
  name: "play",
  description: "plays some high quality music",
  owner: false,
  player: false,
  inVoiceChannel: true,
  sameVoiceChannel: false,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "query",
      description: "name link etc.",
      required: true,
      type: 3
    }
  ],

  run: async (client, interaction) => {
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply({ ephemeral: false }).catch(() => {});
    }
    
    const query = interaction.options.getString("query");
    if (!query) return await interaction.editReply({ embeds: [new EmbedBuilder().setColor(0x00AE86).setDescription("Please provide a search input to search.")] }).catch(() => {});

    const { channel } = interaction.member.voice;
    if (!channel) {
      const noperms = new EmbedBuilder().setColor(0xff0000).setDescription(`You must be connected to a voice channel to use this command.`);
      return await interaction.editReply({ embeds: [noperms] });
    }

    if (interaction.member.voice.selfDeaf) {
      let thing = new EmbedBuilder().setColor(0xff0000).setDescription(`You cannot run this command while deafened.`);
      return await interaction.editReply({ embeds: [thing] });
    }

    let player = client.manager.get(interaction.guildId);
    if (player && channel.id !== player.voiceChannel) {
      const noperms = new EmbedBuilder().setColor(0xff0000).setDescription(`You must be connected to the same voice channel as me.`);
      return await interaction.editReply({ embeds: [noperms] });
    }

    if (query.toLowerCase().includes("youtube.com") || query.toLowerCase().includes("youtu.be")) {
      const noperms = new EmbedBuilder()
        .setColor(0xff0000)
        .setAuthor({ name: 'YouTube URL', iconURL: client.user.displayAvatarURL({ forceStatic: false }) })
        .setDescription(`We no longer support YouTube, please use other platforms like Spotify, SoundCloud or Bandcamp. Otherwise use a search query to use our default system.`);
      return await interaction.editReply({ embeds: [noperms] });
    }

    if (!player) player = client.manager.create({
      guild: interaction.guildId,
      textChannel: interaction.channelId,
      voiceChannel: interaction.member.voice.channelId,
      selfDeafen: true,
    });

    const s = await player.search(query, interaction.member.user);
    if (s.loadType === "LOAD_FAILED" || s.loadType === "NO_MATCHES") {
      if (player && !player.queue.current) player.destroy();
      return await interaction.editReply({ content: `No results found or load failed.` }).catch(() => {});
    }

    if (player && player.state !== "CONNECTED") player.connect();

    if (s.loadType === "PLAYLIST_LOADED") {
      player.queue.add(s.tracks);
      if (!player.playing && !player.paused && player.queue.totalSize === s.tracks.length) player.play();
      const embed = new EmbedBuilder().setColor(0x00AE86).setDescription(`Queued **${s.tracks.length}** tracks from **${s.playlist.name}**`);
      return await interaction.editReply({ embeds: [embed] }).catch(() => {});
    } else {
      player.queue.add(s.tracks[0]);
      if (!player.playing && !player.paused && !player.queue.size) player.play();
      const embed = new EmbedBuilder().setColor(0x00AE86).setDescription(`Queued **${s.tracks[0].title}** [\`${s.tracks[0].requester.tag}\`]`);
      return await interaction.editReply({ embeds: [embed] }).catch(() => {});
    }
  },
};