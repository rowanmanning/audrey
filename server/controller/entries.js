'use strict';

const redirect = require('../middleware/redirect');

module.exports = function mountEntriesController(app) {
	const {router} = app;
	const {Entry} = app.models;

	router.get('/entries', [
		redirect('/')
	]);

};
