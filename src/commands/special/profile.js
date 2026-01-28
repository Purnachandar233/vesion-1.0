const { EmbedBuilder } = require("discord.js");
const User = require("../../schema/User.js")
const prettyMiliSeconds = require("pretty-ms");
const Premium = require("../../schema/Premium.js")

module.exports = {
    name: "profile",
    category: "special",
    description: "Gives Your or other's profile",
    wl : true,
    execute: async (message, args, client, prefix) => {
        let owner = client.emoji.owner;
        let dev = client.emoji.developer;
        let bug = client.emoji.bughunter;
        let sup = client.emoji.supporter;
        let prem = client.emoji.premium;
        let staff = client.emoji.staff;
        let manager = client.emoji.manager;
        let partner = client.emoji.partner;
        let booster = client.emoji.booster;

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        let data = await User.findOne({ userId: member.id });
        if (!data) data = await User.create({ userId: member.id });

        let cache = [];
        if(data.badge.owner) cache.push(`${owner} Owner`);
        if(data.badge.dev) cache.push(`${dev} Developer`);
        if(data.badge.supporter) cache.push(`${sup} Supporter`);
        if(data.badge.bug) cache.push(`${bug} Bug Hunter`);
        if(data.badge.premium) cache.push(`${prem} Premium`);
        if(data.badge.manager) cache.push(`${manager} Manager`);
        if(data.badge.partner) cache.push(`${partner} Partner`);
        if(data.badge.staff) cache.push(`${staff} Staff`);
        if(data.badge.booster) cache.push(`${booster} Booster`);

        const isPremium = await Premium.findOne({ Id: member.id, Type: 'user' });
        let premiumInfo = "None";
        if (isPremium) {
            if (isPremium.Permanent) {
                premiumInfo = "Validity : Permanent";
            } else {
                const timeLeft = isPremium.Expire - Date.now();
                premiumInfo = timeLeft > 0 ? `Validity : ${prettyMiliSeconds(timeLeft)}` : "None";
            }
        }

        const profile = new EmbedBuilder()
            .setColor(0x00AE86)
            .setAuthor({ name: `Profile: ${member.user.username}`, iconURL: member.user.displayAvatarURL() })
            .addFields(
                { name: "Commands", value: `${data.count}`, inline: true },
                { name: "Badges", value: cache.join("\n") || "None", inline: true },
                { name: "Premium Status", value: premiumInfo, inline: true }
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({ text: "Joker Music" });
        message.channel.send({ embeds: [profile] });   
    }
}
