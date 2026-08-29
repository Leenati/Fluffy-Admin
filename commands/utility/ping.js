const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { embedColor } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Показывает задержку бота'),

    async execute(interaction, client) {
        const ping = new EmbedBuilder()
            .setTitle('🔩 Пинг соединения')
            .setDescription(`Задержка ответа API: ${interaction.client.ws.ping}ms`)
            .setColor(embedColor)
            .setTimestamp();
        
        try {
            await interaction.reply({ embeds: [ping] });
        } catch (error) {
            console.error(`Возникла ошибка при выполнении команды`);
            console.error(error);
        };
    },
}