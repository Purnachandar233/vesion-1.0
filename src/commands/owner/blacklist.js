const User = require("../../schema/blacklistSchema.js")

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
module.exports = {
    name: "blacklist",
    category: "owner",
    aliases: ["restrict"],
    description: "Reload Command",
    owneronly: true,
    execute: async (message, args, client, prefix) => {
          
        let ok = client.emoji.ok;
        let no = client.emoji.no;
            const aa = new EmbedBuilder()
            .setDescription(`Please Provide A User Id...`)
            .setColor(0x00AE86)
        const aaa = new EmbedBuilder()
            .setDescription(`Please Provide A Valid User ID`)
            .setColor(0x00AE86)
        if (!args[0]) return message.reply({ embeds: [aa] })
        if (!client.users.cache.has(args[0])) return message.reply({ embeds: [aaa] });
    
        
        User.findOne({ UserID: args[0] }, async (err, data) => {
    
            if (data) {
                message.reply(`This user is already blacklisted!`)
            }
                new User({
                    UserID: args[0],
                }).save();
    
            
            const userop = args[0]
            const username = client.users.cache.get(userop)
    
            const lol = new EmbedBuilder()
                .setDescription(`${ok} Blacklisted ${username} form using the bot!`)
                .setColor(0x00AE86)
            message.reply({ embeds: [lol] })
                
        })
    
    
    }
}