'use strict';

module.exports = async function seedDatabase(models) {
	const {Entry} = models;

	// Remove all entries
	await Entry.deleteMany({});

};
