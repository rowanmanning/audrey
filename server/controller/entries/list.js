'use strict';

const render = require('@rowanmanning/response-render-middleware');
const requireAuth = require('../../middleware/require-auth');
const setQueryParam = require('../../lib/set-query-param');

module.exports = function mountEntriesListController(app) {
	const {Entry} = app.models;

	app.get('/entries', [
		requireAuth(),
		listPaginatedEntries,
		render('page/entries/list')
	]);

	async function listPaginatedEntries(request, response, next) {
		try {
			const entryPagination = await Entry.fetchPaginated(request.query.before, 50);
			response.locals.entryPagination = entryPagination;
			response.locals.entries = entryPagination.items;
			response.locals.nextPage = (
				entryPagination.next ?
					setQueryParam(request.url, 'before', entryPagination.next) :
					null
			);
			next();
		} catch (error) {
			next(error);
		}
	}

};
