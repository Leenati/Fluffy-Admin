const { EmbedBuilder, SlashCommandBuilder, MessageFlags } = require('discord.js');
const { embedColor, ownerId, botVersion } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Показывает информацию о боте'),

    async execute(interaction, client) {

        function plural(n, forms) {
            n = Math.abs(n) % 100;
            const n1 = n % 10;
            if (n > 10 && n < 20) return forms[2];
            if (n1 > 1 && n1 < 5) return forms[1];
            if (n1 === 1) return forms[0];
            return forms[2];
        }

        function formatUptime(ms) {
            let totalSeconds = Math.floor(ms / 1000);

            const days = Math.floor(totalSeconds / 86400);
            totalSeconds -= days * 86400;

            const hours = Math.floor(totalSeconds / 3600);
            totalSeconds -= hours * 3600;

            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds - minutes * 60;

            const parts = [];
            if (days) parts.push(`${days} ${plural(days, ['день', 'дня', 'дней'])}`);
            if (hours) parts.push(`${hours} ${plural(hours, ['час', 'часа', 'часов'])}`);
            if (minutes) parts.push(`${minutes} ${plural(minutes, ['минута', 'минуты', 'минут'])}`);
            parts.push(`${seconds} ${plural(seconds, ['секунда', 'секунды', 'секунд'])}`);

            return parts.join(', ');
        }

        const startedAt = client && client.startedAt
            ? client.startedAt
            : (Date.now() - Math.floor(process.uptime() * 1000));

        const ms = Date.now() - startedAt;
        const procMs = Math.floor(process.uptime() * 1000);

        const human = formatUptime(ms);
        const procHuman = formatUptime(procMs);

        let ownerUser;
        try {
            ownerUser = await interaction.client.users.fetch(ownerId);
        } catch (err) {
            console.error('Не удалось получить пользователя по ID:', ownerId, err);
            ownerUser = null;
        }

        const about = new EmbedBuilder()
            .setTitle(`🧩 Информация о боте и разработчике`)
            .setDescription('Краткая информация о боте')
            .setColor(embedColor || null)
            .addFields(
                { name: 'Разработчик', value: `${ownerUser.username}`, inline: true },
                { name: 'Версия', value: botVersion, inline: true },
                { name: 'Аптайм', value: `${procHuman} / ${human}`, inline: true }
            )
            .setTimestamp();

        try {
            await interaction.reply({ embeds: [about] });
        } catch (error) {
            console.error('Возникла ошибка при выполнении команды /about:');
            console.error(error);
            try {
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({ content: 'Произошла ошибка при выполнении команды.', flags: MessageFlags.Ephemeral });
                } else {
                    await interaction.followUp({ content: 'Произошла ошибка при выполнении команды.', flags: MessageFlags.Ephemeral });
                }
            } catch (e) {
                console.error('Не удалось отправить сообщение об ошибке:', e);
            }
        }
    },
};
