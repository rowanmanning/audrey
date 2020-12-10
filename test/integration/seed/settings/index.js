'use strict';

const differenceInDays = require('date-fns/differenceInDays');

module.exports = async function seedDatabase(models) {
	const {Settings} = models;

	// Create test settings, including a password
	await Settings.create({
		_id: 'settings-id',
		siteTitle: 'Test Audrey',
		removeOldEntries: true,

		// Retain entries posted on 1st Jan 2020 onwards
		daysToRetainOldEntries: differenceInDays(new Date(), new Date('2020-01-01T00:00:00Z')) + 1,

		autoMarkAsRead: true,
		showHelpText: true,
		passwordHash: 'password'
	});

};
