'use strict';

const render = require('../middleware/render');

module.exports = function mountHomeController(app) {
	const {router} = app;
	const {Entry} = app.models;

	router.get('/', [
		fetchFilteredEntries,
		render('page/home')
	]);

	async function fetchFilteredEntries(request, response, next) {
		try {
			response.locals.entries = await Entry
				.fetchFiltered({status: request.query.status})
				.populate('feed');
			next();
		} catch (error) {
			next(error);
		}
	}

};
