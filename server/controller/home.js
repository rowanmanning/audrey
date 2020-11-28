'use strict';

const paginate = require('../middleware/paginate');
const render = require('../middleware/render');

module.exports = function mountHomeController(app) {
	const {router} = app;
	const {Entry, Feed} = app.models;

	router.get('/', [
		fetchStats,
		paginate({
			perPage: 50,
			property: 'entryPagination',
			total: () => Entry.countUnread()
		}),
		fetchUnreadEntries,
		render('page/home')
	]);

	async function fetchStats(request, response, next) {
		try {
			const [totalEntryCount, totalFeedCount] = await Promise.all([
				Entry.countAll(),
				Feed.countAll()
			]);
			response.locals.totalEntryCount = totalEntryCount;
			response.locals.totalFeedCount = totalFeedCount;
			next();
		} catch (error) {
			next(error);
		}
	}

	async function fetchUnreadEntries(request, response, next) {
		try {
			response.locals.entries = await Entry
				.fetchUnread()
				.skip(request.entryPagination.currentPageStartIndex)
				.limit(request.entryPagination.perPage)
				.populate('feed');
			next();
		} catch (error) {
			next(error);
		}
	}

};
