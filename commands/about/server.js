const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { embedColor, ownerID } = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Показывает информацию о сервере'),

    async execute(interaction, client) {
        const ping = new EmbedBuilder()
            .setTitle(`Информация о сервере ${interaction.guild ? interaction.guild.name : 'DM'}`)
            .setDescription(`Краткая информация о сервере`)
            .setColor(embedColor)
            .addFields(
                { name: 'Владелец', value: `<@${interaction.guild.ownerId}>`, inline: true },
                { name: 'Участники', value: `${interaction.guild.memberCount}`, inline: true }
            );
        try {
            await interaction.reply({ embeds: [ping] });
        } catch (error) {
            console.error(`Возникла ошибка при выполнении команды`);
            console.error(error);
        };
    },
}