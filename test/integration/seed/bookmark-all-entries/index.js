'use strict';

module.exports = async function seedDatabase(models) {
	const {Entry} = models;

	// Mark all entries as bookmarked
	await Entry.updateMany({}, {
		$set: {
			isBookmarked: true
		}
	});

};
