const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const twentyfourseven = require("../../schema/twentyfourseven")

module.exports = {
  name: "moveme",
  category: "settings",
  description: "Moves you to the bots voice channel!",
  owner: false,
  wl : true,

  execute: async (message, args, client, prefix) => {
      
    let ok = client.emoji.ok;
    let no = client.emoji.no;
    
    let channel = message.member.voice.channel;
        let botchannel = message.guild.members.me?.voice?.channel;
        if(!botchannel) {
          const ifkf = new EmbedBuilder()
          .setColor(0x00AE86)
          .setDescription(`${ok} I am connected nowhere`)
          return message.channel.send({embeds: [ifkf]})
        }
        if(!channel) {
          const dd = new EmbedBuilder()
          .setColor(0x00AE86)
          .setDescription(`${no} Please Connect to a voice channel first`)
          return message.channel.send({embeds: [dd]})
        }
        if(botchannel.userLimit >= botchannel.members.length) {
          const idkd = new EmbedBuilder()
          .setColor(0x00AE86)
          .setDescription(`${no} Sorry my channel is full, I cant move you`)
          return message.channel.send({embeds: [idkd]})
        }
        if(botchannel.id == channel.id) {
          const tt = new EmbedBuilder()
          .setColor(0x00AE86)
          .setDescription(`${no} You are already in my channel `)
          return message.channel.send({embeds: [tt]})
        }
        message.member.voice.setChannel(botchannel);
        const ioop = new EmbedBuilder()
        .setColor(0x00AE86)
        .setDescription(`${ok} moved you to: \`${botchannel.name}\``)
        return message.channel.send({embeds: [ioop]});
      }
     }
