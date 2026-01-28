const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Collection } = require("discord.js");
module.exports = async (client, player, oldChannel, newChannel) => {
        
        const guild = client.guilds.cache.get(player.guild)
        if(!guild) return;
        const channel = guild.channels.cache.get(player.textChannel);
          if(oldChannel === newChannel) return;
          if(newChannel === null || !newChannel) {
          if(!player) return;
          if(channel) {
                  
                const msg = player.get(`playingsongmsg`);
                if (msg && msg.delete) {
                    msg.delete().catch(() => {});
                }
                player.destroy();
                return;
          }
         
        } else {
          player.voiceChannel = newChannel
          setTimeout( () => {             player.pause(false)   }, 100)
    
        }
        let denginde = new EmbedBuilder()// fuck off , madaercod , gandu , lawda ,tere makichut, ne pelam ni denga , ne jati pukku lo na moda,and much more to @SARKAR & @AD 

        .setColor(0x00AE86)
        .setTitle(`Player has been moved`)
        .setDescription(`I have been moved from <#${oldChannel}> to <#${newChannel}>`)
        channel.send({embeds : [denginde]}).then(msg => { setTimeout(() => { if (msg.delete) msg.delete().catch(() => {}) }, 10000) });
}
