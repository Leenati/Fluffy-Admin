const { EmbedBuilder, SlashCommandBuilder, ChannelType } = require('discord.js');
const { embedColor } = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Показывает информацию о сервере'),

    async execute(interaction, client) {
        const guild = interaction.guild;
        const createdAt = Math.floor(guild.createdTimestamp / 1000);
        const verificationLevel = guild.verificationLevel;
        const channelCount = guild.channels.cache.filter(ch => 
            ch.type === ChannelType.GuildText || ch.type === ChannelType.GuildVoice
        ).size;
        const roleCount = guild.roles.cache.size;
        
        const verificationLevels = {
            0: 'Нет',
            1: 'Низкий',
            2: 'Средний',
            3: 'Высокий',
            4: 'Очень высокий'
        };

        const ping = new EmbedBuilder()
            .setDescription(`🍞 Информация о сервере ${guild.name}`)
            .setColor(embedColor)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: 'Владелец', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'Участники', value: `${guild.memberCount}`, inline: true },
                { name: 'Создан', value: `<t:${createdAt}:d>`, inline: true },
                { name: 'Каналы', value: `${channelCount}`, inline: true },
                { name: 'Роли', value: `${roleCount}`, inline: true },
                { name: 'Верификация', value: `${verificationLevels[verificationLevel]}`, inline: true },
                { name: 'Уровень буста', value: `${guild.premiumTier}`, inline: true }
            )
            .setTimestamp();
        try {
            await interaction.reply({ embeds: [ping] });
        } catch (error) {
            console.error(`Возникла ошибка при выполнении команды`);
            console.error(error);
        };
    },
}