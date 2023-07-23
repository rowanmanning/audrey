'use strict';

const audrey = require('./server');

// Load configurations from an `.env` file if present
require('dotenv').config();

// Create and start the app
audrey()
	.then(app => {
		async function handleClose() {
			try {
				await app.stop();
				process.exit(0);
			} catch (error) {
				app.log.error({msg: `Server stop failed: ${error.message}`});
				process.exit(1);
			}
		}
		process.on('SIGINT', handleClose);
		process.on('SIGTERM', handleClose);

		return app.start(process.env.PORT || 8080);
	})
	.catch(error => {
		process.exitCode = 1;
		console.error(error.stack);
	});
