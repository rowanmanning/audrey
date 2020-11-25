'use strict';

const redirect = require('../middleware/redirect');

module.exports = function mountEntriesController(app) {
	const {router} = app;

	router.get('/entries', [
		redirect('/')
	]);

};
