'use strict';

const render = require('../middleware/render');

module.exports = function mountEntriesByIdController(app) {
	const {router} = app;
	const {Entry} = app.models;

	router.get('/entries/:entryId', [
		fetchEntryById,
		markEntryAsRead,
		render('page/entries/view')
	]);

	async function fetchEntryById(request, response, next) {
		try {
			response.locals.entry = await Entry.findById(request.params.entryId).populate('feed');
			if (response.locals.entry) {
				return next();
			}
			next('route');
		} catch (error) {
			next(error);
		}
	}

	async function markEntryAsRead(request, response, next) {
		try {
			await response.locals.entry.markAsRead();
			next();
		} catch (error) {
			next(error);
		}
	}

};
