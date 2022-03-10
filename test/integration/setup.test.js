'use strict';

const clearDatabase = require('./helper/clear-database');
const requireAll = require('@rowanmanning/require-all');

// Set up mock websites
requireAll(`${__dirname}/mock-websites`);

// Before all tests (setup)
before(() => {

	// Create an Audrey app and save it to a global variable so it's
	// magically available in the other tests and helpers
	process.env.LOG_LEVEL = 'silent';
	process.env.MONGODB_URI = 'mongodb://localhost:27017/audrey-test';
	process.env.SESSION_SECRET = 'test-session-secret';
	global.app = require('../../server');

	// Start the application
	return global.app.start();

});

// After all tests (teardown)
after(async () => {
	await clearDatabase();
	await global.app.stop();
});
