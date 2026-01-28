const { EmbedBuilder } = require("discord.js");
const User = require("../../schema/User.js")
const prettyMiliSeconds = require("pretty-ms");
const day = require("dayjs");
const Premium = require("../../schema/Premium.js")
module.exports = {
    name: "profile",
    description: "Shows your profile",
    wl : true,
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });
        let owner = client.emoji.owner
        let dev = client.emoji.developer
        let bug = client.emoji.bughunter
        let sup = client.emoji.supporter
        let prem = client.emoji.premium
        let staff = client.emoji.staff
        let manager = client.emoji.manager
        let partner = client.emoji.partner
        let booster = client.emoji.booster
        let vip = client.emoji.vip

        let cache = []
        let member = interaction.member
        let data = await User.findOne({ userId: member.id });
        if (!data) data = await User.create({ userId: member.id });

        if(data.badge.owner) cache.push(`${owner} Owner`)
        if(data.badge.dev) cache.push(`${dev} Verified Bot Developer`)
        if(data.badge.supporter) cache.push(`${sup} Supporter`)
        if(data.badge.bug) cache.push(`${bug} Bug Hunter`)
        if(data.badge.premium) cache.push(`${prem} Premium User`)
        if(data.badge.manager) cache.push(`${manager} Manager`)
        if(data.badge.partner) cache.push(`${partner} Partnered Member`)
        if(data.badge.staff) cache.push(`${staff} Staff Member`)
        if(data.badge.booster) cache.push(`${booster} Server Booster`)
        if(data.badge.vip) cache.push(`${vip} Guest`)

        if(cache.length === 0) cache.push(`you have no achievements!`)

        const isPremium = await Premium.findOne({ Id: member.id, Type: 'user' });
        let cache1 = []
        if(isPremium && !isPremium.Permanent) cache1.push(`\`Validity\` : ${prettyMiliSeconds(isPremium.Expire-Date.now())}`)
        if(isPremium && isPremium.Permanent) cache1.push(`\`Validity\` : Permanent Subscription`)
        if (!isPremium) cache1.push(`You don't have any active user premium subscription.`)

        let cache2 = []
        const voteok = client.topgg ? await client.topgg.hasVoted(member.id).catch(() => false) : false;
        if(!voteok) cache2.push(`\`Not Voted\``)
        if(voteok) cache2.push(`\`Voted\``)

        const profile = new EmbedBuilder()
            .setColor(0x00AE86)
            .setAuthor({ name: `Joker Music Profile Of ${member.user.username}` })
            .addFields(
                { name: "Commands used", value: `${data.count}`, inline: true },
                { name: `Achievements`, value: cache.join("\n"), inline: true },
                { name: `Premium Status`, value: cache1.join("\n"), inline: true },
                { name: `Has Voted?`, value: cache2.join("\n"), inline: true }
            );
        await interaction.followUp({embeds: [profile]})
    }
}
