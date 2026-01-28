const { ActivityType, Events } = require("discord.js");
module.exports = async (client) => {
    client.manager.init(client.user.id);
    client.logger.log(`${client.user.username} online!`, "ready");
    client.user.setPresence({
        activities: [{ name: `${client.prefix}help | Music`, type: ActivityType.Listening }],
        status: 'online',
    });
};