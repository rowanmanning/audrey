'use strict';

const AudreyApp = require('../../server/lib/app');
const clearDatabase = require('./helper/clear-database');
const requireAll = require('@rowanmanning/require-all');

// Set up mock websites
requireAll(`${__dirname}/mock-websites`);

// Before all tests (setup)
before(done => {

	// Create an Audrey app and save it to a global variable so it's
	// magically available in the other tests and helpers
	global.app = new AudreyApp({
		basePath: `${__dirname}/../..`,
		databaseUrl: 'mongodb://localhost:27017/audrey-test',
		logger: {
			debug: () => {},
			error: () => {},
			info: () => {}
		},
		port: undefined,
		requestLogFormat: null,
		sessionSecret: 'test-session-secret'
	});

	// If the app errors during setup, stop testing
	global.app.once('setup:error', error => {
		global.app.teardown();
		done(error);
	});

	// Once the app starts and the database is connected, we're ready to test
	let isReady = false;
	async function handleReadyEvent() {
		if (isReady) {

			// This makes sure that settings are created before
			// any requests are made
			await global.app.models.Settings.get();

			return done();
		}
		isReady = true;
	}
	global.app.once('server:started', handleReadyEvent);
	global.app.once('database:connected', handleReadyEvent);

	// Start the application
	global.app.setup();

});

// After all tests (teardown)
after(async () => {
	await clearDatabase();
	global.app.teardown();
});
