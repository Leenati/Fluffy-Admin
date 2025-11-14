const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		try {
			client.user.setStatus('online');
			client.user.setActivity('Your servers', { type: ActivityType.Watching });
			console.log(`Выполен вход как: ${client.user.tag}`);
			
		} catch (error) {
			console.error('Ошибка:', error);
		}
	},
};