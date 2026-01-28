const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { convertTime } = require('../../utils/convert.js');
const ms = require('ms');
module.exports = {
  name: 'seek',
  category: 'music',
  aliases: [],
  description: 'Seek to a specific time in a song.',
  owner: false,
  djonly : true,
  wl : true,
  execute: async (message, args, client, prefix) => {
     
    let ok = client.emoji.ok;
    let no = client.emoji.no;
    
    const time = args.join(" ")
    //
    
    //
       const { channel } = message.member.voice;
       if (!channel) {
                       const noperms = new EmbedBuilder()
                      
            .setColor(0x00AE86)
              .setDescription(`${no} You must be connected to a voice channel to use this command.`)
           return await message.channel.send({embeds: [noperms]});
       }
       if(message.member.voice.selfDeaf) {	
         let thing = new EmbedBuilder()
          .setColor(0x00AE86)
 
        .setDescription(`${no} <@${message.member.id}> You cannot run this command while deafened.`)
          return await message.channel.send({embeds: [thing]});
        }
       const botchannel = message.guild.members.me?.voice?.channel;
       const player = client.manager.players.get(message.guild.id);
       if(!player || !botchannel || !player.queue.current) {
                       const noperms = new EmbedBuilder()
 
            .setColor(0x00AE86)
            .setDescription(`${no} There is nothing playing in this server.`)
           return await message.channel.send({embeds: [noperms]});
       }
       if(player && channel.id !== player.voiceChannel) {
                                   const noperms = new EmbedBuilder()
              .setColor(0x00AE86)
           .setDescription(`${no} You must be connected to the same voice channel as me.`)
           return await message.channel.send({embeds: [noperms]});
       }
         
       if (!time[0]) {
        const ppp = new EmbedBuilder()
        .setDescription(`${no} Please specify a vaild time ex: \`1m\`.`)
        return message.channel.send({embeds: [ppp]});
      }
       const etime = require('ms')(time)
    player.seek(etime)
   
     let thing = new EmbedBuilder()
       .setColor(0x00AE86)
       .setDescription(`${ok} seeked to \`${convertTime(player.position)}\``)
     return await message.channel.send({ embeds: [thing] });
      
        }
}