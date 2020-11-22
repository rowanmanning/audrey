'use strict';

const render = require('../middleware/render');

module.exports = function mountEntriesController(app) {
	const {router} = app;
	const {Entry} = app.models;

	router.get('/entries', [
		fetchAllEntries,
		render('page/entries/list')
	]);

	async function fetchAllEntries(request, response, next) {
		try {
			response.locals.entries = await Entry.fetchAll();
			next();
		} catch (error) {
			next(error);
		}
	}

};
