const { EmbedBuilder } = require("discord.js");
const Premium = require("../../schema/Premium.js");

module.exports = {
    name: "redeem",
    category: "settings",
    description: "Redeem a bot premium key",
    execute: async (message, args, client, prefix) => {
        const key = args[0];
        if (!key) return message.reply("Please provide a premium key!");

        if (!key.startsWith("JOKER-")) return message.reply("Invalid premium key!");

        const existing = await Premium.findOne({ Id: message.guild.id, Type: 'guild' });
        if (existing) return message.reply("This server already has an active premium subscription!");

        const duration = 30 * 24 * 60 * 60 * 1000;
        await Premium.create({
            Id: message.guild.id,
            Type: 'guild',
            Code: key,
            Expire: Date.now() + duration
        });

        const embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle("Premium Activated")
            .setDescription(`Successfully activated **Joker Music Premium** for this server!\n**Expires**: <t:${Math.floor((Date.now() + duration) / 1000)}:R>`)
            .setFooter({ text: "Thank you for supporting Joker Music!" });

        message.channel.send({ embeds: [embed] });
    }
};
