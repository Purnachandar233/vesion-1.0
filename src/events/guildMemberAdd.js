const { EmbedBuilder } = require("discord.js");

module.exports = async (client) => {
  client.on("guildMemberAdd", async (member) => {
    const welcomeChannel = member.guild.channels.cache.find(
      (ch) =>
        ch.name.toLowerCase().includes("welcome") ||
        ch.name.toLowerCase().includes("greet") ||
        ch.name.toLowerCase().includes("hello")
    );

    if (!welcomeChannel) return;

    const welcomeEmbed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setTitle(`✧ New Harmony in ${member.guild.name}`)
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `┕ Welcome, ${member}! We are delighted to have you join our symphony.\n\n` +
        `*Please explore our channels and enjoy the music.*`
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        {
          name: "✧ Identity",
          value: `┕ ${member.user.username}`,
          inline: true,
        },
        {
          name: "✧ Ensemble Size",
          value: `┕ ${member.guild.memberCount}`,
          inline: true,
        },
        {
          name: "✧ Joined On",
          value: `┕ <t:${Math.floor(Date.now() / 1000)}:d>`,
          inline: true,
        }
      )
      .setFooter({
        text: "Classic Aesthetic • Joker Music",
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    welcomeChannel.send({ embeds: [welcomeEmbed] }).catch(() => {});
  });
};
