'use strict';

const paginate = require('../middleware/paginate');
const render = require('../middleware/render');
const requireAuth = require('../middleware/require-auth');

module.exports = function mountEntriesController(app) {
	const {router} = app;
	const {Entry} = app.models;

	router.get('/entries', [
		requireAuth(),
		paginate({
			perPage: 50,
			property: 'entryPagination',
			total: () => Entry.estimatedDocumentCount()
		}),
		listEntries,
		render('page/entries/list')
	]);

	async function listEntries(request, response, next) {
		try {
			request.entries = response.locals.entries = await Entry
				.fetchAll()
				.skip(request.entryPagination.currentPageStartIndex)
				.limit(request.entryPagination.perPage)
				.populate('feed');
			next();
		} catch (error) {
			next(error);
		}
	}

};
