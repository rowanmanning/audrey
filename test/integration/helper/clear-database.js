'use strict';

module.exports = function clearDatabase() {
	const {db} = global.app;
	return db.dropDatabase();
};
