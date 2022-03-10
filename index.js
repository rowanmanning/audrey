'use strict';

const audrey = require('./server');

// Load configurations from an `.env` file if present
require('dotenv').config();

// Create and start the app
audrey()
	.then(app => {
		return app.start(process.env.PORT || 8080);
	})
	.catch(error => {
		process.exitCode = 1;
		console.error(error.stack);
	});
