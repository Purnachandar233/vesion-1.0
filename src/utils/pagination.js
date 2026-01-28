const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ComponentType } = require('discord.js')

/**
 * interaction.followUp
 * Creates a pagination embed
 * @param {Message} message
 * @param {EmbedBuilder[]} pages
 * @param {ButtonBuilder[]} buttonList
 * @param {any} author
 * @param {number} timeout
 * @returns
 */
const messagepaginationEmbed = async (message, pages, buttonList, author, timeout) => {
    if (buttonList[0].data.style === 5 || buttonList[1].data.style === 5 || buttonList[2].data.style === 5 || buttonList[3].data.style === 5) { throw new Error('Link isnt supported.'); }
    let page = 0;
    const row = new ActionRowBuilder().addComponents(buttonList);
    const currentPage = await message.reply({ 
        embeds: [pages[page].setFooter({ text: `Page ${page + 1}/${pages.length}` })], 
        components: [row], 
        allowedMentions: { repliedUser: false } 
    });

    const filter = (i) => i.user.id === author.id;
    const collector = await currentPage.createMessageComponentCollector({ filter, time: timeout });

    collector.on('collect', async (i) => {
        await i.deferUpdate();
        switch (i.customId) {
            case buttonList[0].data.custom_id:
                page = 0;
                break;
            case buttonList[1].data.custom_id:
                page = page > 0 ? --page : pages.length - 1;
                break;
            case buttonList[2].data.custom_id:
                page = page + 1 < pages.length ? ++page : 0;
                break;
            case buttonList[3].data.custom_id:
                page = pages.length - 1;
                break;
            default:
                break;
        }
        await i.editReply({ 
            embeds: [pages[page].setFooter({ text: `Page ${page + 1}/${pages.length}` })], 
            components: [row] 
        });
        collector.resetTimer();
    });

    collector.on('end', () => {
        const disabledRow = new ActionRowBuilder().addComponents(
            buttonList[0].setDisabled(true), 
            buttonList[1].setDisabled(true), 
            buttonList[2].setDisabled(true), 
            buttonList[3].setDisabled(true)
        );
        currentPage.edit({ 
            embeds: [pages[page].setFooter({ text: `Page ${page + 1}/${pages.length}` })], 
            components: [disabledRow] 
        }).catch(() => {});
    });
    return currentPage;
};

const intpaginationEmbed = async (interaction, pages, buttonList, author, timeout) => {
    if (buttonList[0].data.style === 5 || buttonList[1].data.style === 5 || buttonList[2].data.style === 5 || buttonList[3].data.style === 5) { throw new Error('Link isnt supported'); }
    let page = 0;
    const row = new ActionRowBuilder().addComponents(buttonList);
    const currentPage = await interaction.reply({ 
        embeds: [pages[page].setFooter({ text: `Page ${page + 1}/${pages.length}` })], 
        components: [row], 
        fetchReply: true 
    });

    const filter = (i) => i.user.id === author.id;
    const collector = await currentPage.createMessageComponentCollector({ filter, time: timeout });

    collector.on('collect', async (i) => {
        await i.deferUpdate();
        switch (i.customId) {
            case buttonList[0].data.custom_id:
                page = 0;
                break;
            case buttonList[1].data.custom_id:
                page = page > 0 ? --page : pages.length - 1;
                break;
            case buttonList[2].data.custom_id:
                page = page + 1 < pages.length ? ++page : 0;
                break;
            case buttonList[3].data.custom_id:
                page = pages.length - 1;
                break;
            default:
                break;
        }
        await i.editReply({ 
            embeds: [pages[page].setFooter({ text: `Page ${page + 1}/${pages.length}` })], 
            components: [row] 
        });
        collector.resetTimer();
    });

    collector.on('end', () => {
        const disabledRow = new ActionRowBuilder().addComponents(
            buttonList[0].setDisabled(true), 
            buttonList[1].setDisabled(true), 
            buttonList[2].setDisabled(true), 
            buttonList[3].setDisabled(true)
        );
        interaction.editReply({ 
            embeds: [pages[page].setFooter({ text: `Page ${page + 1}/${pages.length}` })], 
            components: [disabledRow] 
        }).catch(() => {});
    });
    return currentPage;
};

const queuepaginationEmbed = async (interaction, pages, buttonList, author, timeout) => {
    if (buttonList[0].data.style === 5 || buttonList[1].data.style === 5 || buttonList[2].data.style === 5 || buttonList[3].data.style === 5) { throw new Error('Link isnt supported'); }
    let page = 0;
    const row = new ActionRowBuilder().addComponents(buttonList);
    const currentPage = await interaction.followUp({ 
        embeds: [pages[page].setFooter({ text: `Page ${page + 1}/${pages.length}` })], 
        components: [row], 
        fetchReply: true, 
        ephemeral: true  
    });

    const filter = (i) => i.user.id === author.id;
    const collector = await currentPage.createMessageComponentCollector({ filter, time: timeout });

    collector.on('collect', async (i) => {
        await i.deferUpdate();
        switch (i.customId) {
            case buttonList[0].data.custom_id:
                page = 0;
                break;
            case buttonList[1].data.custom_id:
                page = page > 0 ? --page : pages.length - 1;
                break;
            case buttonList[2].data.custom_id:
                page = page + 1 < pages.length ? ++page : 0;
                break;
            case buttonList[3].data.custom_id:
                page = pages.length - 1;
                break;
            default:
                break;
        }
        await i.editReply({ 
            embeds: [pages[page].setFooter({ text: `Page ${page + 1}/${pages.length}` })], 
            components: [row] 
        });
        collector.resetTimer();
    });

    collector.on('end', () => {
        const disabledRow = new ActionRowBuilder().addComponents(
            buttonList[0].setDisabled(true), 
            buttonList[1].setDisabled(true), 
            buttonList[2].setDisabled(true), 
            buttonList[3].setDisabled(true)
        );
        interaction.editReply({ 
            embeds: [pages[page].setFooter({ text: `Page ${page + 1}/${pages.length}` })], 
            components: [disabledRow] 
        }).catch(() => {});
    });
    return currentPage;
};

module.exports = { messagepaginationEmbed, intpaginationEmbed, queuepaginationEmbed };