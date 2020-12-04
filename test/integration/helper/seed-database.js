'use strict';

const clearDatabase = require('./clear-database');

module.exports = async function seedDatabase(seeds) {
	await clearDatabase();
	const {db, models} = global.app;
	for (const seed of seeds) {
		await require(`${__dirname}/../seed/${seed}`)(models, db);
	}
};
