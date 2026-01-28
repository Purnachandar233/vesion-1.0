const { EmbedBuilder } = require("discord.js");
const crypto = require("crypto");
const redeemCode = require("../../schema/redemcode.js");

module.exports = {
    name: "generate-code",
    category: "owner",
    aliases: ["gen-code"],
    description: "Generates a premium redeem code (Owner Only)",
    owneronly: true,
    execute: async (message, args, client, prefix) => {
        const days = parseInt(args[0]) || 30;
        const code = `JOKER-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        const expiry = Date.now() + (days * 24 * 60 * 60 * 1000);

        await redeemCode.create({
            Code: code,
            Expiry: expiry,
            Usage: 1
        });

        const embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle("Premium Code Generated")
            .setDescription(`**Code**: \`${code}\`\n**Duration**: ${days} days`)
            .setFooter({ text: "Use this code with the redeem command" });

        message.author.send({ embeds: [embed] }).catch(() => {
            message.channel.send(`Generated code: \`${code}\` (${days} days)`);
        });
        
        if (message.guild) message.channel.send("Generated a premium code and sent it to your DMs.");
    }
};
