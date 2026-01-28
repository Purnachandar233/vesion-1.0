const User = require("../../schema/blacklistSchema.js")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
module.exports = {
    name: "whitelist",
    category: "owner",
    aliases: ["allow"],
    description: "Whitelists a blacklisted user!",
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

    
   User.findOne({
        UserID: args[0]
    }, async (err, data) => {
        if (!data) return message.reply(`\`\`\`\nNo Data Found\n\`\`\``);
        
        data.delete();
        const userop = args[0]
        const username = client.users.cache.get(userop)

        const lol = new EmbedBuilder()
            .setDescription(`${ok} Successfully Removed **${username}** From backlist`)
            .setColor(0x00AE86)
        message.reply({ embeds: [lol] })
        
    })


            }
                
        }
    
    
    
