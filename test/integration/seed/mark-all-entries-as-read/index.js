'use strict';

module.exports = async function seedDatabase(models) {
	const {Entry} = models;

	// Mark all entries as read
	await Entry.updateMany({}, {
		$set: {
			isRead: true
		}
	});

};
