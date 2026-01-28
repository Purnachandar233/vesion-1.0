const day = require("dayjs")
const { EmbedBuilder } = require("discord.js");
const schema = require("../../schema/Premium")

module.exports = {
    name: "addpremium-guild",
    category: "owner",
    aliases: ["apg"],
    description: "Adds a guild in premiumlist",
    owneronly: true,
    execute: async (message, args, client, prefix) => {
        let ok = client.emoji.ok;
        if (!args[0]) return message.reply({ content: "Please provide a Guild ID." })
        
        let data = await schema.findOne({ Id: args[0], Type: 'guild' });
        if (data) await data.deleteOne();

        await new schema({
            Id: args[0],
            Type: 'guild',
            Expire: args[1] ? day(args[1]).valueOf() : 0,
            Permanent: !args[1]
        }).save();

        const guildname = client.guilds.cache.get(args[0])?.name || args[0];
        const lol = new EmbedBuilder()
            .setDescription(`${ok} Successfully Added **${guildname}** In Premium List`)
            .setColor(0x00AE86)
        message.reply({ embeds: [lol] })
    }
}
