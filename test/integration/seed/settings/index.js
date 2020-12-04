'use strict';

module.exports = async function seedDatabase(models) {
	const {Settings} = models;

	// Create test settings, including a password
	await Settings.create({
		_id: 'settings-id',
		siteTitle: 'Test Audrey',
		removeOldEntries: true,
		daysToRetainOldEntries: 60,
		autoMarkAsRead: true,
		showHelpText: true,
		passwordHash: 'password'
	});

};
