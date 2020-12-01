'use strict';

const AudreyApp = require('./server/lib/app');
const dotenv = require('dotenv');

// Load configurations from an `.env` file if present
dotenv.config();

// Create an application, passing in configurations
// from environment variables
const app = new AudreyApp({
	basePath: __dirname,
	databaseUrl: process.env.MONGODB_URI,
	port: process.env.PORT,
	sessionSecret: process.env.SESSION_SECRET,
	updateSchedule: process.env.UPDATE_SCHEDULE
});

// Catch setup errors
app.once('setup:error', error => {
	process.exitCode = 1;
	app.log.error(error.stack);
	app.teardown();
});

// Set up the application
app.setup();
