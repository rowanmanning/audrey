'use strict';

const render = require('../middleware/render');

module.exports = function mountFeedsController(app) {
	const {router} = app;
	const {Feed} = app.models;

	router.get('/feeds', [
		listFeeds,
		fetchFeedRefreshStatus,
		render('page/feeds/list')
	]);

	async function listFeeds(request, response, next) {
		try {
			request.feeds = response.locals.feeds = await Feed.fetchAll().populate('errors');
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
