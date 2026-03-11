const { Events, ActivityType } = require('discord.js');
const { initializeRcon } = require('./rcon.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		try {

			client.user.setPresence({
				activities: [{ name: 'Breadland', type: ActivityType.Watching }],
				status: 'online'
			});
			console.log(`Выполнен вход как: ${client.user.tag}`);

			initializeRcon(client);
		} catch (error) {
			console.error('Ошибка:', error);
		}
	},
};