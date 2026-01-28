const User = require('../../schema/User.js');
const Premium = require("../../schema/Premium.js");
const blacklist = require("../../schema/blacklistSchema.js");
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const db = require('../../schema/prefix.js');

module.exports = async (client, message) => {
  if (!message.guild || message.author.bot) return;

  const Owners = [client.config.ownerId];

  let prefix;
  let data = await db.findOne({ Guild: message.guild.id });
  prefix = data ? data.Prefix : client.prefix;

  const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(mention)) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Invite").setStyle(5).setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`),
      new ButtonBuilder().setLabel("Support").setStyle(5).setURL(`https://discord.gg/pCj2UBbwST`)
    );
    const embed = new EmbedBuilder()
      .setColor(0x00AE86)
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
      .setDescription(`My prefix here is: \`${prefix}\` \n\nType \`${prefix}help\` to see commands.`);
    return message.channel.send({ embeds: [embed], components: [row] });
  }

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  const mentionprefix = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})`);
  if (!mentionprefix.test(message.content)) return;

  const matchedContent = message.content.match(mentionprefix)[0];
  const args = message.content.slice(matchedContent.length).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();
  
  const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));

  if (!command) return;

  let user = await User.findOne({ userId: message.author.id });
  if (!user) user = await User.create({ userId: message.author.id });
  user.count++;
  await user.save();

  if (command.owneronly && !Owners.includes(message.author.id)) {
    const embed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setDescription(`✧ This command is restricted to the **Bot Owner** only.`);
    return message.channel.send({ embeds: [embed] });
  }

  if (command.premium) {
    const pUser = await Premium.findOne({ Id: message.author.id, Type: 'user' });
    const pGuild = await Premium.findOne({ Id: message.guild.id, Type: 'guild' });
    
    let isVoted = false;
    if (client.topgg && client.topgg.hasVoted) {
        try {
            isVoted = await client.topgg.hasVoted(message.author.id);
        } catch (e) {
            console.log("Top.gg Vote Check Error:", e);
        }
    }

    if (!pUser && !pGuild && !isVoted) {
      const embed = new EmbedBuilder()
        .setColor(0x2f3136)
        .setAuthor({ name: "Premium Required", iconURL: client.user.displayAvatarURL() })
        .setDescription(`✧ This command requires a **Premium Subscription** or a **Vote** on Top.gg.`);
      
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel("Vote Me").setStyle(5).setURL(`https://top.gg/bot/${client.user.id}/vote`),
        new ButtonBuilder().setLabel("Get Premium").setStyle(5).setURL(`https://www.patreon.com/alexmusicbot/membership`)
      );

      return message.channel.send({ embeds: [embed], components: [row] });
    }
  }

  try {
    command.execute(message, args, client, prefix);
  } catch (error) {
    console.error(error);
  }
};