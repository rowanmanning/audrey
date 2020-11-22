'use strict';

const render = require('../middleware/render');

module.exports = function mountHomeController(app) {
	const {router} = app;
	const {Entry} = app.models;

	router.get('/', [
		fetchAllUnreadEntries,
		render('page/home')
	]);

	async function fetchAllUnreadEntries(request, response, next) {
		try {
			response.locals.entries = await Entry.fetchAllUnread();
			next();
		} catch (error) {
			next(error);
		}
	}

};
