const { EmbedBuilder } = require("discord.js");
const prettyMiliSeconds = require("pretty-ms");
const redeemCode = require("../../schema/redemcode.js");
const Premium = require("../../schema/Premium.js");

module.exports = {
    name: "set-serverprem",
    category: "owner",
    aliases: ["add"],
    description: "redeems a redem code",
    owneronly: true,
    execute: async (message, args, client, prefix) => {
        let ok = client.emoji.ok;
        let no = client.emoji.no;
        let serverid = args[0] || message.guildId;
        
        const isPremiumGuild = await Premium.findOne({ Id: serverid, Type: 'guild' });
        if (isPremiumGuild) {
            let alr = new EmbedBuilder()
                .setDescription(`${no} | This Server Already Has a Premium Subscription.`)
                .setColor(0x00AE86);
            return message.channel.send({ embeds: [alr] });
        }

        if (!args[1]) return message.channel.send(`No Code Provided!!`);

        const CodeOk = await redeemCode.findOne({ Code: args[1] });
        if (!CodeOk) {
            let exp = new EmbedBuilder()
                .setDescription(`${no} | Code Is Invalid Or Expired`)
                .setColor(0x00AE86);
            return message.channel.send({ embeds: [exp] });
        }

        await Premium.create({
            Id: serverid,
            Type: 'guild',
            Expire: CodeOk.Expiry,
            Permanent: false,
        });

        if (CodeOk.Usage <= 1) {
            await CodeOk.deleteOne();
        } else {
            await redeemCode.findOneAndUpdate({ Code: args[1] }, { Usage: CodeOk.Usage - 1 });
        }

        let success = new EmbedBuilder()
            .setTitle(`Premium Activated`)
            .setDescription(`${ok} | \`Joker Music Premium Activated Successfully\`\n\`\`\`asciidoc\nTarget ID    :: ${serverid}\nExpiry       :: ${prettyMiliSeconds(CodeOk.Expiry - Date.now())}\n\`\`\``)
            .setColor(0x00AE86);

        message.channel.send({ embeds: [success] });
    }
}
