'use strict';

const render = require('../middleware/render');

module.exports = function mountFeedsByIdController(app) {
	const {router} = app;
	const {Entry, Feed} = app.models;

	router.get('/feeds/:feedId', [
		fetchFeedById,
		fetchFeedEntries,
		render('page/feeds/view')
	]);

	router.post('/feeds/:feedId/sync', [
		fetchFeedById,
		syncFeed
	]);

	async function fetchFeedById(request, response, next) {
		try {
			response.locals.feed = await Feed.findById(request.params.feedId);
			if (response.locals.feed) {
				return next();
			}
			next('route');
		} catch (error) {
			next(error);
		}
	}

	async function fetchFeedEntries(request, response, next) {
		try {
			response.locals.entries = await Entry.fetchAllByFeedId(response.locals.feed._id);
			next();
		} catch (error) {
			next(error);
		}
	}

	async function syncFeed(request, response, next) {
		try {
			await response.locals.feed.sync();
			return response.redirect(response.locals.feed.url);
		} catch (error) {
			next(error);
		}
	}

};
