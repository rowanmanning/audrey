'use strict';

const paginate = require('../middleware/paginate');
const render = require('../middleware/render');
const requireAuth = require('../middleware/require-auth');

module.exports = function mountBookmarksController(app) {
	const {router} = app;
	const {Entry} = app.models;

	router.get('/bookmarks', [
		requireAuth(),
		paginate({
			perPage: 50,
			property: 'entryPagination',
			total: () => Entry.countBookmarked()
		}),
		listBookmarkedEntries,
		render('page/bookmarks/list')
	]);

	async function listBookmarkedEntries(request, response, next) {
		try {
			await Entry.performScheduledJobs();
			request.entries = response.locals.entries = await Entry
				.fetchBookmarked()
				.skip(request.entryPagination.currentPageStartIndex)
				.limit(request.entryPagination.perPage)
				.populate('feed');
			next();
		} catch (error) {
			next(error);
		}
	}

};
