const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { convertTime } = require('../../utils/convert.js');
const dbtrack = require('../../schema/trackinfoSchema.js')
const db = require("quick.db")

module.exports = async (client, player, track, res) => {
    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;

    const thing = new EmbedBuilder()
        .setAuthor({ name: 'Now Playing', iconURL: client.user.displayAvatarURL() })
        .setDescription(`[${track.title}](${track.uri}) - \`${track.isStream ? 'LIVE' : convertTime(track.duration)}\``)
        .setColor(0x00AE86);

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setStyle(2).setEmoji('⏸️').setCustomId("prtrack"),
        new ButtonBuilder().setStyle(2).setEmoji('⏭️').setCustomId("skiptrack"),
        new ButtonBuilder().setStyle(2).setEmoji('🔁').setCustomId("looptrack"),
        new ButtonBuilder().setStyle(2).setEmoji('📜').setCustomId("showqueue"),
        new ButtonBuilder().setStyle(2).setEmoji('⏹️').setCustomId("stop")
    );

    channel.send({ embeds: [thing], components: [row] }).then(msg => {
        if (player.get(`playingsongmsg`)) player.get(`playingsongmsg`).delete().catch(() => {});
        player.set(`playingsongmsg`, msg);
    }).catch(() => {});
};