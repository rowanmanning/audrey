'use strict';

const paginate = require('../middleware/paginate');
const render = require('../middleware/render');
const requireAuth = require('../middleware/require-auth');

module.exports = function mountFeedsController(app) {
	const {router} = app;
	const {Feed} = app.models;

	router.get('/feeds', [
		requireAuth(),
		paginate({
			perPage: 50,
			property: 'feedPagination',
			total: () => Feed.countAll()
		}),
		listFeeds,
		fetchFeedRefreshStatus,
		render('page/feeds/list')
	]);

	async function listFeeds(request, response, next) {
		try {
			request.feeds = response.locals.feeds = await Feed
				.fetchAll()
				.skip(request.feedPagination.currentPageStartIndex)
				.limit(request.feedPagination.perPage)
				.populate('errors');
			next();
		} catch (error) {
			next(error);
		}
	}

	function fetchFeedRefreshStatus(request, response, next) {
		response.locals.isRefreshInProgress = Feed.isRefreshInProgress();
		next();
	}

};
