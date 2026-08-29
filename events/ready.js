const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		try {

			client.user.setPresence({
				activities: [{ name: 'YourActivity', type: ActivityType.Watching }],
				status: 'online'
			});
			console.log(`Выполнен вход как: ${client.user.tag}`);

		} catch (error) {
			console.error('Ошибка:', error);
		}
	},
};