const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { embedColor } = require('../../config.json');
const { pingRcon } = require('../../events/rcon.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Показывает задержку бота'),

    async execute(interaction, client) {
        let rconPing = null;
        
        try {
            rconPing = await pingRcon();
        } catch (error) {
            rconPing = null;
        }

        const ping = new EmbedBuilder()
            .setTitle('🔩 Пинг соединения')
            .setDescription(`Задержка ответа API: ${interaction.client.ws.ping}ms\nЗадержка ответа RCON: ${rconPing}ms`)
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