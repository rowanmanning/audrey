'use strict';

// Load configurations from an `.env` file if present
require('dotenv').config();

// Load and start the app
const app = require('./server');
app.start(process.env.PORT || 8080).catch(error => {
	process.exitCode = 1;
	app.log.error({error});
});
