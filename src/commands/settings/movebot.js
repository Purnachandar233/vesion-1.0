const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const twentyfourseven = require("../../schema/twentyfourseven")

module.exports = {
  name: "movebot",
  category: "settings",
  description: "Moves the bot to your voice channel!",
  owner: false,
  wl : true,

  execute: async (message, args, client, prefix) => {
      
    let ok = client.emoji.ok;
    let no = client.emoji.no;
    
    const channel = message.member.voice.channel;
    if(channel.id === message.guild.members.me?.voice?.channel.id) {
        const ttt = new EmbedBuilder()
        .setColor(0x00AE86)
        .setDescription(`${no} I am already in your channel`)
        return message.channel.send({embeds: [ttt]})
    }
const player = client.manager.players.get(message.guildId)
    const opop = new EmbedBuilder()
    .setColor(0x00AE86)
    .setDescription(`${ok} Joining your channel`)
    await message.channel.send({embeds: [opop]}).then(async msg => {
        const tne = new EmbedBuilder()
        .setColor(0x00AE86)
        .setDescription(` Trying to continue the player!`)
        msg.edit({embeds: [tne]}).then(async msg => {
            await message.guild.members.me?.voice.setChannel(message.member.voice.channel, "Resume queue in new channel");
            if(channel.type === "stage") {
                await message.guild.members.me?.voice.setSuppressed(false)
            }
            player.voiceChannel = message.member.voice.channel.id;
            const rrr = new EmbedBuilder()
            .setColor(0x00AE86)
            .setDescription(`${ok} Successfully continued queue!`)
            msg.edit({embeds: [rrr]})
        })
    })
     }
}