const day = require("dayjs")
const { EmbedBuilder, Message ,WebhookClient} = require("discord.js");
const prettyMiliSeconds = require("pretty-ms");
const redeemCode= require("../../schema/redemcode")
const ms = require("ms");
module.exports = {
    name: "generatecode-user",
    category: "owner",
    aliases: ["gcu"],
    description: "Generates a user redeem code.",
    owneronly: true,
    options: [
        {
            name: "user",
            description: "Uuild Id Daal le Bsdk",
            required: true,
            type: "STRING"
        }
    ],  
    execute: async (message, args, client, prefix) => {
    if (client.config.webhooks.ownerCmds) {
        const web = new WebhookClient({ url: client.config.webhooks.ownerCmds });
        const embed = new EmbedBuilder()
            .setTitle("Owner Command Used")
            .setDescription(`**Command:** \`generatecode-user\`\n**User:** ${message.author.tag} (${message.author.id})\n**Arguments:** ${args.join(" ") || "None"}`)
            .setColor("Blue")
            .setTimestamp();
        web.send({ embeds: [embed] }).catch(() => {});
    }
       
    
    let ok = client.emoji.ok;
    let no = client.emoji.no;

    if (!args[0]) {
        let xd = new EmbedBuilder()
            .setColor(0x00AE86)
            .setDescription(`${no} | Please Provide A Time For Expiry (e.g. 1d, 30d)`)
        return message.reply({ embeds: [ xd ] })
    }

    const Expiry = ms(args[0]) + Date.now();
    if (isNaN(Expiry)) {
        let xd = new EmbedBuilder()
            .setColor(0x00AE86)
            .setDescription(`${no} | Invalid time format provided. Use 1h, 1d, etc.`)
        return message.reply({ embeds: [ xd ] })
    }

    let Usage = 1;
    if (args[1] && !isNaN(args[1])) {
        Usage = parseInt(args[1]);
    }

    function generateCode(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    const Code = `JOKER-${generateCode(12).toUpperCase()}`;

    let success = new EmbedBuilder()
        .setTitle(`${ok} Code Added To Database`)
        .setDescription(
`
\`\`\`
Code      :: ${Code}
Validity  :: ${prettyMiliSeconds(Expiry-Date.now())}
Usage     :: redeem ${Code}
\`\`\`
`)
        .setColor(0x00AE86)
    message.channel.send({embeds: [success]})
    console.log({embeds:[success]})

    const premObj = {
        Usage: Usage,
        Code: Code,
        Expiry: Expiry,
    };

    const saveCode = new redeemCode(premObj);
    await saveCode.save();
  }
    }
