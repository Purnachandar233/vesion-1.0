const { EmbedBuilder } = require("discord.js");
const prettyMiliSeconds = require("pretty-ms");
const redeemCode = require("../../schema/redemcode.js");
const Premium = require("../../schema/Premium.js");

module.exports = {
    name: "user-redeem",
    category: "special",
    aliases: ["redeem-user"],
    wl: true,
    description: "redeems a redem code",
    execute: async (message, args, client, prefix) => {
        let ok = client.emoji.ok;
        let no = client.emoji.no;

        const isPremiumUser = await Premium.findOne({ Id: message.author.id, Type: 'user' });
        if (isPremiumUser) {
            let alr = new EmbedBuilder()
                .setDescription(`${no} | This User Already Has a Premium Subscription.`)
                .setColor(0x00AE86);
            return message.channel.send({ embeds: [alr] });
        }

        if (!args[0]) return message.channel.send(`No Code Provided!!`);

        const CodeOk = await redeemCode.findOne({ Code: args[0] });
        if (!CodeOk) {
            let exp = new EmbedBuilder()
                .setDescription(`${no} | Code Is Invalid Or Expired`)
                .setColor(0x00AE86);
            return message.channel.send({ embeds: [exp] });
        }

        await Premium.create({
            Id: message.author.id,
            Type: 'user',
            Expire: CodeOk.Expiry,
            Permanent: false,
        });

        if (CodeOk.Usage <= 1) {
            await CodeOk.deleteOne();
        } else {
            await redeemCode.findOneAndUpdate({ Code: args[0] }, { Usage: CodeOk.Usage - 1 });
        }

        let success = new EmbedBuilder()
            .setTitle("Premium Activated")
            .setDescription(`${ok} | \`Joker Music Premium Activated Successfully\``)
            .setColor(0x00AE86);

        message.channel.send({ embeds: [success] });
    }
}
